import { BuildFlashFirmwareParams } from '../../FlashingStrategyLocator/BuildFlashFirmwareParams';
import BuildJobType from '../../../models/enum/BuildJobType';
import UserDefine from '../../../models/UserDefine';
import UserDefineKey from '../../../library/FirmwareBuilder/Enum/UserDefineKey';
import { NoOpFunc, OnOutputFunc } from '../../../library/Commander';
import Python from '../../../library/Python';
import { LoggerService } from '../../../logger';
import UserDefinesMode from '../../../models/enum/UserDefinesMode';

const maskSensitiveFlags = (data: string[][]): string[][] => {
  const sensitiveData = ['--phrase', '--ssid', '--password'];
  const result: string[][] = [];
  for (let i = 0; i < data.length; i++) {
    const item = [...data[i]];
    if (sensitiveData.includes(item[0])) {
      item[1] = '***';
    }
    result.push(item);
  }
  return result;
};

export default class BinaryConfigurator {
  constructor(private python: Python, private logger: LoggerService) {}

  private stringifyFlags(flags: string[][]): string[] {
    return flags.map((flag) => {
      if (flag.length === 2) {
        return `${flag[0]}=${flag[1]}`;
      }
      return flag[0];
    });
  }

  // Map targets.json flashing methods to binary_flash.py
  // https://github.com/ExpressLRS/ExpressLRS/blame/master/src/python/binary_flash.py
  buildBinaryConfigFlags(
    outputDirectory: string,
    firmwareBinaryPath: string,
    hardwareDefinitionsPath: string | null,
    firmwareArtifactsDirPath: string,
    params: BuildFlashFirmwareParams
  ): string[][] {
    const flags: string[][] = [];

    if (hardwareDefinitionsPath && firmwareArtifactsDirPath) {
      flags.push(['--dir', hardwareDefinitionsPath]);
      flags.push(['--fdir', firmwareArtifactsDirPath]);
    } else {
      flags.push(['--dir', firmwareArtifactsDirPath]);
    }

    const [manufacturer, subType, device, uploadMethod] =
      params.target.split('.');
    flags.push(['--target', `${manufacturer}.${subType}.${device}`]);
    if (subType.toLocaleLowerCase().includes('tx_')) {
      flags.push(['--tx']);
    }

    if (params.userDefinesMode === UserDefinesMode.UserInterface) {
      flags.push(...this.userDefinesToFlags(params.userDefines));
    }

    if (params.forceFlash) {
      flags.push(['--force']);
    }

    // https://github.com/ExpressLRS/ExpressLRS/pull/2224/files
    if (uploadMethod === 'stock') {
      flags.push(['--flash', 'stock']);
      flags.push(['--out', outputDirectory]);
    } else if (params.type === BuildJobType.Build) {
      flags.push(['--flash', 'dir']);
      flags.push(['--out', outputDirectory]);
    } else if (params.type === BuildJobType.Flash) {
      flags.push(['--flash', this.mapUploadMethod(uploadMethod)]);
    }

    if (
      params.serialDevice?.length !== undefined &&
      params.serialDevice?.length > 0
    ) {
      flags.push(['--port', params.serialDevice]);
    }

    // must be the last one, since it a positional arg
    if (firmwareBinaryPath !== '') {
      flags.push([firmwareBinaryPath]);
    }

    if (params.erase) {
      flags.push(['--erase']);
    }

    return flags;
  }

  mapUploadMethod(input: string): string {
    const mapped: { [n: string]: string } = {
      uart: 'uart',
      betaflight: 'bf',
      passthru: 'passthru',
      wifi: 'wifi',
      etx: 'etx',
      stlink: 'stlink',
      stock: 'stock',
    };
    if (typeof mapped[input] === 'string') {
      return mapped[input];
    }
    return input;
  }

