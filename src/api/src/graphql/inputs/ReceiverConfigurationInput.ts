import { Field, InputType, Int } from 'type-graphql';

/**
 * Settings that are written to the receiver while it is flashed, so it does not
 * have to be configured over WiFi or Lua afterwards. The values are the ones
 * the firmware itself uses, see rx_config_t in the ExpressLRS sources.
 */
@InputType('ReceiverConfigurationInput')
export default class ReceiverConfigurationInput {
  @Field(() => Boolean)
  enabled: boolean;

  /** eSerialProtocol, the main serial output */
  @Field(() => Int, { nullable: true })
  serialProtocol?: number;

  /** eSerial1Protocol, the secondary output, 0 is off */
  @Field(() => Int, { nullable: true })
  serial1Protocol?: number;

  /** eFailsafeMode: 0 no pulses, 1 last position, 2 set position */
  @Field(() => Int, { nullable: true })
  failsafeMode?: number;

  /** 0 antenna 1, 1 antenna 2, 2 diversity */
  @Field(() => Int, { nullable: true })
  antennaMode?: number;

  /** rx_config_bindstorage_t: 0 persistent, 1 volatile, 2 returnable */
  @Field(() => Int, { nullable: true })
  bindStorage?: number;

  /** model match id, 0 to 63, or 255 for off */
  @Field(() => Int, { nullable: true })
  modelId?: number;

  @Field(() => Boolean, { nullable: true })
  forceTlmOff?: boolean;

  /** index of the rate the receiver starts cycling at */
  @Field(() => Int, { nullable: true })
  rateInitialIdx?: number;

  @Field(() => Int, { nullable: true })
  power?: number;

  /** channel used to select the team race position */
  @Field(() => Int, { nullable: true })
  teamraceChannel?: number;

  @Field(() => Int, { nullable: true })
  teamracePosition?: number;

  /** mavlink system ids */
  @Field(() => Int, { nullable: true })
  targetSysId?: number;

  @Field(() => Int, { nullable: true })
  sourceSysId?: number;

  constructor() {
    this.enabled = false;
  }
}
