export type Lang = "en" | "th";

export type ScreenId =
  | "welcome"
  | "phone"
  | "phone-loading"
  | "code"
  | "profile"
  | "location"
  | "home"
  | "mall-detail"
  | "reserve"
  | "reserved"
  | "parking"
  | "parked"
  | "profile-view"
  | "settings";

export interface Mall {
  id: number;
  icon: string;
  name: string;
  dist: string;
  cnt: string;
  featured: boolean;
}

export interface Store {
  id: number;
  icon: string;
  name: string;
  floor: string;
  wait: number;
  type: "restaurant" | "shopping" | "services";
}

export interface NavState {
  phone?: string;
  name?: string;
  email?: string;
  mall?: Mall;
  store?: Store;
  spot?: string;
}

export interface ScreenProps {
  t: import("./i18n").Translations;
  lang: Lang;
  setLang: (l: Lang) => void;
  go: (id: ScreenId, state?: NavState | null, isBack?: boolean) => void;
  state: NavState | null;
}
