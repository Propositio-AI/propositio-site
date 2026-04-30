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
  top_image: { url: string };
  instagram_url: string;
  published_at: string;
  tags: { id: string; tag_name: string }[];
};

export type Contact = {
  id: string;
  email: string;
  title: string;
  content: string;
  created_at: string;
  status: string;
}

export type Application = {
  id: string;
  name: string;
  email: string;
  school_info: string;
  position: string;
  motivation: string;
  created_at: string;
  status: string;
}