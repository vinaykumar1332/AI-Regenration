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
        swapFacePrompt: `Use the reference image as the primary identity anchor.

STRICT IDENTITY PRESERVATION RULES:
- Preserve exact face structure.
- Preserve exact skin tone and undertones.
- Preserve ear shape and size.
- Preserve hand structure and finger proportions.
- Preserve facial symmetry.
- Preserve hairline and hair color.
- Preserve body proportions.
- Do NOT alter identity in any way.

GARMENT APPLICATION RULES:
- Extract clothing details from provided garment images.
- Apply garments realistically to the reference model.
- Maintain exact garment colors.
- Maintain stitching details.
- Maintain fabric texture.
- Maintain original garment shape.
- Do not redesign clothing.
- Do not change silhouette.

COMPOSITION RULES:
- Keep pose from reference image.
- Maintain natural lighting consistency.
- Ensure realistic fabric folds.
- Ensure natural gravity and physics.
- No blending artifacts.

QUALITY RULES:
- Ultra realistic.
- High detail skin texture.
- No beauty smoothing.
- No distortions.
- No extra fingers.
- No warped hands.
- No facial drift.
- 4K output quality.`,
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
