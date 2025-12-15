export interface Task {
  id: string;
  title: string;
  note?: string;
  done: boolean;
  date?: string; // ulozeni data
}
