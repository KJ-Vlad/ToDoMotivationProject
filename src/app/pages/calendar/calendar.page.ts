import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {
  selectedDate: string | null = null;

  constructor(
    private router: Router,
    private taskService: TaskService
  ) {}

  createTaskForDate() {
    if (!this.selectedDate) return;

    // otevře vytváření nového úkolu a předvyplní datum + víme, že jsme přišli z kalendáře
    this.router.navigate(['/edit-task', 'new'], {
      queryParams: { date: this.selectedDate, from: 'calendar' }
    });
  }

  async ionViewWillEnter() {
    // při návratu na kalendář se úkoly znovu načtou (podle přihlášeného uživatele)
    await this.taskService.loadTasks();
  }

  goHome() {
    this.router.navigate(['/home']);
  }
}
