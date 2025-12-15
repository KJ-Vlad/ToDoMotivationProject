import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { TaskService } from '../services/task.service';
import { Task } from '../models/task';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tasks: Task[] = [];
  loading = true;

  searchText = '';

  constructor(
    private taskService: TaskService,
    private router: Router,
    private auth: AuthService,
    private alertCtrl: AlertController
  ) {}

  async logout() {
    await this.auth.logout();
    this.taskService.clearCache();
    this.router.navigate(['/login']);
  }

  async ngOnInit() {
    try {
      await this.taskService.loadTasks();
      this.tasks = this.taskService.getTasks();
    } catch (e) {
      this.router.navigate(['/login']);
    } finally {
      this.loading = false;
    }
  }

  // Search handler
  onSearch(ev: any) {
    this.searchText = ev.target?.value ?? '';
  }

  // seřazení: nedokončené nahoře, dokončené dole
  get sortedTasks(): Task[] {
    return [...this.tasks].sort((a, b) => Number(a.done) - Number(b.done));
  }

  // vyfiltrované + seřazené
  get filteredSortedTasks(): Task[] {
    const q = this.searchText.trim().toLowerCase();
    const base = this.sortedTasks;

    if (!q) return base;

    return base.filter(t =>
      t.title.toLowerCase().includes(q) ||
      (t.note ?? '').toLowerCase().includes(q) ||
      (t.date ?? '').toLowerCase().includes(q)
    );
  }

  // statistiky
  get totalTasks(): number {
    return this.tasks.length;
  }

  get completedTasks(): number {
    return this.tasks.filter(t => t.done).length;
  }

  get completionPercent(): number {
    if (!this.totalTasks) return 0;
    return Math.round((this.completedTasks / this.totalTasks) * 100);
  }

  async toggleDone(task: Task) {
    await this.taskService.toggleDone(task);
    this.tasks = this.taskService.getTasks();
  }

  newTask() {
    this.router.navigate(['/edit-task', 'new']);
  }

  editTask(task: Task) {
    this.router.navigate(['/edit-task', task.id]);
  }

  goToMotivation() {
    this.router.navigate(['/motivation']);
  }

  goToCalendar() {
    this.router.navigate(['/calendar']);
  }

  async confirmDelete(task: Task) {
    const alert = await this.alertCtrl.create({
      header: 'Smazat úkol?',
      message: `Opravdu chceš smazat úkol ${task.title}`,
      buttons: [
        { text: 'Zrušit', role: 'cancel' },
        {
          text: 'Smazat',
          role: 'destructive',
          handler: async () => {
            await this.taskService.deleteTask(task.id);
            this.tasks = this.taskService.getTasks();
          }
        }
      ]
    });

    await alert.present();
  }
}
