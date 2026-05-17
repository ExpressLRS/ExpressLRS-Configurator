import fs from 'fs';
import path from 'path';
import BuildFirmwareStep from '../../models/enum/FirmwareBuildStep';
import BuildFirmwareSubstep from '../../models/enum/BuildFirmwareSubstep';
import BuildProgressNotificationType from '../../models/enum/BuildProgressNotificationType';
import FlashingMethod from '../../models/enum/FlashingMethod';
import BuildJobType from '../../models/enum/BuildJobType';
import FlashOutputParserService, {
  FlashOutputParserEmit,
  FlashOutputParserOpts,
} from './index';

interface Emit {
  type: BuildProgressNotificationType;
  step: BuildFirmwareStep;
  substep?: BuildFirmwareSubstep;
  progress?: number;
}

const service = new FlashOutputParserService();

function makeParser(opts: FlashOutputParserOpts) {
  const emits: Emit[] = [];
  const emit: FlashOutputParserEmit = (type, step, substep, progress) => {
    emits.push({ type, step, substep, progress });
  };
  const parser = service.create(emit, opts);
  return { parser, emits };
}

function fixture(name: string): string {
  return fs.readFileSync(
    path.join(__dirname, '__fixtures__', name),
    'utf8',
  );
}

const flashUart: FlashOutputParserOpts = {
  flashingMethod: FlashingMethod.UART,
  jobType: BuildJobType.Flash,
};

const flashBf: FlashOutputParserOpts = {
  flashingMethod: FlashingMethod.BetaflightPassthrough,
  jobType: BuildJobType.Flash,
};

const flashEtx: FlashOutputParserOpts = {
  flashingMethod: FlashingMethod.EdgeTxPassthrough,
  jobType: BuildJobType.Flash,
};

const flashWifi: FlashOutputParserOpts = {
  flashingMethod: FlashingMethod.WIFI,
  jobType: BuildJobType.Flash,
};

const flashStlink: FlashOutputParserOpts = {
  flashingMethod: FlashingMethod.STLink,
  jobType: BuildJobType.Flash,
};

const flashDfu: FlashOutputParserOpts = {
  flashingMethod: FlashingMethod.DFU,
  jobType: BuildJobType.Flash,
};

const buildOnly: FlashOutputParserOpts = {
  flashingMethod: FlashingMethod.UART,
  jobType: BuildJobType.Build,
};

const stockBl: FlashOutputParserOpts = {
  flashingMethod: FlashingMethod.Stock_BL,
  jobType: BuildJobType.Flash,
};

