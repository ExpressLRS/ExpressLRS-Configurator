import Domain from './Domain';

export interface Options {
  uid?: number[];
  'wifi-on-interval'?: number | undefined;
  'wifi-ssid'?: string | undefined;
  'wifi-password'?: string | undefined;
  'rcvr-uart-baud'?: number | undefined;
  'rcvr-invert-tx'?: boolean | undefined;
  'lock-on-first-connection'?: boolean | undefined;
  'tlm-interval'?: number | undefined;
  'fan-runtime'?: number | undefined;
  'uart-inverted'?: boolean | undefined;
  'unlock-higher-power'?: boolean | undefined;
  'r9mm-mini-sbus'?: boolean | undefined;
  beeptype?: number | undefined;
  domain?: Domain | undefined;
  melody?: number[][] | undefined;
}
