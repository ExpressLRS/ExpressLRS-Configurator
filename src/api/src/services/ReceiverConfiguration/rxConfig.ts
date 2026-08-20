/**
 * Serialisation of the ExpressLRS receiver configuration (rx_config_t).
 *
 * Mirrors src/lib/CONFIG/config.h of the firmware. The layout is config
 * version 11, which ExpressLRS uses since 4.0. Bit fields are
 * packed least significant bit first, as GCC does on the little endian
 * ESP targets.
 *
 *   0  version (magic | version)   12  flash_discriminator
 *   4  uid[6]                      16  vbat scale + offset
 *  10  unused padding              20  bindStorage:2 power:4 antennaMode:2
 *  11  serial1Protocol:4           21  powerOnCounter:2 forceTlmOff:1 rateInitialIdx:5
 *                                  22  modelId
 *                                  23  serialProtocol:4 failsafeMode:2 antennaGroup:1
 *  24  pwmChannels[16]             88  teamraceChannel:4 teamracePosition:3 pitMode:1
 *                                  89  targetSysId   90  sourceSysId
 */

export const RX_CONFIG_VERSION = 11;
export const RX_CONFIG_MAGIC = 0x80000000;
export const RX_CONFIG_SIZE = 91;

/** model match is off when the id is outside the range the firmware matches */
export const MODEL_MATCH_OFF = 0xff;
const MODEL_MATCH_COUNT = 64;

/** matches eServoOutputMode in the firmware */
export enum ServoOutputMode {
  Servo50Hz = 0,
  Serial = 10,
  SCL = 11,
  SDA = 12,
  Serial1RX = 14,
  Serial1TX = 15,
}

const US_CHANNEL_VALUE_MIN = 476;
const US_CHANNEL_VALUE_EXT_MIN = 880;
const US_CHANNEL_VALUE_CENTER = 1500;
const PWM_MAX_CHANNELS = 16;
const THROTTLE_CHANNEL = 2;
const TEAMRACE_CHANNEL_AUX7 = 10;

export interface ReceiverSettings {
  /** eSerialProtocol, the main serial output */
  serialProtocol?: number;
  /** eSerial1Protocol, ESP32 only, 0 is off */
  serial1Protocol?: number;
  /** eFailsafeMode */
  failsafeMode?: number;
  /** 0 = antenna 1, 1 = antenna 2, 2 = diversity */
  antennaMode?: number;
  /** rx_config_bindstorage_t: 0 persistent, 1 volatile, 2 returnable */
  bindStorage?: number;
  /** 0-63, or 255 to switch model match off */
  modelId?: number;
  forceTlmOff?: boolean;
  rateInitialIdx?: number;
  power?: number;
  /** channel the team race position is read from, AUX1 = 4 .. AUX12 = 15 */
  teamraceChannel?: number;
  /** 0 disables team race, 1-7 are the switch positions */
  teamracePosition?: number;
  /** mavlink system ids */
  targetSysId?: number;
  sourceSysId?: number;
}

/**
 * The pin assignment of the target, taken from its hardware layout. The
 * firmware derives the default PWM output modes from these pins, so without
 * them a generated configuration would drive I2C or serial pins as servo
 * outputs.
 */
export interface ReceiverHardware {
  pwmOutputs?: number[];
  scl?: number;
  sda?: number;
  serialRx?: number;
  serialTx?: number;
  serial1Rx?: number;
  serial1Tx?: number;
  antennaControl?: number;
  dualRadio?: boolean;
  /** power levels the amplifier of this target supports */
  powerMin?: number;
  powerMax?: number;
  powerDefault?: number;
  /** true when the target has no pins other than PWM outputs */
  pwmOutOnly?: boolean;
  /** esp32, esp32-c3 or esp32-s3, which decides where UART0 sits */
  platform?: string;
}

export interface ReceiverConfigInput {
  settings: ReceiverSettings;
  hardware?: ReceiverHardware;
  /** UID the firmware was built with, from its options block */
  uid?: number[];
  /** flash discriminator of the firmware, so it does not overwrite the UID */
  flashDiscriminator?: number;
}

/**
 * UART0 is not on the same pins on every chip, and the firmware picks the mode
 * of a PWM output by comparing against them.
 */
const uart0Pins = (platform?: string): { rx: number; tx: number } => {
  switch (platform) {
    case 'esp32-c3':
      return { rx: 20, tx: 21 };
    case 'esp32-s3':
      return { rx: 44, tx: 43 };
    default:
      return { rx: 3, tx: 1 };
  }
};

const defaultPwmMode = (
  channel: number,
  hardware: ReceiverHardware,
): ServoOutputMode => {
  const pins = hardware.pwmOutputs ?? [];
  if (hardware.pwmOutOnly || channel >= pins.length) {
    return ServoOutputMode.Servo50Hz;
  }
  const pin = pins[channel];
  const uart0 = uart0Pins(hardware.platform);
  if (pin === hardware.scl) {
    return ServoOutputMode.SCL;
  }
  if (pin === hardware.sda) {
    return ServoOutputMode.SDA;
  }
  if (
    (hardware.serialRx === uart0.rx && pin === uart0.rx)
    || (hardware.serialTx === uart0.tx && pin === uart0.tx)
  ) {
    return ServoOutputMode.Serial;
  }
  if (pin === hardware.serial1Rx) {
    return ServoOutputMode.Serial1RX;
  }
  if (pin === hardware.serial1Tx) {
    return ServoOutputMode.Serial1TX;
  }
  return ServoOutputMode.Servo50Hz;
};

