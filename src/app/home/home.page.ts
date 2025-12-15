import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
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

  constructor(
    private taskService: TaskService,
    private router: Router,
    private auth: AuthService
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
      // kdyby se sem někdo dostal bez loginu (např. refresh / přímá URL)
      this.router.navigate(['/login']);
    } finally {
      this.loading = false;
    }
  }

  // seřazení: nedokončené nahoře, dokončené dole
  get sortedTasks(): Task[] {
    return [...this.tasks].sort((a, b) => Number(a.done) - Number(b.done));
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

  async deleteTask(task: Task) {
    const sure = confirm(`Opravdu chceš smazat úkol: "${task.title}"?`);
    if (!sure) return;

    await this.taskService.deleteTask(task.id);
    this.tasks = this.taskService.getTasks();
  }
}
