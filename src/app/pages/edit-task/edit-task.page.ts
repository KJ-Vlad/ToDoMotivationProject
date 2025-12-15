import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
  templateUrl: './edit-task.page.html',
  styleUrls: ['./edit-task.page.scss'],
})
export class EditTaskPage implements OnInit {
  id!: string;
  title = '';
  note = '';
  date: string | null = null;
  isNew = true;

  // odkud jsem přišel (home/calendar) – volitelné
  from: 'home' | 'calendar' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
  ) {}

  async ngOnInit() {
    await this.taskService.loadTasks();

    // id je buď skutečné id, nebo "new"
    this.id = this.route.snapshot.paramMap.get('id') || 'new';
    this.isNew = this.id === 'new';

    // odkud jsem přišel (query param)
    const fromParam = this.route.snapshot.queryParamMap.get('from');
    if (fromParam === 'calendar' || fromParam === 'home') {
      this.from = fromParam;
    } else {
      this.from = null;
    }

    if (this.isNew) {
      // když přijdu z kalendáře, datum se předvyplní
      const dateParam = this.route.snapshot.queryParamMap.get('date');
      if (dateParam) this.date = dateParam;
    } else {
      // edit existujícího úkolu
      const task = this.taskService.getTaskById(this.id);
      if (task) {
        this.title = task.title;
        this.note = task.note || '';
        this.date = task.date || null;
      } else {
        // když úkol neexistuje (špatné id), vrať na home
        this.router.navigate(['/home']);
      }
    }
  }

  cancel() {
    this.goBack();
  }

  async save() {
    const trimmedTitle = this.title.trim();
    if (!trimmedTitle) {
      alert('Zadej název úkolu');
      return;
    }

    const trimmedNote = this.note.trim();

    if (this.isNew) {
      await this.taskService.addTask(trimmedTitle, trimmedNote, this.date);
    } else {
      await this.taskService.updateTask(this.id, trimmedTitle, trimmedNote, this.date);
    }

    this.goBack();
  }

  private goBack() {
    if (this.from === 'calendar') {
      this.router.navigate(['/calendar']);
      return;
    }
    this.router.navigate(['/home']);
  }
}
