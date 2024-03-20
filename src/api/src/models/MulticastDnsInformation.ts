import { Field, ObjectType } from 'type-graphql';
import UserDefine from './UserDefine';

@ObjectType('MulticastDnsInformation')
export default class MulticastDnsInformation {
  @Field(() => String)
  name: string;

  @Field(() => [UserDefine])
  options: UserDefine[];

  @Field(() => String)
  version: string;

  @Field(() => String)
  target: string;

  @Field(() => String)
  type: string;

  @Field(() => String)
  vendor: string;

  @Field(() => String)
  ip: string;

  @Field(() => String)
  dns: string;

  @Field(() => Number)
  port: number;

  @Field(() => String)
  deviceName: string;

  constructor(
    name: string,
    options: UserDefine[],
    version: string,
    target: string,
    type: string,
    vendor: string,
    ip: string,
    dns: string,
    port: number,
    deviceName: string
  ) {
    this.name = name;
    this.options = options;
    this.version = version;
    this.target = target;
    this.type = type;
    this.vendor = vendor;
    this.ip = ip;
    this.dns = dns;
    this.port = port;
    this.deviceName = deviceName;
  }
}
