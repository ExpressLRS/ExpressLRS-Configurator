import { Field, ObjectType } from 'type-graphql';
import { SerialMonitorLogUpdatePayload } from '../services/SerialMonitor';

@ObjectType('SerialMonitorLogUpdate')
export default class SerialMonitorLogUpdate
  implements SerialMonitorLogUpdatePayload
{
  @Field(() => String)
  data: string;

  constructor(data: string) {
    this.data = data;
  }
}
