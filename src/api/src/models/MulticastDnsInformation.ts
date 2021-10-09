import { Field, ObjectType } from 'type-graphql';

@ObjectType('MulticastDnsInformation')
export default class MulticastDnsInformation {
  @Field()
  name: string;

  @Field()
  options: string;

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

  constructor(
    name: string,
    options: string,
    version: string,
    target: string,
    type: string,
    vendor: string,
    ip: string,
    dns: string,
    port: number
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
  }
}
