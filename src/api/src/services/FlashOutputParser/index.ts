import { Service } from 'typedi';
import BuildFirmwareStep from '../../models/enum/FirmwareBuildStep';
import BuildFirmwareSubstep from '../../models/enum/BuildFirmwareSubstep';
import BuildProgressNotificationType from '../../models/enum/BuildProgressNotificationType';
import FlashingMethod from '../../models/enum/FlashingMethod';
import BuildJobType from '../../models/enum/BuildJobType';

export type FlashOutputParserEmit = (
  type: BuildProgressNotificationType,
  step: BuildFirmwareStep,
  substep?: BuildFirmwareSubstep,
  progress?: number,
) => void;

export interface FlashOutputParserOpts {
  flashingMethod: FlashingMethod;
  jobType: BuildJobType;
}

export type FlashOutputParser = (chunk: string) => void;

export enum ParserGroup {
  Esptool = 'esptool',
  PassthroughInit = 'passthrough-init',
  WifiCurl = 'wifi-curl',
  Build = 'build',
}

const PROGRESS_DELTA_THRESHOLD = 2;

function groupsFor(opts: FlashOutputParserOpts): Set<ParserGroup> {
  // STLink + DFU are opaque in v1 — no parser activity.
  if (
    opts.flashingMethod === FlashingMethod.STLink
    || opts.flashingMethod === FlashingMethod.DFU
  ) {
    return new Set();
  }

  // Build-related patterns fire for every non-opaque method. PIO compile output
  // is method-agnostic — even build-only / Stock_BL / Zip go through compile.
  const groups = new Set<ParserGroup>([ParserGroup.Build]);

  // For Build-only jobs and Stock_BL / Zip, there is no flash phase — skip
  // the flash-phase regex groups so curl / esptool noise from unrelated
  // tools cannot accidentally fire substeps.
  if (
    opts.jobType === BuildJobType.Build
    || opts.flashingMethod === FlashingMethod.Stock_BL
    || opts.flashingMethod === FlashingMethod.Zip
  ) {
    return groups;
  }

  if (opts.flashingMethod === FlashingMethod.WIFI) {
    groups.add(ParserGroup.WifiCurl);
    return groups;
  }

  groups.add(ParserGroup.Esptool);
  if (
    opts.flashingMethod === FlashingMethod.BetaflightPassthrough
    || opts.flashingMethod === FlashingMethod.EdgeTxPassthrough
    || opts.flashingMethod === FlashingMethod.Passthrough
  ) {
    groups.add(ParserGroup.PassthroughInit);
  }
  return groups;
}

interface Rule {
  group: ParserGroup;
  pattern: RegExp;
  step: BuildFirmwareStep;
  substep?: BuildFirmwareSubstep;
  type?: BuildProgressNotificationType; // override default Info
  hasProgress?: boolean; // capture group 1 = progress %
  silent?: boolean; // matches the pattern but emits nothing
  useCurrentStep?: boolean; // emit on state.lastStep if set, else rule.step
}

