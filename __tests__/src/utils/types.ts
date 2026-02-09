export type UserItem = {
  id: string;
  name: string;
  role: string;
  email: string;
};

export type UserSection = {
  title: string;
  data: UserItem[];
};
