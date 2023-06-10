import { Field, ObjectType } from 'type-graphql';
import { BuildLogUpdatePayload } from '../services/FlashingStrategyLocator/BuildLogUpdatePayload';

@ObjectType('BuildLogUpdate')
export default class BuildLogUpdate implements BuildLogUpdatePayload {
  @Field()
  data: string;

  constructor(data: string) {
    this.data = data;
  }
}
