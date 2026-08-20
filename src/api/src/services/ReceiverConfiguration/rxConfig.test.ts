import {
  buildRxConfig,
  packPwmChannel,
  POWER_MATCH_TX,
  resolvePower,
  RX_CONFIG_SIZE,
  ServoOutputMode,
} from './rxConfig';

const pwmAt = (config: Buffer, channel: number): number =>
  config.readUInt32LE(24 + channel * 4);

const unpackPwm = (raw: number) => ({
  failsafe: raw & 0x7ff,
  inputChannel: (raw >> 11) & 0x0f,
  inverted: ((raw >> 15) & 1) === 1,
  mode: (raw >> 16) & 0x0f,
  stretched: ((raw >> 20) & 1) === 1,
});

describe('resolvePower', () => {
  const hardware = { powerMin: 1, powerMax: 3, powerDefault: 2 };

  it('takes the default of the target when nothing is chosen', () => {
    expect(resolvePower(undefined, hardware)).toEqual(2);
  });

  it('keeps a level the target supports', () => {
    expect(resolvePower(3, hardware)).toEqual(3);
  });

  it('pulls a level that is too high down to the maximum', () => {
    expect(resolvePower(7, hardware)).toEqual(3);
  });

  it('pushes a level that is too low up to the minimum', () => {
    expect(resolvePower(0, hardware)).toEqual(1);
  });

  it('leaves following the transmitter alone', () => {
    expect(resolvePower(POWER_MATCH_TX, hardware)).toEqual(POWER_MATCH_TX);
  });

  it('falls back to the lowest level without any hardware information', () => {
    expect(resolvePower(undefined, {})).toEqual(0);
  });

  it('keeps a requested level when the target says nothing', () => {
    expect(resolvePower(5, {})).toEqual(5);
  });
});

