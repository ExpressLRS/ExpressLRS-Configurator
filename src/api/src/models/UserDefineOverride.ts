import UserDefineOptionGroup from './enum/UserDefineOptionGroup';

export default interface UserDefineOverride {
  key: string;

  enabled?: boolean;

  sensitive?: boolean;

  enumValues?: string[];

  value?: string;

  optionGroup?: UserDefineOptionGroup;
}
