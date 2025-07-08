import i18n from "i18next";

import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";

if (!i18n.isInitialized) {
  i18n.init({
    resources: {
      en: { translation: en },
      es: { translation: es },
      fr: { translation: fr },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "es", "fr"],
    interpolation: { escapeValue: false },
  });
  if (typeof window !== "undefined") {
    import("react-i18next").then(({ initReactI18next }) => {
      i18n.use(initReactI18next).init({
        resources: {
          en: { translation: en },
          es: { translation: es },
          fr: { translation: fr },
        },
        fallbackLng: "en",
        supportedLngs: ["en", "es", "fr"],
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
      });
    });
  }
}

export default i18n;
