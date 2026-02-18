import modules from "@/appConfig/static/modules.json";
import avatars from "@/appConfig/static/avatars.json";
import poses from "@/appConfig/static/poses.json";
import routes from "@/appConfig/static/routes.json";

import enNavigation from "@/appConfig/i18n/en/navigation/navigation.json";
import enImageGeneration from "@/appConfig/i18n/en/imageGeneration.json";
import enCommon from "@/appConfig/i18n/en/common.json";

import deNavigation from "@/appConfig/i18n/de/navigation.json";
import deImageGeneration from "@/appConfig/i18n/de/imageGeneration.json";
import deCommon from "@/appConfig/i18n/de/common.json";

export const supportedLanguages = ["en", "de"];
export const defaultLanguage = "en";

const staticData = {
    static: {
        modules,
        avatars,
        poses,
        routes,
        swapFacePrompt:
            "You are an advanced AI model specialized in high-quality fashion face swapping. Given one or more input fashion images and one or more reference identity images, generate photorealistic outputs where the garments, lighting, and camera perspective from the input images are preserved while the facial identity, expression, and head shape closely follow the provided reference images. Keep results clean, premium, and suitable for e-commerce catalog use.",
    },
};

const languages = {
    en: {
        navigation: enNavigation,
        imageGeneration: enImageGeneration,
        common: enCommon,
    },
    de: {
        navigation: deNavigation,
        imageGeneration: deImageGeneration,
        common: deCommon,
    },
};

export const isSupportedLanguage = (language) => supportedLanguages.includes(language);

export const validateLanguage = (language) =>
    isSupportedLanguage(language) ? language : defaultLanguage;

export const getAppConfig = (language = defaultLanguage) => {
    const validatedLanguage = validateLanguage(language);

    return {
        ...staticData,
        language: validatedLanguage,
        text: languages[validatedLanguage] || languages[defaultLanguage],
    };
};

export { languages };

export default getAppConfig();