describe('buildRxConfig', () => {
  it('has the size the firmware expects', () => {
    expect(buildRxConfig({ settings: {} }).length).toEqual(RX_CONFIG_SIZE);
  });

  it('marks the configuration as a receiver configuration of version 11', () => {
    const config = buildRxConfig({ settings: {} });
    const version = config.readUInt32LE(0);
    expect(version >>> 30).toEqual(0b10); // receiver magic
    expect(version & 0x3fffffff).toEqual(11);
  });

  it('carries the uid and flash discriminator of the firmware', () => {
    const config = buildRxConfig({
      settings: {},
      uid: [1, 2, 3, 4, 5, 6],
      flashDiscriminator: 0xdeadbeef,
    });
    expect([...config.subarray(4, 10)]).toEqual([1, 2, 3, 4, 5, 6]);
    expect(config.readUInt32LE(12)).toEqual(0xdeadbeef);
  });

  it('switches model match off by default', () => {
    expect(buildRxConfig({ settings: {} })[22]).toEqual(0xff);
  });

  it('packs the protocol and failsafe byte the way the firmware reads it', () => {
    const config = buildRxConfig({
      settings: { serialProtocol: 2, failsafeMode: 1 },
    });
    expect(config[23] & 0x0f).toEqual(2);
    expect((config[23] >> 4) & 0x03).toEqual(1);
  });

  it('packs bind storage, power and antenna mode into one byte', () => {
    const config = buildRxConfig({
      settings: { bindStorage: 2, power: 3, antennaMode: 1 },
      hardware: { antennaControl: 9 },
    });
    expect(config[20] & 0x03).toEqual(2);
    expect((config[20] >> 2) & 0x0f).toEqual(3);
    expect((config[20] >> 6) & 0x03).toEqual(1);
  });

  it('keeps the secondary serial protocol in its own nibble', () => {
    const config = buildRxConfig({
      settings: { serial1Protocol: 9 },
      hardware: { serial1Rx: 5, serial1Tx: 18 },
    });
    expect(config[11] & 0x0f).toEqual(9);
    expect((config[11] >> 4) & 0x0f).toEqual(0);
  });

  it('stores the telemetry switch as a single bit', () => {
    expect((buildRxConfig({ settings: { forceTlmOff: true } })[21] >> 2) & 1)
      .toEqual(1);
    expect((buildRxConfig({ settings: { forceTlmOff: false } })[21] >> 2) & 1)
      .toEqual(0);
  });

  it('fails the throttle channel safe to its minimum, the others to centre', () => {
    const config = buildRxConfig({ settings: {} });
    expect(unpackPwm(pwmAt(config, 2)).failsafe).toEqual(880 - 476);
    expect(unpackPwm(pwmAt(config, 0)).failsafe).toEqual(1500 - 476);
  });

  it('maps every output to its own input channel', () => {
    const config = buildRxConfig({ settings: {} });
    for (let channel = 0; channel < 16; channel++) {
      expect(unpackPwm(pwmAt(config, channel)).inputChannel).toEqual(channel);
    }
  });

  it('keeps hardware pins out of servo mode', () => {
    const config = buildRxConfig({
      settings: {},
      hardware: {
        pwmOutputs: [10, 11, 12, 13],
        scl: 11,
        sda: 12,
        serial1Rx: 13,
      },
    });
    expect(unpackPwm(pwmAt(config, 0)).mode).toEqual(ServoOutputMode.Servo50Hz);
    expect(unpackPwm(pwmAt(config, 1)).mode).toEqual(ServoOutputMode.SCL);
    expect(unpackPwm(pwmAt(config, 2)).mode).toEqual(ServoOutputMode.SDA);
    expect(unpackPwm(pwmAt(config, 3)).mode).toEqual(ServoOutputMode.Serial1RX);
  });

  it('knows where UART0 sits on each chip', () => {
    // an esp32-s3 receiver with its uart on 44/43, taken from a real layout
    const s3 = buildRxConfig({
      settings: {},
      hardware: {
        platform: 'esp32-s3',
        pwmOutputs: [39, 40, 41, 42, 15, 16, 21, 3, 44, 43],
        serialRx: 44,
        serialTx: 43,
      },
    });
    expect(unpackPwm(pwmAt(s3, 8)).mode).toEqual(ServoOutputMode.Serial);
    expect(unpackPwm(pwmAt(s3, 9)).mode).toEqual(ServoOutputMode.Serial);
    // pin 3 is the uart on plain esp32, but an ordinary output here
    expect(unpackPwm(pwmAt(s3, 7)).mode).toEqual(ServoOutputMode.Servo50Hz);

    const esp32 = buildRxConfig({
      settings: {},
      hardware: {
        platform: 'esp32',
        pwmOutputs: [3, 1],
        serialRx: 3,
        serialTx: 1,
      },
    });
    expect(unpackPwm(pwmAt(esp32, 0)).mode).toEqual(ServoOutputMode.Serial);
    expect(unpackPwm(pwmAt(esp32, 1)).mode).toEqual(ServoOutputMode.Serial);
  });

  it('leaves a target without a second serial port alone', () => {
    const config = buildRxConfig({
      settings: { serial1Protocol: 11 },
      hardware: {},
    });
    expect(config[11] & 0x0f).toEqual(0);
  });

  it('writes the second serial protocol when the target has the pins', () => {
    const config = buildRxConfig({
      settings: { serial1Protocol: 11 },
      hardware: { serial1Rx: 5, serial1Tx: 18 },
    });
    expect(config[11] & 0x0f).toEqual(11);
  });

  it('leaves outputs as servos when the target has no pin information', () => {
    const config = buildRxConfig({ settings: {} });
    for (let channel = 0; channel < 16; channel++) {
      expect(unpackPwm(pwmAt(config, channel)).mode)
        .toEqual(ServoOutputMode.Servo50Hz);
    }
  });

  it('lets the radios decide over the switch, the way the firmware does', () => {
    // SetDefaults assigns 2 for an antenna switch and then 0 for a second
    // radio, so a target with both ends up at 0. No shipping receiver has
    // both, which is exactly why this needs a test of its own.
    expect((buildRxConfig({
      settings: {},
      hardware: { antennaControl: 9, dualRadio: true },
    })[20] >> 6) & 0x03).toEqual(0);
  });

  it('leaves a target with a single antenna at the first one', () => {
    expect((buildRxConfig({ settings: {}, hardware: {} })[20] >> 6) & 0x03)
      .toEqual(0);
  });

  it('defaults to diversity on targets with antenna switching', () => {
    const config = buildRxConfig({
      settings: {},
      hardware: { antennaControl: 9 },
    });
    expect((config[20] >> 6) & 0x03).toEqual(2);
  });

  it('ignores an antenna choice on a target without the switch', () => {
    // dual radio and single antenna receivers take the firmware default
    expect((buildRxConfig({
      settings: { antennaMode: 1 },
      hardware: { dualRadio: true },
    })[20] >> 6) & 0x03).toEqual(0);
    expect((buildRxConfig({
      settings: { antennaMode: 1 },
      hardware: {},
    })[20] >> 6) & 0x03).toEqual(0);
  });

  it('switches model match off for an id the firmware cannot match on', () => {
    expect(buildRxConfig({ settings: { modelId: 300 } })[22]).toEqual(0xff);
    expect(buildRxConfig({ settings: { modelId: -1 } })[22]).toEqual(0xff);
    expect(buildRxConfig({ settings: { modelId: 64 } })[22]).toEqual(0xff);
    expect(buildRxConfig({ settings: { modelId: 63 } })[22]).toEqual(63);
  });

  it('leaves the second serial alone on a target with only pwm outputs', () => {
    const config = buildRxConfig({
      settings: { serial1Protocol: 11 },
      hardware: { pwmOutputs: [1, 3, 4] },
    });
    expect(config[11] & 0x0f).toEqual(0);
  });

  it('writes the team race selection', () => {
    const config = buildRxConfig({
      settings: { teamraceChannel: 6, teamracePosition: 4 },
    });
    expect(config[88] & 0x0f).toEqual(6);
    expect((config[88] >> 4) & 0x07).toEqual(4);
  });

  it('writes the mavlink system ids', () => {
    const config = buildRxConfig({
      settings: { targetSysId: 1, sourceSysId: 255 },
    });
    expect(config[89]).toEqual(1);
    expect(config[90]).toEqual(255);
  });

  it('sets the team race channel to aux7', () => {
    expect(buildRxConfig({ settings: {} })[88] & 0x0f).toEqual(10);
  });

  it('uses the power level the target defaults to', () => {
    const config = buildRxConfig({
      settings: {},
      hardware: { powerMin: 0, powerMax: 3, powerDefault: 3 },
    });
    expect((config[20] >> 2) & 0x0f).toEqual(3);
  });

  it('never writes more power than the target supports', () => {
    const config = buildRxConfig({
      settings: { power: 7 }, // 2 W on a receiver that can do 100 mW
      hardware: { powerMin: 0, powerMax: 3, powerDefault: 3 },
    });
    expect((config[20] >> 2) & 0x0f).toEqual(3);
  });

  it('packs pwm fields least significant bit first', () => {
    expect(packPwmChannel(0x7ff, 0, false, 0, false)).toEqual(0x7ff);
    expect(packPwmChannel(0, 0x0f, false, 0, false)).toEqual(0x0f << 11);
    expect(packPwmChannel(0, 0, true, 0, false)).toEqual(1 << 15);
    expect(packPwmChannel(0, 0, false, 0x0f, false)).toEqual(0x0f << 16);
    expect(packPwmChannel(0, 0, false, 0, true)).toEqual(1 << 20);
  });
});
