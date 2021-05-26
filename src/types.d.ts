export type Languages = 'fr' | 'en' | 'it' | 'de';
type i18nDescription = { [k in Languages]?: string }

export interface CookieItem {
    id: string;
    platform: string;
    type: string;
    key: string;
    domain: string;
    i18n: i18nDescription;
}