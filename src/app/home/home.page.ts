import { Component, OnInit } from '@angular/core';
import { IonicModule, AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  tasks: Task[] = [];
  loading = true;

  // SEARCH
  searchTerm = '';

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

  // ===== SEARCH LOGIKA =====
  onSearch(ev: any) {
    const value = ev?.detail?.value ?? '';
    this.searchTerm = value;
  }

  clearSearch() {
    this.searchTerm = '';
  }

  // ===== SEŘAZENÍ + FILTR =====
  get filteredTasks(): Task[] {
    const term = this.searchTerm.trim().toLowerCase();

    const base = [...this.tasks].sort((a, b) => Number(a.done) - Number(b.done));

    if (!term) return base;

    return base.filter(t => {
      const title = (t.title || '').toLowerCase();
      const note = (t.note || '').toLowerCase();
      const dateStr = t.date ? new Date(t.date).toLocaleDateString('cs-CZ') : '';

      return title.includes(term) || note.includes(term) || dateStr.includes(term);
    });
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
      message: `Opravdu chceš smazat úkol "${task.title}"?`,
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
