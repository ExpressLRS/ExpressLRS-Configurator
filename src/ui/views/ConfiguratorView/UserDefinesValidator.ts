import { UserDefine, UserDefineKey } from '../../gql/generated/types';

export default class UserDefinesValidator {
  validateRegulatoryDomains(data: UserDefine[]): Error[] {
    const results: Error[] = [];

    const regulatoryDomainKeys: UserDefineKey[] = [
      UserDefineKey.REGULATORY_DOMAIN_AU_915,
      UserDefineKey.REGULATORY_DOMAIN_EU_868,
      UserDefineKey.REGULATORY_DOMAIN_AU_433,
      UserDefineKey.REGULATORY_DOMAIN_EU_433,
      UserDefineKey.REGULATORY_DOMAIN_FCC_915,
      UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
    ];

    const regulatoryDefines = data.filter(
      ({ key, enabled }) => regulatoryDomainKeys.includes(key) && enabled
    );
    if (regulatoryDefines.length === 0) {
      results.push(
        new Error('You must choose a regulatory domain for your device')
      );
    }
    if (regulatoryDefines.length > 1) {
      results.push(
        new Error('You must choose single regulatory domain for your device')
      );
    }

    return results;
  }

  validateBindingPhrase(data: UserDefine[]): Error[] {
    const results: Error[] = [];

    const option = data.find(({ key }) => key === UserDefineKey.BINDING_PHRASE);

    if (option && option.enabled && option.value && option.value.length === 0) {
      results.push(
        new Error('Custom binding phrase selected, but not entered')
      );
    }

    if (option && option.enabled && option.value && option.value.length < 10) {
      results.push(
        new Error('Custom binding phrase is shorter than 10 characters')
      );
    }

    return results;
  }

  validateStartupMelody(data: UserDefine[]): Error[] {
    const results: Error[] = [];

    const option = data.find(
      ({ key }) => key === UserDefineKey.MY_STARTUP_MELODY
    );

    if (option && option.enabled && option.value && option.value.length === 0) {
      results.push(
        new Error('Custom startup melody selected, but not entered')
      );
    }

    return results;
  }

  validateArmChannel(data: UserDefine[]): Error[] {
    const results: Error[] = [];

    const option = data.find(({ key }) => key === UserDefineKey.ARM_CHANNEL);

    if (option && option.enabled && option.value && option.value.length === 0) {
      results.push(new Error('Arm channel selected, but not entered'));
    }

    return results;
  }

  validate(data: UserDefine[]): Error[] {
    return [
      ...this.validateRegulatoryDomains(data),
      ...this.validateBindingPhrase(data),
      ...this.validateStartupMelody(data),
      ...this.validateArmChannel(data),
    ];
  }
}
