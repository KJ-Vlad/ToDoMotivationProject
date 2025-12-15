import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [IonicModule, CommonModule],
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {

  selectedDate: string | null = null;

  constructor(private router: Router) {}

  onDateChange(event: any) {
    this.selectedDate = event.detail.value; // ISO string
  }

  addTaskForDate() {
    if (!this.selectedDate) return;

    // otevře vytváření nového úkolu a předvyplní datum
    this.router.navigate(['/edit-task', 'new'], {
      queryParams: { date: this.selectedDate }
    });
  }
}
