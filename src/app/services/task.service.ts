import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Task } from '../models/task';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private tasks: Task[] = [];

  // abychom věděli, pro jakého uživatele jsou data načtená
  private loadedForEmail: string | null = null;

  constructor(private auth: AuthService) {}

  private getTasksKey(email: string): string {
    return `tasks_${email}`;
  }

  private async getCurrentEmailOrThrow(): Promise<string> {
    const email = await this.auth.getCurrentUserEmail();
    if (!email) throw new Error('Uživatel není přihlášen.');
    return email;
  }

  async loadTasks(): Promise<void> {
    const email = await this.getCurrentEmailOrThrow();

    // když se uživatel změnil, resetujeme cache
    if (this.loadedForEmail !== email) {
      this.tasks = [];
      this.loadedForEmail = null;
    }

    // už je načteno pro tohoto uživatele
    if (this.loadedForEmail === email) return;

    const key = this.getTasksKey(email);
    const { value } = await Preferences.get({ key });

    this.tasks = value ? JSON.parse(value) : [];
    this.loadedForEmail = email;
  }

  getTasks(): Task[] {
    return this.tasks;
  }

  private async saveTasks(): Promise<void> {
    const email = await this.getCurrentEmailOrThrow();
    const key = this.getTasksKey(email);

    await Preferences.set({
      key,
      value: JSON.stringify(this.tasks)
    });
  }

  async addTask(title: string, note: string, date?: string | null): Promise<void> {
    await this.loadTasks();

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      note,
      done: false,
      date: date || undefined
    };

    this.tasks.push(newTask);
    await this.saveTasks();
  }

  getTaskById(id: string): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  async updateTask(id: string, title: string, note: string, date?: string | null): Promise<void> {
    await this.loadTasks();

    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.title = title;
      task.note = note;
      task.date = date || undefined;
      await this.saveTasks();
    }
  }

  async toggleDone(task: Task): Promise<void> {
    await this.loadTasks();

    task.done = !task.done;
    await this.saveTasks();
  }

  async deleteTask(id: string): Promise<void> {
    await this.loadTasks();

    this.tasks = this.tasks.filter(t => t.id !== id);
    await this.saveTasks();
  }

  // volitelné: když se odhlásíš, můžeš zavolat tohle, aby se vyčistila paměť v appce
  clearCache() {
    this.tasks = [];
    this.loadedForEmail = null;
  }
}
