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
      UserDefineKey.REGULATORY_DOMAIN_IN_866,
      UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
      UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400,
    ];

    // Support case when there are no Regulatory Domain user defines at all. All 2.4 Ghz hardware
    const regulatoryDomainsValidationRequired =
      data.filter(({ key }) => regulatoryDomainKeys.includes(key)).length > 0;
    if (!regulatoryDomainsValidationRequired) {
      return results;
    }

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

    const minLength = 6;
    if (
      option !== undefined &&
      option.enabled &&
      option.value !== undefined &&
      option.value !== null &&
      option.value.length < minLength
    ) {
      results.push(
        new Error(
          `Custom binding phrase must be longer than ${minLength} characters`
        )
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

  validate(data: UserDefine[]): Error[] {
    return [
      ...this.validateRegulatoryDomains(data),
      ...this.validateBindingPhrase(data),
      ...this.validateStartupMelody(data),
    ];
  }
}
