// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import defaultNamespace from "../i18n/en/translation.json";

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "defaultNamespace";
    // custom resources type
    resources: {
        defaultNamespace: typeof defaultNamespace;
    };
    // other
  }
}