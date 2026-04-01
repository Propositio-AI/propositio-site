import { IconName } from "./icons";

export type SocialLink = {
  url: string;
  label: string;
  icon: IconName;
};

export type Member = {
  name: string;
  position: string;
  image: string;
  grade: string;
  hobby: string;
  comment: string;
};

export type Role = {
  role: string;
  description: string;
  members: Member[];
}

export type Blog = {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  instagram_url: string;
  published_at: string;
  tags: string[];
};