import { registerEnumType } from 'type-graphql';

enum SerialMonitorEventType {
  Connecting = 'CONNECTING',
  Connected = 'CONNECTED',
  Disconnected = 'DISCONNECTED',
  Error = 'ERROR',
}

registerEnumType(SerialMonitorEventType, {
  name: 'SerialMonitorEventType',
});

export default SerialMonitorEventType;
