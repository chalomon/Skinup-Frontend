export interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon?: string;
}

export interface UserConfig {
  name: string;
  company: string;
  avatar?: string;
}
