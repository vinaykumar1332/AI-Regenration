import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { getAppConfig, validateLanguage } from "@/appConfig/AppConfig";

export const useAppConfig = () => {
    const { lang } = useParams();
    const validatedLang = validateLanguage(lang);

    return useMemo(() => getAppConfig(validatedLang), [validatedLang]);
};
