import { Field, ObjectType } from 'type-graphql';
import UserDefine from './UserDefine';

@ObjectType('MulticastDnsInformation')
export default class MulticastDnsInformation {
  @Field()
  name: string;

  @Field(() => [UserDefine])
  options: UserDefine[];

  @Field()
  version: string;

  @Field()
  target: string;

  @Field()
  type: string;

  @Field()
  vendor: string;

  @Field()
  ip: string;

  @Field()
  dns: string;

  @Field()
  port: number;

  @Field()
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
