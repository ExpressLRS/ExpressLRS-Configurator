import { Config } from './Config';

export type Targets = {
  [key: string]: {
    name: string;
    tx_2400: {
      [key: string]: Config;
    };
    rx_2400: {
      [key: string]: Config;
    };
    tx_900: {
      [key: string]: Config;
    };
    rx_900: {
      [key: string]: Config;
    };
  };
};
