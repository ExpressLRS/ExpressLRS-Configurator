import UserDefineKey from '../library/FirmwareBuilder/Enum/UserDefineKey';
import UserDefineKind from '../models/enum/UserDefineKind';
import UserDefine from '../models/UserDefine';

export default class UserDefinesTxtFactory {
  build(options: UserDefine[]): string {
    const result: string[] = options
      .filter(({ enabled }) => enabled)
      .map((opt) => {
        if (opt.type === UserDefineKind.Boolean && opt.enabled) {
          return this.makeEntry(opt.key);
        }
        if (opt.type === UserDefineKind.Text && opt.enabled) {
          return this.makeEntry(opt.key, opt.value);
        }
        if (opt.type === UserDefineKind.Enum && opt.enabled) {
          return this.makeEntry(opt.key, opt.value);
        }
        return '';
      });
    return result.join('\r\n');
  }

  makeEntry(key: string, value?: string | undefined): string {
    if (value === undefined) {
      return `-${key}`;
    }
    // special format for device name
    if (key === UserDefineKey.DEVICE_NAME) {
      return `-${key}='"${value}"'`;
    }
    return `-${key}="${value}"`;
  }
}
