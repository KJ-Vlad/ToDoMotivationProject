import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Task } from '../models/task';

const TASKS_KEY = 'tasks';

@Injectable({
    providedIn: 'root'
})
export class TaskService {
    private tasks: Task[] = [];
    private loaded = false;

    async loadTasks(): Promise<void> {
        if (this.loaded) return;

        const { value } = await Preferences.get({ key: TASKS_KEY });
        this.tasks = value ? JSON.parse(value) : [];
        this.loaded = true;
    }

    getTasks(): Task[] {
        return this.tasks;
    }

    private async saveTasks() {
        await Preferences.set({
            key: TASKS_KEY,
            value: JSON.stringify(this.tasks)
        });
    }

    async addTask(title: string, note: string) {
        await this.loadTasks();

        const newTask: Task = {
            id: Date.now().toString(),
            title,
            note,
            done: false
        };

        this.tasks.push(newTask);
        await this.saveTasks();
    }

    getTaskById(id: string) {
        return this.tasks.find(t => t.id === id);
    }

    async updateTask(id: string, title: string, note: string) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.title = title;
            task.note = note;
            await this.saveTasks();
        }
    }

    async toggleDone(task: Task) {
        task.done = !task.done;
        await this.saveTasks();
    }

    async deleteTask(id: string) {
        await this.loadTasks();
        this.tasks = this.tasks.filter(t => t.id !== id);
        await this.saveTasks();
    }
}
