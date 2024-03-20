import { Field, ObjectType } from 'type-graphql';
import { MulticastDnsServicePayload } from '../services/MulticastDns';
import MulticastDnsEventType from './enum/MulticastDnsEventType';
import MulticastDnsInformation from './MulticastDnsInformation';

@ObjectType('MulticastDnsMonitorUpdate')
export default class MulticastDnsMonitorUpdate
  implements MulticastDnsServicePayload
{
  @Field(() => MulticastDnsEventType)
  type: MulticastDnsEventType;

  @Field(() => MulticastDnsInformation)
  data: MulticastDnsInformation;

  constructor(type: MulticastDnsEventType, data: MulticastDnsInformation) {
    this.type = type;
    this.data = data;
  }
}
