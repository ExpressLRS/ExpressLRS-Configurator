import { Field, ObjectType } from 'type-graphql';
import SerialMonitorEventType from './enum/SerialMonitorEventType';
import { SerialMonitorEventPayload } from '../services/SerialMonitor';

@ObjectType('SerialMonitorEvent')
export default class SerialMonitorEvent implements SerialMonitorEventPayload {
  @Field(() => SerialMonitorEventType)
  type: SerialMonitorEventType;

  constructor(type: SerialMonitorEventType) {
    this.type = type;
  }
}
