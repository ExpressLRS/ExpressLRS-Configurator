import { registerEnumType } from 'type-graphql';

enum FlashingMethod {
  BetaflightPassthrough = 'Betaflight Passthrough',
  DFU = 'DFU',
  STLink = 'STLink',
  Stock_BL = 'Bootloader',
  UART = 'UART',
  WIFI = 'WIFI',
  Radio = 'Radio',
}

registerEnumType(FlashingMethod, {
  name: 'FlashingMethod',
});

export default FlashingMethod;
