import fs from 'fs';
import { ReceiverHardware } from './rxConfig';

const UNDEFINED_PIN = -1;

const pin = (value: unknown): number | undefined => {
  if (typeof value !== 'number' || value === UNDEFINED_PIN) {
    return undefined;
  }
  return value;
};

/**
 * What the selected receiver is able to do, so the user is not offered
 * settings the hardware cannot deliver, ie. a power level above what its
 * amplifier supports.
 */
export interface ReceiverCapabilitiesData {
  powerMin: number;
  powerMax: number;
  powerDefault: number;
  hasSerial1: boolean;
  pwmChannelCount: number;
  /**
   * Dual radio receivers take their antenna mode from the transmitter over the
   * air, so it is not something that can be set beforehand.
   */
  dualRadio: boolean;
  /**
   * Only a receiver with an antenna switch can be told which antenna to use,
   * which is the same condition the firmware puts on its own Lua entry.
   */
  hasAntennaSwitch: boolean;
}

const asNumber = (value: unknown, fallback: number): number =>
  typeof value === 'number' ? value : fallback;

const pwmOutputCount = (source: Record<string, unknown>): number =>
  (Array.isArray(source.pwm_outputs) ? source.pwm_outputs.length : 0);

export const parseReceiverCapabilities = (
  layout: unknown,
): ReceiverCapabilitiesData => {
  const source = (layout ?? {}) as Record<string, unknown>;
  const powerMin = asNumber(source.power_min, 0);
  const powerMax = Math.max(powerMin, asNumber(source.power_max, powerMin));
  return {
    powerMin,
    powerMax,
    // the firmware keeps its default inside the range it can deliver
    powerDefault: Math.min(
      Math.max(asNumber(source.power_default, powerMin), powerMin),
      powerMax,
    ),
    /*
     * Only targets with their own pins for it. The firmware also lets a servo
     * output be remapped to the second serial, but that mapping is not part of
     * what is written here, and the configuration written here resets those
     * outputs, so the protocol would have no way to reach a pin.
     */
    hasSerial1:
      pin(source.serial1_rx) !== undefined
      || pin(source.serial1_tx) !== undefined,
    pwmChannelCount: pwmOutputCount(source),
    dualRadio: pin(source.radio_nss_2) !== undefined,
    hasAntennaSwitch: pin(source.ant_ctrl) !== undefined,
  };
};

/**
 * Reads the pin assignment out of a target hardware layout, the same file the
 * firmware reads at runtime. The default output mode of every PWM channel
 * depends on it, so a configuration built without it would drive I2C or serial
 * pins as servo outputs.
 */
export const parseReceiverHardware = (
  layout: unknown,
  platform?: string,
): ReceiverHardware => {
  const source = (layout ?? {}) as Record<string, unknown>;
  const pwmOutputs = Array.isArray(source.pwm_outputs)
    ? (source.pwm_outputs as unknown[]).map((value) => Number(value))
    : undefined;
  return {
    pwmOutputs,
    pwmOutOnly: source.pwm_out_only === true,
    platform,
    scl: pin(source.i2c_scl),
    sda: pin(source.i2c_sda),
    serialRx: pin(source.serial_rx),
    serialTx: pin(source.serial_tx),
    serial1Rx: pin(source.serial1_rx),
    serial1Tx: pin(source.serial1_tx),
    antennaControl: pin(source.ant_ctrl),
    // power range, dual radio and the second serial port come from the same
    // layout and are what the user interface asks about separately
    ...parseReceiverCapabilities(layout),
  };
};

/**
 * A device may adjust its layout through the overlay in targets.json, which is
 * how variants of the same board differ. Power limits and the pins of the
 * second serial port are commonly set this way, so the overlay has to be
 * applied before anything is read out of a layout.
 */
export const applyLayoutOverlay = (
  layout: unknown,
  overlay?: Record<string, unknown> | null,
): unknown => {
  // an overlay on its own describes nothing, a missing layout stays missing
  if (layout === null || layout === undefined) {
    return null;
  }
  if (!overlay) {
    return layout;
  }
  return {
    ...((layout ?? {}) as Record<string, unknown>),
    ...overlay,
  };
};

/**
 * Layouts live next to targets.json, split into an RX and a TX folder, the
 * same way the firmware tooling looks them up.
 */
export const layoutFileName = (
  firmwareName: string,
  layoutFile: string,
): string => {
  const folder = firmwareName.includes('_TX') ? 'TX' : 'RX';
  return `${folder}/${layoutFile}`;
};

export const loadTargetLayout = async (
  layoutPath: string,
): Promise<unknown> => {
  if (!fs.existsSync(layoutPath)) {
    return null;
  }
  try {
    return JSON.parse(await fs.promises.readFile(layoutPath, 'utf8'));
  } catch {
    return null;
  }
};
