import { Field, Int, ObjectType } from 'type-graphql';

/**
 * What a receiver supports, so the configurator only offers settings the
 * hardware can actually apply.
 */
@ObjectType('ReceiverCapabilities')
export default class ReceiverCapabilities {
  /** false when the configuration cannot be written for this target */
  @Field(() => Boolean)
  supported: boolean;

  /** lowest power level the receiver supports, as a PowerLevels_e index */
  @Field(() => Int)
  powerMin: number;

  @Field(() => Int)
  powerMax: number;

  @Field(() => Int)
  powerDefault: number;

  /** whether the target has a second serial port */
  @Field(() => Boolean)
  hasSerial1: boolean;

  /** how many servo outputs the target has, none for a serial only receiver */
  @Field(() => Int)
  pwmChannelCount: number;

  /** the transmitter decides the antenna mode of a dual radio receiver */
  @Field(() => Boolean)
  dualRadio: boolean;

  /** only a receiver with an antenna switch can be pointed at an antenna */
  @Field(() => Boolean)
  hasAntennaSwitch: boolean;

  constructor(
    supported: boolean,
    powerMin = 0,
    powerMax = 0,
    powerDefault = 0,
    hasSerial1 = false,
    pwmChannelCount = 0,
    dualRadio = false,
    hasAntennaSwitch = false,
  ) {
    this.supported = supported;
    this.powerMin = powerMin;
    this.powerMax = powerMax;
    this.powerDefault = powerDefault;
    this.hasSerial1 = hasSerial1;
    this.pwmChannelCount = pwmChannelCount;
    this.dualRadio = dualRadio;
    this.hasAntennaSwitch = hasAntennaSwitch;
  }
}
