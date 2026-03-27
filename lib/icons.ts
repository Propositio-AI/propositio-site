import { FaFacebook, FaInstagram, FaSquareXTwitter } from "react-icons/fa6";

export const ICONS = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  x: FaSquareXTwitter,
} as const;

export type IconName = keyof typeof ICONS;