const RULES: Rule[] = [
  // ---------------- passthrough-init group ----------------
  {
    group: ParserGroup.PassthroughInit,
    pattern: /\*\* Searching flight controllers \*\*|\*\* No FC found/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.DetectingDevice,
  },
  {
    group: ParserGroup.PassthroughInit,
    pattern: /Enabling serial passthrough|={4,}\s*RESET TO BOOTLOADER\s*={4,}/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.ConnectingToDevice,
  },
  {
    group: ParserGroup.PassthroughInit,
    pattern: /Cannot detect RX target/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
    substep: BuildFirmwareSubstep.TargetMismatch,
  },

  // ---------------- esptool group ----------------
  {
    group: ParserGroup.Esptool,
    pattern: /Connecting\.\.\.|Serial port .* opened|Detecting chip type/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.ConnectingToDevice,
  },
  {
    group: ParserGroup.Esptool,
    pattern: /Erasing flash|Chip erase complete|Flash will be erased/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.ErasingFlash,
  },
  {
    group: ParserGroup.Esptool,
    pattern: /Writing at 0x[0-9a-fA-F]+[.\s]*\(\s*(\d+)\s*%\s*\)/,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.WritingFirmware,
    hasProgress: true,
  },
  {
    group: ParserGroup.Esptool,
    pattern: /Hash of data verified/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.VerifyingFirmware,
  },
  {
    group: ParserGroup.Esptool,
    pattern: /Hard resetting|Soft resetting|Staying in bootloader/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.RestartingDevice,
  },
  // no_reset is a warning, not an error — log-only.
  {
    group: ParserGroup.Esptool,
    pattern: /no_reset.*was selected.*Connection may fail/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    silent: true,
  },
  // esptool errors
  {
    group: ParserGroup.Esptool,
    pattern: /A fatal error occurred|Failed to connect|Timed out waiting for packet/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
  },
  {
    // Serial-layer faults that happen during esptool writes (USB yank, FC reboot, etc.)
    group: ParserGroup.Esptool,
    pattern: /SerialException|\[Errno 5\] Input\/output error/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
  },

  // ---------------- wifi-curl group ----------------
  {
    group: ParserGroup.WifiCurl,
    pattern: /\*\* UPLOADING TO:\s*http/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.UploadingFirmware,
  },
  {
    // curl xferd column: %Total Total %Recv Recv %Xferd Xferd AvgDload AvgUpload ...
    // We match the data row (not header), capturing the %Xferd column (group 1).
    // Byte-count columns (Total/Recv/Xferd/AvgDload/AvgUpload) may carry a
    // unit suffix (e.g. "151k", "2M") once values exceed ~1KB, so allow \S*.
    group: ParserGroup.WifiCurl,
    pattern: /^\s*\d+\s+\d+\S*\s+\d+\s+\d+\S*\s+(\d+)\s+\d+\S*\s+\d+\S*\s+/m,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    substep: BuildFirmwareSubstep.UploadingFirmware,
    hasProgress: true,
  },
  {
    group: ParserGroup.WifiCurl,
    pattern: /UPLOAD SUCCESS|Update complete/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    type: BuildProgressNotificationType.Success,
    substep: BuildFirmwareSubstep.UploadingFirmware,
  },
  {
    group: ParserGroup.WifiCurl,
    pattern: /WIFI upload FAILED|curl:\s*\(\d+\)|Operation timed out|Couldn't connect to server/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
  },

  // ---------------- build group ----------------
  // The build group covers PIO compile / install output, which is method-agnostic
  // and fires regardless of FLASH-phase activity.
  {
    group: ParserGroup.Build,
    pattern: /Failed to find Platformio|Installing PlatformIO Core/i,
    step: BuildFirmwareStep.DOWNLOADING_FIRMWARE,
    substep: BuildFirmwareSubstep.InstallingDependencies,
  },
  {
    group: ParserGroup.Build,
    pattern: /Virtual environment has been successfully created|PIP has been successfully updated/i,
    step: BuildFirmwareStep.DOWNLOADING_FIRMWARE,
    substep: BuildFirmwareSubstep.InstallingDependencies,
  },
  {
    group: ParserGroup.Build,
    pattern: /Compiling \.pio[\\/].+\.o\b/i,
    step: BuildFirmwareStep.BUILDING_FIRMWARE,
    substep: BuildFirmwareSubstep.CompilingFirmware,
  },
  {
    group: ParserGroup.Build,
    pattern: /Linking \.pio[\\/].+\.elf/i,
    step: BuildFirmwareStep.BUILDING_FIRMWARE,
    substep: BuildFirmwareSubstep.CompilingFirmware,
  },
  {
    group: ParserGroup.Build,
    pattern: /Building \.pio[\\/].+\.bin/i,
    step: BuildFirmwareStep.BUILDING_FIRMWARE,
    substep: BuildFirmwareSubstep.PackagingFirmware,
  },
  {
    group: ParserGroup.Build,
    pattern: /={4,}\s*\[SUCCESS\]\s+Took\s+[\d.]+\s+seconds\s*={4,}/i,
    step: BuildFirmwareStep.BUILDING_FIRMWARE,
    type: BuildProgressNotificationType.Success,
  },
  {
    group: ParserGroup.Build,
    pattern: /={4,}\s*\[FAILED\]\s+Took\s+[\d.]+\s+seconds\s*={4,}/i,
    step: BuildFirmwareStep.BUILDING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
  },
  {
    group: ParserGroup.Build,
    pattern: /ModuleNotFoundError: No module named/i,
    step: BuildFirmwareStep.DOWNLOADING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
    substep: BuildFirmwareSubstep.InstallingDependencies,
  },
  {
    group: ParserGroup.Build,
    pattern: /uploadforce.*Stop|No matching target/i,
    step: BuildFirmwareStep.BUILDING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
  },
  {
    group: ParserGroup.Build,
    pattern: /\*\*\* \[\S+\] Error/i,
    step: BuildFirmwareStep.BUILDING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
  },
  {
    group: ParserGroup.Build,
    pattern: /Copy .* to SD card and choose flash ext\. ELRS/i,
    step: BuildFirmwareStep.BUILDING_FIRMWARE,
    silent: true,
  },

  // Generic Python traceback — fires for any unhandled exception in the flasher
  // toolchain (e.g. ETXinitPassthrough timing out with ExpectTimeout, STLink
  // raising StlinkException, etc.). Attributed to whichever phase we're in,
  // preserving the last message as context for the UI sub-line.
  {
    group: ParserGroup.Build,
    pattern: /^Traceback \(most recent call last\):/i,
    step: BuildFirmwareStep.FLASHING_FIRMWARE,
    type: BuildProgressNotificationType.Error,
    useCurrentStep: true,
  },
];

