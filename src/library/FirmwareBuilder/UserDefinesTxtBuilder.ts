import { UserDefine } from './Model/UserDefine';
import { UserDefineKey } from './Enum/UserDefineKey';

export default class UserDefinesTxtBuilder {
  build(userDefines: UserDefine[]): string {
    const result: string[] = userDefines.map(({ key, value }) => {
      switch (key) {
        case UserDefineKey.BINDING_PHRASE:
        case UserDefineKey.ARM_CHANNEL:
        case UserDefineKey.MY_STARTUP_MELODY:
          if (value === undefined || value === null || value.length === 0) {
            throw new Error(`${key} value is not set`);
          }
          return `-${key}="${value}"`;
        default:
          return `-${key}`;
      }
    });
    return result.join('\r\n');
  }
}
