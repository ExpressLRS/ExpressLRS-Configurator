import { Field, ObjectType } from 'type-graphql';

@ObjectType('SerialPortInformation')
export default class SerialPortInformation {
  @Field(() => String)
  path: string;

  @Field(() => String)
  manufacturer: string;

  constructor(path: string, manufacturer: string) {
    this.path = path;
    this.manufacturer = manufacturer;
  }
}
