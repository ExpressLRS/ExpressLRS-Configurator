import {
  UserDefine,
  UserDefineKey,
  UserDefineKind,
} from '../../gql/generated/types';

export default class UserDefinesValidator {
  validateRegulatoryDomains(data: UserDefine[]): Error[] {
    const results: Error[] = [];

    const regulatoryDomains: Map<string, UserDefineKey[]> = new Map([
      [
        '400 Mhz',
        [
          UserDefineKey.REGULATORY_DOMAIN_EU_433,
          UserDefineKey.REGULATORY_DOMAIN_AU_433,
        ],
      ],
      [
        '900 MHz',
        [
          UserDefineKey.REGULATORY_DOMAIN_AU_915,
          UserDefineKey.REGULATORY_DOMAIN_EU_868,
          UserDefineKey.REGULATORY_DOMAIN_FCC_915,
          UserDefineKey.REGULATORY_DOMAIN_IN_866,
        ],
      ],
      [
        '2.4 GHz',
        [
          UserDefineKey.REGULATORY_DOMAIN_ISM_2400,
          UserDefineKey.REGULATORY_DOMAIN_EU_CE_2400,
        ],
      ],
    ]);

    // if any regulatory domain options were present to the user it means that
    // at least one of them has to be enabled
    regulatoryDomains.forEach(
      (categoryUserDefines: UserDefineKey[], categoryName: string) => {
        // check if we have any options present from the category
        const userDefinesFilterByCategory = data.filter(({ key }) =>
          categoryUserDefines.includes(key),
        );
        const enabledUserDefines = userDefinesFilterByCategory.filter(
          ({ enabled }) => enabled,
        );
        if (
          userDefinesFilterByCategory.length > 0
          && enabledUserDefines.length === 0
        ) {
          results.push(
            new Error(
              `You must choose regulatory domain for your device in ${categoryName} band`,
            ),
          );
        }
      },
    );

    return results;
  }

  validateBindingPhrase(data: UserDefine[]): Error[] {
    const results: Error[] = [];

    const option = data.find(({ key }) => key === UserDefineKey.BINDING_PHRASE);

    const minLength = 6;
    if (
      option !== undefined
      && option.enabled
      && option.value !== undefined
      && option.value !== null
      && option.value.length < minLength
    ) {
      results.push(
        new Error(
          `Custom binding phrase must be longer than ${minLength} characters`,
        ),
      );
    }

    return results;
  }

  validateStartupMelody(data: UserDefine[]): Error[] {
    const results: Error[] = [];

    const option = data.find(
      ({ key }) => key === UserDefineKey.MY_STARTUP_MELODY,
    );

    if (option && option.enabled && option.value && option.value.length === 0) {
      results.push(
        new Error('Custom startup melody selected, but not entered'),
      );
    }

    return results;
  }

  /*
    Numeric user defines (UserDefineKind.Number) carry their allowed range on the
    model as optional min/max (set in TargetUserDefinesFactory). Enforce it here so
    an out-of-range value actually blocks the build — the input's visual error alone
    does not prevent submission (e.g. a manually typed -11111).
  */
  validateNumericRanges(data: UserDefine[]): Error[] {
    const results: Error[] = [];

    data
      .filter(
        (option) =>
          option.type === UserDefineKind.Number
          && option.enabled
          && option.value !== undefined
          && option.value !== null,
      )
      .forEach((option) => {
        const raw = (option.value ?? '').trim();
        const label = option.key;
        if (!/^-?\d+$/.test(raw)) {
          results.push(new Error(`${label} must be a whole number`));
          return;
        }
        const parsed = Number(raw);
        if (option.min !== undefined && option.min !== null && parsed < option.min) {
          results.push(
            new Error(`${label} must be greater than or equal to ${option.min}`),
          );
        }
        if (option.max !== undefined && option.max !== null && parsed > option.max) {
          results.push(
            new Error(`${label} must be less than or equal to ${option.max}`),
          );
        }
      });

    return results;
  }

  validate(data: UserDefine[]): Error[] {
    return [
      ...this.validateRegulatoryDomains(data),
      ...this.validateBindingPhrase(data),
      ...this.validateStartupMelody(data),
      ...this.validateNumericRanges(data),
    ];
  }
}
