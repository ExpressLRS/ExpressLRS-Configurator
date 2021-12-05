import { Field, ObjectType } from 'type-graphql';
import FlashingMethod from './enum/FlashingMethod';

@ObjectType('Target')
export default class Target {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  flashingMethod: FlashingMethod;

  constructor(id: string, name: string, flashingMethod: FlashingMethod) {
    this.id = id;
    this.name = name;
    this.flashingMethod = flashingMethod;
  }
}
