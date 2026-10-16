export type Project = {
  id: string;
  title: string;
  tag: string;
  text: string;
  image_url: string | null;
  link_url: string | null;
  sort_order: number;
  published: boolean;
  created_at?: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  created_at: string;
};
