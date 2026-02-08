export type UserItem = {
  id: string;
  name: string;
  role: string;
};

export type UserSection = {
  title: string;
  data: UserItem[];
};
