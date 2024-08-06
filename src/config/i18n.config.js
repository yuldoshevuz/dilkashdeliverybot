import i18n from "i18next";
import Backend from "i18next-fs-backend";
import path from "path";

i18n.use(Backend).init({
    lng: "uz", // Default til
    fallbackLng: "uz", // Agar tanlangan til topilmasa
    backend: {
        loadPath: path.join(process.cwd(), "src", "locales", "{{lng}}.json")
    },
    interpolation: {
        escapeValue: false
    }
});

export default i18n;