interface ParserState {
  lastStep: BuildFirmwareStep | null;
  lastSubstep: BuildFirmwareSubstep | null;
  lastProgress: number | null;
  buffer: string;
}

@Service()
export default class FlashOutputParserService {
  /**
   * Build a per-flash parser bound to the given emit callback and options.
   * The returned function is a stateful closure — instantiate one per
   * buildFlashFirmware invocation.
   */
  create(
    emit: FlashOutputParserEmit,
    opts: FlashOutputParserOpts,
  ): FlashOutputParser {
    const groups = groupsFor(opts);
    if (groups.size === 0) {
      return () => {};
    }
    const activeRules = RULES.filter((rule) => groups.has(rule.group));

    const state: ParserState = {
      lastStep: null,
      lastSubstep: null,
      lastProgress: null,
      buffer: '',
    };

    const tryEmit = (
      type: BuildProgressNotificationType,
      step: BuildFirmwareStep,
      substep: BuildFirmwareSubstep | undefined,
      progress: number | undefined,
    ) => {
      // Errors and Successes always emit — they signal state transitions
      // (failed / completed) that the UI must reflect even if step+substep
      // happen to be unchanged from the last Info emit.
      if (
        type === BuildProgressNotificationType.Error
        || type === BuildProgressNotificationType.Success
      ) {
        const resolvedSubstep = substep ?? state.lastSubstep ?? undefined;
        if (substep !== undefined) {
          state.lastSubstep = substep;
        }
        state.lastStep = step;
        if (progress !== undefined) {
          state.lastProgress = progress;
        }
        emit(type, step, resolvedSubstep, progress);
        return;
      }

      const stepChanged = state.lastStep !== step;
      const substepChanged
        = substep !== undefined && state.lastSubstep !== substep;

      // Compute whether progress changed enough to forward, and separately
      // whether the value should actually be shown to the UI.
      // esptool writes flash in multiple regions; the small bootloader /
      // partition / otadata regions each emit a single "Writing at … (100 %)"
      // line which would otherwise briefly flash the bar to 100% before the
      // main app firmware region begins counting from 1%. We hide those
      // single-shot 100% values while still emitting the substep itself so the
      // stepper sub-line says "Writing firmware …".
      let progressChanged = false;
      let progressForEmit: number | undefined;
      if (progress !== undefined) {
        const last = state.lastProgress;
        if (
          last === null
          || progress < last // region rewind (new flash region begins)
          || progress - last >= PROGRESS_DELTA_THRESHOLD
          || (progress === 100 && last !== null && last < 100)
        ) {
          progressChanged = true;
        }
        // Suppress the progress *value* (not the emit) on single-shot 100%
        // ticks — typical of esptool's tiny non-app regions.
        const isSingleShotHundred
          = progress === 100
            && (substep === undefined
              || state.lastSubstep !== substep
              || last === null
              || last === 100);
        if (progressChanged && !isSingleShotHundred) {
          progressForEmit = progress;
        }
      }

      if (!stepChanged && !substepChanged && !progressChanged) {
        return;
      }

      if (substep !== undefined) {
        state.lastSubstep = substep;
      }
      state.lastStep = step;
      if (progress !== undefined) {
        state.lastProgress = progress;
      }
      emit(
        type,
        step,
        substep ?? state.lastSubstep ?? undefined,
        progressForEmit,
      );
    };

    const processLine = (line: string) => {
      if (line.length === 0) return;
      for (const rule of activeRules) {
        const match = line.match(rule.pattern);
        if (!match) continue;
        if (rule.silent) {
          return;
        }
        let progress: number | undefined;
        if (rule.hasProgress && match[1] !== undefined) {
          const parsed = parseInt(match[1], 10);
          if (!Number.isNaN(parsed)) {
            progress = parsed;
          }
        }
        const type = rule.type ?? BuildProgressNotificationType.Info;
        const step = rule.useCurrentStep
          ? state.lastStep ?? rule.step
          : rule.step;
        tryEmit(type, step, rule.substep, progress);
        return; // one rule per line — first match wins
      }
    };

    return (chunk: string) => {
      if (chunk.length === 0) return;
      // Split on both \r and \n. esptool writes progress with \r to overwrite,
      // and Windows-generated logs mix CRLF with bare LF. Treat each as a line break.
      const combined = state.buffer + chunk;
      let cursor = 0;
      for (let i = 0; i < combined.length; i += 1) {
        const ch = combined[i];
        if (ch === '\n' || ch === '\r') {
          const line = combined.slice(cursor, i);
          processLine(line);
          cursor = i + 1;
        }
      }
      state.buffer = combined.slice(cursor);
    };
  }
}
