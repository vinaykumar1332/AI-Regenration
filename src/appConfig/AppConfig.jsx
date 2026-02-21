import modules from "@/appConfig/static/modules.json";
import avatars from "@/appConfig/static/avatars.json";
import poses from "@/appConfig/static/poses.json";
import routes from "@/appConfig/static/routes.json";

import enApp from "@/appConfig/i18n/en/app.json";
import geApp from "@/appConfig/i18n/ge/app.json";
import enDashboard from "@/appConfig/i18n/en/dashboard.json";
import geDashboard from "@/appConfig/i18n/ge/dashboard.json";
import enLoginPage from "@/appConfig/i18n/en/loginPage.json";
import geLoginPage from "@/appConfig/i18n/ge/loginPage.json";

export const supportedLanguages = ["en", "ge"];
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
        ...enApp,
        dashboardData: enDashboard,
        loginPage: enLoginPage,
    },
    ge: {
        ...geApp,
        dashboardData: geDashboard,
        loginPage: geLoginPage,
    },
};

const languageAliases = {
    de: "ge",
};

const normalizeLanguage = (language) => languageAliases[language] || language;

export const isSupportedLanguage = (language) =>
    supportedLanguages.includes(normalizeLanguage(language));

export const validateLanguage = (language) =>
    isSupportedLanguage(language) ? normalizeLanguage(language) : defaultLanguage;

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
