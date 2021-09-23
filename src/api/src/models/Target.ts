import { Field, ObjectType } from 'type-graphql';
import FlashingMethod from './enum/FlashingMethod';

@ObjectType('Target')
export default class Target {
  @Field()
  name: string;

  @Field()
  flashingMethod: FlashingMethod;

  constructor(name: string, flashingMethod: FlashingMethod) {
    this.name = name;
    this.flashingMethod = flashingMethod;
  }
}