  userDefinesToFlags(userDefines: UserDefine[]): string[][] {
    const flags: string[][] = [];
    userDefines.forEach((userDefine) => {
      switch (userDefine.key) {
        case UserDefineKey.BINDING_PHRASE:
          if (userDefine.enabled) {
            flags.push(['--phrase', userDefine.value!]);
          }
          break;
        case UserDefineKey.REGULATORY_DOMAIN_AU_433:
          if (userDefine.enabled) {
            flags.push(['--domain', 'au_433']);
          }
          break;
        case UserDefineKey.REGULATORY_DOMAIN_EU_433:
          if (userDefine.enabled) {
            flags.push(['--domain', 'eu_433']);
          }
          break;
        case UserDefineKey.REGULATORY_DOMAIN_AU_915:
          if (userDefine.enabled) {
            flags.push(['--domain', 'au_915']);
          }
          break;
        case UserDefineKey.REGULATORY_DOMAIN_FCC_915:
          if (userDefine.enabled) {
            flags.push(['--domain', 'fcc_915']);
          }
          break;
        case UserDefineKey.REGULATORY_DOMAIN_EU_868:
          if (userDefine.enabled) {
            flags.push(['--domain', 'eu_868']);
          }
          break;
        case UserDefineKey.REGULATORY_DOMAIN_IN_866:
          if (userDefine.enabled) {
            flags.push(['--domain', 'in_866']);
          }
          break;
        case UserDefineKey.REGULATORY_DOMAIN_ISM_2400:
          break;
        case UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400:
          if (userDefine.enabled) {
            flags.push(['--lbt']);
          }
          break;
        case UserDefineKey.AUTO_WIFI_ON_INTERVAL:
          if (userDefine.enabled) {
            flags.push(['--auto-wifi', userDefine.value!]);
          } else {
            flags.push(['--no-auto-wifi']);
          }
          break;
        case UserDefineKey.HOME_WIFI_SSID:
          if (userDefine.enabled) {
            flags.push(['--ssid', userDefine.value!]);
          }
          break;
        case UserDefineKey.HOME_WIFI_PASSWORD:
          if (userDefine.enabled) {
            flags.push(['--password', userDefine.value!]);
          }
          break;
        case UserDefineKey.LOCK_ON_FIRST_CONNECTION:
          break;
        case UserDefineKey.JUST_BEEP_ONCE:
          if (userDefine.enabled) {
            flags.push(['--buzzer-mode', 'one-beep']);
          }
          break;
        case UserDefineKey.DISABLE_ALL_BEEPS:
          if (userDefine.enabled) {
            flags.push(['--buzzer-mode', 'quiet']);
          }
          break;
        case UserDefineKey.DISABLE_STARTUP_BEEP:
          if (userDefine.enabled) {
            flags.push(['--buzzer-mode', 'quiet']);
          }
          break;
        case UserDefineKey.MY_STARTUP_MELODY:
          if (userDefine.enabled) {
            flags.push(['--buzzer-mode', 'custom-tune']);
            flags.push(['--buzzer-melody', userDefine.value || '']);
          }
          break;
        case UserDefineKey.RCVR_UART_BAUD:
          if (userDefine.enabled) {
            flags.push(['--rx-baud', userDefine.value!]);
          }
          break;
        case UserDefineKey.RX_AS_TX:
          if (userDefine.enabled) {
            flags.push(['--rx-as-tx', userDefine.value!]);
          }
          break;
        case UserDefineKey.TLM_REPORT_INTERVAL_MS:
          if (userDefine.enabled) {
            const tlmReportIntervalMs = userDefine.value!.replaceAll('LU', '');
            flags.push(['--tlm-report', tlmReportIntervalMs]);
          }
          break;
        case UserDefineKey.UART_INVERTED:
          if (userDefine.enabled) {
            flags.push(['--uart-inverted']);
          }
          break;
        case UserDefineKey.UNLOCK_HIGHER_POWER:
          if (userDefine.enabled) {
            flags.push(['--unlock-higher-power']);
          }
          break;
        case UserDefineKey.USE_R9MM_R9MINI_SBUS:
          if (userDefine.enabled) {
            flags.push(['--r9mm-mini-sbus']);
          }
          break;
        // not supported
        case UserDefineKey.RCVR_INVERT_TX:
        case UserDefineKey.DEVICE_NAME:
          break;
        default:
          const exhaustiveCheck: never = userDefine.key;
          throw new Error(`Unhandled color case: ${exhaustiveCheck}`);
      }
    });
    return flags;
  }

  async run(
    flasherPath: string,
    flags: string[][],
    onUpdate: OnOutputFunc = NoOpFunc
  ) {
    this.logger.log('flags', {
      flags: maskSensitiveFlags(flags),
      flasherPath,
    });
    const binaryConfiguratorArgs = this.stringifyFlags(flags);
    return this.python.runPythonScript(
      flasherPath,
      binaryConfiguratorArgs,
      onUpdate
    );
  }
}