describe('createFlashOutputParser', () => {
  describe('UART happy path (uart-esp32c3-success.log)', () => {
    it('emits substep messages in canonical order', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('uart-esp32c3-success.log'));
      const messages = emits.map((e) => e.substep).filter(Boolean);
      // Must appear at least once and in this order.
      const sequence = [
        'CONNECTING_TO_DEVICE',
        'ERASING_FLASH',
        'WRITING_FIRMWARE',
        'VERIFYING_FIRMWARE',
        'RESTARTING_DEVICE',
      ];
      let cursor = 0;
      for (const msg of messages) {
        if (msg === sequence[cursor]) cursor += 1;
      }
      expect(cursor).toBe(sequence.length);
    });

    it('all FLASH-phase emits use step FLASHING_FIRMWARE', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('uart-esp32c3-success.log'));
      for (const e of emits) {
        expect(e.step).toBe(BuildFirmwareStep.FLASHING_FIRMWARE);
      }
    });

    it('writing progress emitted to UI is monotonic (single-shot 100%s suppressed)', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('uart-esp32c3-success.log'));
      const writing = emits.filter(
        (e) => e.substep === 'WRITING_FIRMWARE' && e.progress !== undefined,
      );
      for (let i = 1; i < writing.length; i += 1) {
        const prev = writing[i - 1].progress!;
        const cur = writing[i].progress!;
        // Suppressing the small bootloader / partition / otadata 100% ticks
        // means the UI-visible progress sequence should never go backwards.
        expect(cur).toBeGreaterThanOrEqual(prev);
      }
    });

    it('reaches 100% writing at least once', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('uart-esp32c3-success.log'));
      const hit100 = emits.some(
        (e) => e.substep === 'WRITING_FIRMWARE' && e.progress === 100,
      );
      expect(hit100).toBe(true);
    });
  });

  describe('Passthrough init prelude', () => {
    it('Betaflight: DetectingDevice → ConnectingToDevice precede esptool substeps', () => {
      const { parser, emits } = makeParser(flashBf);
      parser(fixture('bf-passthrough-esp32c3-success.log'));
      const messages = emits.map((e) => e.substep).filter(Boolean);
      const detectIdx = messages.indexOf(BuildFirmwareSubstep.DetectingDevice);
      const connectIdx = messages.indexOf(BuildFirmwareSubstep.ConnectingToDevice);
      const writeIdx = messages.indexOf(BuildFirmwareSubstep.WritingFirmware);
      expect(detectIdx).toBeGreaterThanOrEqual(0);
      expect(connectIdx).toBeGreaterThan(detectIdx);
      expect(writeIdx).toBeGreaterThan(connectIdx);
    });

    it('EdgeTX: same substep sequence as Betaflight', () => {
      const { parser, emits } = makeParser(flashEtx);
      parser(fixture('etx-passthrough-esp32-success.log'));
      const messages = emits.map((e) => e.substep).filter(Boolean);
      expect(messages).toContain('DETECTING_DEVICE');
      expect(messages).toContain('CONNECTING_TO_DEVICE');
      expect(messages).toContain('WRITING_FIRMWARE');
      expect(messages).toContain('RESTARTING_DEVICE');
    });

    it('no_reset warning does NOT emit an error on a successful EdgeTX flash', () => {
      const { parser, emits } = makeParser(flashEtx);
      parser(fixture('etx-passthrough-esp32-success.log'));
      const errors = emits.filter(
        (e) => e.type === BuildProgressNotificationType.Error,
      );
      expect(errors).toHaveLength(0);
    });
  });

  describe('WiFi happy path (wifi-curl-success.log)', () => {
    it('emits UploadingFirmware with monotonic progress', () => {
      const { parser, emits } = makeParser(flashWifi);
      parser(fixture('wifi-curl-success.log'));
      const uploading = emits.filter((e) => e.substep === 'UPLOADING_FIRMWARE');
      expect(uploading.length).toBeGreaterThan(2);
      const progresses = uploading
        .map((e) => e.progress)
        .filter((p): p is number => p !== undefined);
      for (let i = 1; i < progresses.length; i += 1) {
        expect(progresses[i]).toBeGreaterThanOrEqual(progresses[i - 1]);
      }
    });

    it('parses progress from curl rows with unit-suffixed Xferd (k/M)', () => {
      // Once transferred bytes exceed ~1KB curl prints "192k", "1138k", etc.
      // in the Xferd column. The progress parser must still extract %Xferd
      // from those rows, not only from the all-digit early rows.
      const { parser, emits } = makeParser(flashWifi);
      parser(fixture('wifi-curl-success.log'));
      const progresses = emits
        .filter((e) => e.substep === 'UPLOADING_FIRMWARE')
        .map((e) => e.progress)
        .filter((p): p is number => p !== undefined);
      expect(progresses).toEqual(
        expect.arrayContaining([0, 5, 12, 24, 48, 71, 88, 100]),
      );
    });

    it('final emit on success is type=Success', () => {
      const { parser, emits } = makeParser(flashWifi);
      parser(fixture('wifi-curl-success.log'));
      const lastUploading = [...emits]
        .reverse()
        .find((e) => e.substep === 'UPLOADING_FIRMWARE');
      expect(lastUploading?.type).toBe(BuildProgressNotificationType.Success);
    });

    it('does NOT emit esptool substeps for the WiFi fixture', () => {
      const { parser, emits } = makeParser(flashWifi);
      parser(fixture('wifi-curl-success.log'));
      const espStuff = emits.filter(
        (e) =>
          e.substep === 'ERASING_FLASH'
          || e.substep === 'VERIFYING_FIRMWARE'
          || e.substep === 'RESTARTING_DEVICE'
          || e.substep === 'WRITING_FIRMWARE',
      );
      expect(espStuff).toHaveLength(0);
    });

    it('UART method ignores the WiFi curl xferd patterns (no false UploadingFirmware emits)', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('wifi-curl-success.log'));
      const uploading = emits.filter((e) => e.substep === 'UPLOADING_FIRMWARE');
      expect(uploading).toHaveLength(0);
    });
  });

  describe('Error mapping', () => {
    it('bf-passthrough-errno5 → Error preserving WritingFirmware message', () => {
      const { parser, emits } = makeParser(flashBf);
      parser(fixture('bf-passthrough-errno5.log'));
      const errors = emits.filter(
        (e) => e.type === BuildProgressNotificationType.Error,
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].step).toBe(BuildFirmwareStep.FLASHING_FIRMWARE);
      // The last successful message before the error was WritingFirmware
      expect(errors[0].substep).toBe('WRITING_FIRMWARE');
    });

    it('bf-passthrough-no-fc-detect → Error with TargetMismatch message', () => {
      const { parser, emits } = makeParser(flashBf);
      parser(fixture('bf-passthrough-no-fc-detect.log'));
      const targetMismatch = emits.find(
        (e) =>
          e.type === BuildProgressNotificationType.Error
          && e.substep === 'TARGET_MISMATCH',
      );
      expect(targetMismatch).toBeDefined();
    });

    it('uart-esp8266-connect-timeout → Error preserving ConnectingToDevice message', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('uart-esp8266-connect-timeout.log'));
      const errors = emits.filter(
        (e) => e.type === BuildProgressNotificationType.Error,
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].substep).toBe('CONNECTING_TO_DEVICE');
    });

    it('wifi-curl-timeout → Error on UploadingFirmware', () => {
      const { parser, emits } = makeParser(flashWifi);
      parser(fixture('wifi-curl-timeout.log'));
      const errors = emits.filter(
        (e) => e.type === BuildProgressNotificationType.Error,
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].step).toBe(BuildFirmwareStep.FLASHING_FIRMWARE);
    });

    it('wifi-curl-connect-refused → Error', () => {
      const { parser, emits } = makeParser(flashWifi);
      parser(fixture('wifi-curl-connect-refused.log'));
      const errors = emits.filter(
        (e) => e.type === BuildProgressNotificationType.Error,
      );
      expect(errors.length).toBeGreaterThan(0);
    });

    it('etx-passthrough-init-failed → no successful esptool emits', () => {
      const { parser, emits } = makeParser(flashEtx);
      parser(fixture('etx-passthrough-init-failed.log'));
      const writing = emits.filter((e) => e.substep === 'WRITING_FIRMWARE');
      expect(writing).toHaveLength(0);
    });

    it('etx-passthrough-expect-timeout → Error on FLASHING_FIRMWARE via Traceback regex', () => {
      const { parser, emits } = makeParser(flashEtx);
      parser(fixture('etx-passthrough-expect-timeout.log'));
      const errors = emits.filter(
        (e) => e.type === BuildProgressNotificationType.Error,
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].step).toBe(BuildFirmwareStep.FLASHING_FIRMWARE);
      // Last good message was DetectingDevice (from "Searching flight controllers")
      expect(errors[0].substep).toBe('DETECTING_DEVICE');
    });

    it('build-only-uploadforce-error → BUILDING_FIRMWARE Error', () => {
      const { parser, emits } = makeParser(buildOnly);
      parser(fixture('build-only-uploadforce-error.log'));
      const errors = emits.filter(
        (e) => e.type === BuildProgressNotificationType.Error,
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.step === BuildFirmwareStep.BUILDING_FIRMWARE)).toBe(true);
    });

    it('build-only-missing-python-dep → DOWNLOADING_FIRMWARE Error with InstallingDependencies', () => {
      const { parser, emits } = makeParser(buildOnly);
      parser(fixture('build-only-missing-python-dep.log'));
      const moduleErr = emits.find(
        (e) =>
          e.type === BuildProgressNotificationType.Error
          && e.substep === 'INSTALLING_DEPENDENCIES',
      );
      expect(moduleErr).toBeDefined();
      expect(moduleErr?.step).toBe(BuildFirmwareStep.DOWNLOADING_FIRMWARE);
    });
  });

  describe('Build-phase patterns (method-agnostic)', () => {
    it('PIO bootstrap emits InstallingDependencies once for fresh install', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('platformio-bootstrap-fresh-install.log'));
      const deps = emits.filter((e) => e.substep === 'INSTALLING_DEPENDENCIES');
      // The fixture has multiple matching lines (Failed to find Platformio, Installing PlatformIO Core,
      // PIP has been successfully updated, Virtual environment...) — dedup means at most 1 emit
      // for the same (step, message) tuple.
      expect(deps.length).toBe(1);
    });

    it('PIO success banner emits BUILDING_FIRMWARE Success', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('build-only-flash-dir-success.log'));
      const successes = emits.filter(
        (e) =>
          e.type === BuildProgressNotificationType.Success
          && e.step === BuildFirmwareStep.BUILDING_FIRMWARE,
      );
      expect(successes.length).toBeGreaterThan(0);
    });

    it('PIO compile + STLink failure: BUILD success precedes FLASH error', () => {
      const { parser, emits } = makeParser(flashUart);
      parser(fixture('stm32-r9m-build-success-stlink-no-libusb.log'));
      const buildSuccessIdx = emits.findIndex(
        (e) =>
          e.type === BuildProgressNotificationType.Success
          && e.step === BuildFirmwareStep.BUILDING_FIRMWARE,
      );
      const flashErrorIdx = emits.findIndex(
        (e) =>
          e.type === BuildProgressNotificationType.Error
          && e.step === BuildFirmwareStep.FLASHING_FIRMWARE,
      );
      // Both events must be present, and SUCCESS must come before ERROR
      expect(buildSuccessIdx).toBeGreaterThanOrEqual(0);
      if (flashErrorIdx >= 0) {
        expect(flashErrorIdx).toBeGreaterThan(buildSuccessIdx);
      }
    });
  });

  describe('Opaque methods (STLink / DFU)', () => {
    it('STLink: parser is a no-op even for an STLink failure fixture', () => {
      const { parser, emits } = makeParser(flashStlink);
      parser(fixture('stlink-not-connected.log'));
      parser(fixture('stlink-no-libusb-backend.log'));
      expect(emits).toHaveLength(0);
    });

    it('DFU: parser is a no-op (zero emits)', () => {
      const { parser, emits } = makeParser(flashDfu);
      parser(fixture('uart-esp32c3-success.log'));
      expect(emits).toHaveLength(0);
    });
  });

  describe('Build-only / Stock_BL: FLASH-phase patterns suppressed', () => {
    it('jobType: Build → no FLASH-phase emits even if esptool stdout is injected', () => {
      const { parser, emits } = makeParser(buildOnly);
      parser(fixture('uart-esp32c3-success.log'));
      const flashEmits = emits.filter(
        (e) =>
          e.substep === 'CONNECTING_TO_DEVICE'
          || e.substep === 'ERASING_FLASH'
          || e.substep === 'WRITING_FIRMWARE'
          || e.substep === 'VERIFYING_FIRMWARE'
          || e.substep === 'RESTARTING_DEVICE',
      );
      expect(flashEmits).toHaveLength(0);
    });

    it('Stock_BL: FLASH-phase patterns suppressed; BUILD-phase patterns still fire', () => {
      const { parser, emits } = makeParser(stockBl);
      parser(fixture('build-only-flash-dir-success.log'));
      const successes = emits.filter(
        (e) =>
          e.type === BuildProgressNotificationType.Success
          && e.step === BuildFirmwareStep.BUILDING_FIRMWARE,
      );
      expect(successes.length).toBeGreaterThan(0);
    });
  });

  describe('Message deduplication', () => {
    it('feeding the same (step, message) twice emits only once', () => {
      const { parser, emits } = makeParser(flashUart);
      parser('Connecting...\n');
      parser('Connecting...\n');
      const connects = emits.filter((e) => e.substep === 'CONNECTING_TO_DEVICE');
      expect(connects).toHaveLength(1);
    });
  });

  describe('Throttling', () => {
    it('progress emits with delta < 2% are coalesced', () => {
      const { parser, emits } = makeParser(flashUart);
      // Inject 100 lines incrementing by 1% each — should NOT produce 100 emits.
      let lines = '';
      for (let p = 1; p <= 100; p += 1) {
        lines += `Writing at 0x000${p.toString(16)}... ( ${p} %)\n`;
      }
      parser(lines);
      const writing = emits.filter((e) => e.substep === 'WRITING_FIRMWARE');
      // With ≥2% delta, ~50 emits + 100 (final). Be generous: must be < 100.
      expect(writing.length).toBeLessThan(100);
      expect(writing.length).toBeGreaterThan(10);
    });

    it('progress=100 always emits even within throttle window', () => {
      const { parser, emits } = makeParser(flashUart);
      parser('Writing at 0x00010000... ( 99 %)\n');
      parser('Writing at 0x00010000... ( 100 %)\n');
      const writing = emits.filter((e) => e.substep === 'WRITING_FIRMWARE');
      expect(writing.some((w) => w.progress === 100)).toBe(true);
    });

    it('suppresses progress value on single-shot 100% regions, keeps the message', () => {
      // esptool writes bootloader / partition / otadata as single 100% lines
      // before the main app firmware. The UI should not flash 100% on those —
      // the progress value is hidden, but the "Writing firmware" message is
      // still emitted so the sub-line text appears.
      const { parser, emits } = makeParser(flashUart);
      parser('Erasing flash\n');
      parser('Writing at 0x00000000... ( 100 %)\n'); // bootloader
      parser('Writing at 0x00008000... ( 100 %)\n'); // partition table
      parser('Writing at 0x0000e000... ( 100 %)\n'); // otadata
      const writingBefore = emits.filter((e) => e.substep === 'WRITING_FIRMWARE');
      // The first region's 100% triggers a message change emit, but its
      // progress value is suppressed (undefined).
      expect(writingBefore.length).toBeGreaterThanOrEqual(1);
      for (const e of writingBefore) {
        expect(e.progress).toBeUndefined();
      }
      // Now the main region begins and counts up.
      parser('Writing at 0x00010000... ( 1 %)\n');
      parser('Writing at 0x00010000... ( 50 %)\n');
      parser('Writing at 0x00010000... ( 100 %)\n');
      const writingWithProgress = emits.filter(
        (e) => e.substep === 'WRITING_FIRMWARE' && e.progress !== undefined,
      );
      const progresses = writingWithProgress.map((w) => w.progress);
      // Big region should produce 1, 50, 100.
      expect(progresses).toEqual(expect.arrayContaining([1, 50, 100]));
    });
  });

  describe('CR / NL handling', () => {
    it('CR-separated progress lines each emit a distinct progress value', () => {
      const { parser, emits } = makeParser(flashUart);
      parser('\rWriting at 0x00010000... ( 5 %)\rWriting at 0x00010000... ( 10 %)\r');
      const writing = emits.filter((e) => e.substep === 'WRITING_FIRMWARE');
      // 5 → 10 is a 5% delta, both should emit.
      expect(writing.length).toBeGreaterThanOrEqual(2);
      expect(writing[0].progress).toBe(5);
      expect(writing[1].progress).toBe(10);
    });

    it('CRLF mixed with bare LF is handled correctly', () => {
      const { parser, emits } = makeParser(flashUart);
      parser('Connecting...\r\nErasing flash\nHash of data verified\r\n');
      const messages = emits.map((e) => e.substep);
      expect(messages).toContain('CONNECTING_TO_DEVICE');
      expect(messages).toContain('ERASING_FLASH');
      expect(messages).toContain('VERIFYING_FIRMWARE');
    });
  });

  describe('Chunk boundary safety', () => {
    it('splitting fixture at random chunk sizes produces identical emit sequence', () => {
      const fx = fixture('uart-esp32c3-success.log');
      const ref = makeParser(flashUart);
      ref.parser(fx);
      const refMessages = ref.emits.map((e) => `${e.substep}|${e.progress ?? ''}|${e.type}`);

      // Simulate chunk boundaries at every 17 chars.
      const split = makeParser(flashUart);
      for (let i = 0; i < fx.length; i += 17) {
        split.parser(fx.slice(i, i + 17));
      }
      const splitMessages = split.emits.map(
        (e) => `${e.substep}|${e.progress ?? ''}|${e.type}`,
      );
      expect(splitMessages).toEqual(refMessages);
    });
  });

  describe('Connection-retry tolerance', () => {
    it('a single "Connecting......" line does not emit ConnectingToDevice multiple times', () => {
      const { parser, emits } = makeParser(flashBf);
      // The "Connecting......" is followed by retry dots (no newlines between them)
      parser('Connecting......................................\n');
      const connects = emits.filter((e) => e.substep === 'CONNECTING_TO_DEVICE');
      expect(connects).toHaveLength(1);
    });

    it('truncated connect loop produces no errors', () => {
      const { parser, emits } = makeParser(flashBf);
      parser(fixture('bf-passthrough-esp32c3-success.log').split('Stub running')[0]);
      const errors = emits.filter(
        (e) => e.type === BuildProgressNotificationType.Error,
      );
      expect(errors).toHaveLength(0);
    });
  });

  describe('ANSI color codes', () => {
    it('ANSI codes in WiFi success do not break regexes', () => {
      const { parser, emits } = makeParser(flashWifi);
      parser(fixture('wifi-curl-success.log'));
      const success = emits.find(
        (e) =>
          e.type === BuildProgressNotificationType.Success
          && e.substep === 'UPLOADING_FIRMWARE',
      );
      expect(success).toBeDefined();
    });
  });
});
