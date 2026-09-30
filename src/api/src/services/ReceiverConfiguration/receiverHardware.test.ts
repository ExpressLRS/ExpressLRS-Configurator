import {
  applyLayoutOverlay,
  layoutFileName,
  parseReceiverCapabilities,
  parseReceiverHardware,
} from './receiverHardware';

describe('applyLayoutOverlay', () => {
  it('lets a device adjust the layout of its board', () => {
    // the RadioMaster XR4 adds a second serial port to a generic layout
    const layout = { serial_rx: 3, serial_tx: 1, power_max: 3 };
    const merged = applyLayoutOverlay(layout, {
      serial1_rx: 5,
      serial1_tx: 18,
    }) as Record<string, unknown>;
    expect(merged.serial1_rx).toEqual(5);
    expect(merged.serial_rx).toEqual(3);
  });

  it('lets a device raise or lower the power of the board', () => {
    const merged = applyLayoutOverlay({ power_max: 3, power_default: 3 }, {
      power_max: 5,
      power_default: 5,
    });
    expect(parseReceiverCapabilities(merged).powerMax).toEqual(5);
    expect(parseReceiverCapabilities(merged).powerDefault).toEqual(5);
  });

  it('changes nothing without an overlay', () => {
    const layout = { power_max: 2 };
    expect(applyLayoutOverlay(layout, null)).toEqual(layout);
    expect(applyLayoutOverlay(layout, undefined)).toEqual(layout);
  });
});

describe('applyLayoutOverlay without a layout', () => {
  it('stays missing, an overlay alone describes no board', () => {
    expect(applyLayoutOverlay(null, { serial1_rx: 5 })).toBeNull();
    expect(applyLayoutOverlay(undefined, { power_max: 3 })).toBeNull();
  });
});

describe('layoutFileName', () => {
  it('looks receivers up in the RX folder', () => {
    expect(layoutFileName('Unified_ESP32_LR1121_RX', 'Board.json'))
      .toEqual('RX/Board.json');
  });

  it('looks transmitters up in the TX folder', () => {
    expect(layoutFileName('Unified_ESP32_2400_TX', 'Board.json'))
      .toEqual('TX/Board.json');
  });
});

describe('parseReceiverHardware', () => {
  it('reads the pins a receiver layout describes', () => {
    expect(
      parseReceiverHardware({
        pwm_outputs: [1, 3, 4, 5],
        i2c_scl: 4,
        i2c_sda: 5,
        serial_rx: 3,
        serial_tx: 1,
        serial1_rx: 13,
        ant_ctrl: 9,
      }),
    ).toEqual({
      pwmOutputs: [1, 3, 4, 5],
      scl: 4,
      sda: 5,
      serialRx: 3,
      serialTx: 1,
      serial1Rx: 13,
      serial1Tx: undefined,
      antennaControl: 9,
      dualRadio: false,
      pwmOutOnly: false,
      platform: undefined,
      powerMin: 0,
      powerMax: 0,
      powerDefault: 0,
      hasSerial1: true,
      pwmChannelCount: 4,
      hasAntennaSwitch: true,
    });
  });

  it('treats -1 as an unused pin', () => {
    const hardware = parseReceiverHardware({ i2c_scl: -1, ant_ctrl: -1 });
    expect(hardware.scl).toBeUndefined();
    expect(hardware.antennaControl).toBeUndefined();
  });

  it('reports a second serial only where the target has pins for it', () => {
    expect(parseReceiverCapabilities({ serial1_tx: 18 }).hasSerial1)
      .toEqual(true);
    expect(parseReceiverCapabilities({ serial1_rx: 5 }).hasSerial1)
      .toEqual(true);
    // a servo output could be remapped to it, but not by what is written here
    expect(parseReceiverCapabilities({ pwm_outputs: [1, 3] }).hasSerial1)
      .toEqual(false);
    expect(parseReceiverCapabilities({}).hasSerial1).toEqual(false);
  });

  it('reports whether the receiver can be pointed at one of its antennas', () => {
    // the firmware only offers the setting when the target has the switch
    expect(parseReceiverCapabilities({ ant_ctrl: 9 }).hasAntennaSwitch)
      .toEqual(true);
    expect(parseReceiverCapabilities({ ant_ctrl: -1 }).hasAntennaSwitch)
      .toEqual(false);
    expect(parseReceiverCapabilities({}).hasAntennaSwitch).toEqual(false);
  });

  it('reports a dual radio target, whose antenna mode the transmitter sets', () => {
    expect(parseReceiverCapabilities({ radio_nss_2: 13 }).dualRadio)
      .toEqual(true);
    expect(parseReceiverCapabilities({}).dualRadio).toEqual(false);
  });

  it('recognises dual radio targets', () => {
    expect(parseReceiverHardware({ radio_nss_2: 21 }).dualRadio).toEqual(true);
    expect(parseReceiverHardware({}).dualRadio).toEqual(false);
  });

  it('reads what the amplifier of the target supports', () => {
    expect(
      parseReceiverCapabilities({
        power_min: 0,
        power_max: 3,
        power_default: 3,
      }),
    ).toEqual({
      powerMin: 0,
      powerMax: 3,
      powerDefault: 3,
      hasSerial1: false,
      pwmChannelCount: 0,
      dualRadio: false,
      hasAntennaSwitch: false,
    });
  });

  it('falls back to the lowest level when a layout says nothing', () => {
    expect(parseReceiverCapabilities({})).toEqual({
      powerMin: 0,
      powerMax: 0,
      powerDefault: 0,
      hasSerial1: false,
      pwmChannelCount: 0,
      dualRadio: false,
      hasAntennaSwitch: false,
    });
  });

  it('keeps the default power inside the range of the target', () => {
    expect(
      parseReceiverCapabilities({
        power_min: 3,
        power_max: 5,
        power_default: 0,
      }).powerDefault,
    ).toEqual(3);
    expect(
      parseReceiverCapabilities({
        power_min: 0,
        power_max: 2,
        power_default: 7,
      }).powerDefault,
    ).toEqual(2);
  });

  it('reports a single power level for targets without an amplifier', () => {
    // a third of all receiver layouts can only do 10 mW
    const capabilities = parseReceiverCapabilities({
      power_min: 0,
      power_max: 0,
      power_default: 0,
    });
    expect(capabilities.powerMin).toEqual(0);
    expect(capabilities.powerMax).toEqual(0);
  });

  it('recognises a target that is nothing but pwm outputs', () => {
    expect(parseReceiverHardware({ pwm_out_only: true }).pwmOutOnly)
      .toEqual(true);
    expect(parseReceiverHardware({}).pwmOutOnly).toEqual(false);
  });

  it('never reports a maximum below the minimum', () => {
    expect(
      parseReceiverCapabilities({ power_min: 2, power_max: 1 }).powerMax,
    ).toEqual(2);
  });

  it('survives an empty or unexpected layout', () => {
    expect(parseReceiverHardware(null).pwmOutputs).toBeUndefined();
    expect(parseReceiverHardware({ pwm_outputs: 'nonsense' }).pwmOutputs)
      .toBeUndefined();
  });
});