export const packPwmChannel = (
  failsafe: number,
  inputChannel: number,
  inverted: boolean,
  mode: number,
  stretched: boolean,
): number => {
  return (
    ((failsafe & 0x7ff)
      | ((inputChannel & 0x0f) << 11)
      | ((inverted ? 1 : 0) << 15)
      | ((mode & 0x0f) << 16)
      | ((stretched ? 1 : 0) << 20))
    >>> 0
  );
};

/** the receiver follows the transmitter instead of using a fixed level */
export const POWER_MATCH_TX = 8;

/**
 * Keeps the power within what the target supports, the way the firmware does
 * when it loads a configuration. Following the transmitter is not a level and
 * is left alone.
 */
export const resolvePower = (
  requested: number | undefined,
  hardware: ReceiverHardware,
): number => {
  const fallback = hardware.powerDefault ?? hardware.powerMin ?? 0;
  const power = requested ?? fallback;
  if (power === POWER_MATCH_TX) {
    return power;
  }
  const min = hardware.powerMin ?? 0;
  const max = hardware.powerMax ?? power;
  return Math.min(Math.max(power, min), max);
};

const defaultAntennaMode = (hardware: ReceiverHardware): number => {
  if (hardware.dualRadio) {
    // dual radio targets are told their mode by the transmitter, the firmware
    // default for them is 0
    return 0;
  }
  if (hardware.antennaControl !== undefined) {
    return 2; // diversity
  }
  return 0;
};

/**
 * Builds rx_config_t the way the firmware would after a factory reset, with the
 * requested settings applied on top.
 */
export const buildRxConfig = ({
  settings,
  hardware = {},
  uid,
  flashDiscriminator,
}: ReceiverConfigInput): Buffer => {
  const config = Buffer.alloc(RX_CONFIG_SIZE, 0);

  config.writeUInt32LE((RX_CONFIG_MAGIC | RX_CONFIG_VERSION) >>> 0, 0);

  if (uid && uid.length === 6) {
    Buffer.from(uid).copy(config, 4);
  }
  if (flashDiscriminator !== undefined) {
    config.writeUInt32LE(flashDiscriminator >>> 0, 12);
  }

  const bindStorage = settings.bindStorage ?? 0;
  const power = resolvePower(settings.power, hardware);
  // only a target with an antenna switch can be pointed at an antenna, for
  // everything else the firmware default applies no matter what was asked
  const antennaMode = hardware.antennaControl !== undefined
    ? settings.antennaMode ?? defaultAntennaMode(hardware)
    : defaultAntennaMode(hardware);
  config[20] = (bindStorage & 0x03)
    | ((power & 0x0f) << 2)
    | ((antennaMode & 0x03) << 6);

  const rateInitialIdx = settings.rateInitialIdx ?? 0;
  config[21] = ((settings.forceTlmOff ? 1 : 0) << 2)
    | ((rateInitialIdx & 0x1f) << 3);

  // model match is off for anything outside the range the firmware matches on
  const modelId = settings.modelId ?? MODEL_MATCH_OFF;
  config[22] = modelId >= 0 && modelId < MODEL_MATCH_COUNT
    ? modelId
    : MODEL_MATCH_OFF;

  config[23] = (settings.serialProtocol ?? 0) & 0x0f
    | (((settings.failsafeMode ?? 0) & 0x03) << 4);

  // a target without pins for a second serial must not carry a protocol for it
  const hasSerial1 = hardware.serial1Rx !== undefined
    || hardware.serial1Tx !== undefined;
  config[11] = hasSerial1 ? (settings.serial1Protocol ?? 0) & 0x0f : 0;

  for (let channel = 0; channel < PWM_MAX_CHANNELS; channel++) {
    // channel 2 is throttle, which fails safe to its minimum instead of centre
    const failsafe = channel === THROTTLE_CHANNEL
      ? US_CHANNEL_VALUE_EXT_MIN - US_CHANNEL_VALUE_MIN
      : US_CHANNEL_VALUE_CENTER - US_CHANNEL_VALUE_MIN;
    config.writeUInt32LE(
      packPwmChannel(
        failsafe,
        channel,
        false,
        defaultPwmMode(channel, hardware),
        false,
      ),
      24 + channel * 4,
    );
  }

  config[88] = ((settings.teamraceChannel ?? TEAMRACE_CHANNEL_AUX7) & 0x0f)
    | (((settings.teamracePosition ?? 0) & 0x07) << 4);
  config[89] = (settings.targetSysId ?? 0) & 0xff;
  config[90] = (settings.sourceSysId ?? 0) & 0xff;

  return config;
};

/**
 * Pads the configuration to the size the firmware reserves for it, which is
 * what both storage backends hold.
 */
export const padToEepromSize = (config: Buffer, size: number): Buffer => {
  const image = Buffer.alloc(size, 0);
  config.copy(image, 0, 0, Math.min(config.length, size));
  return image;
};
