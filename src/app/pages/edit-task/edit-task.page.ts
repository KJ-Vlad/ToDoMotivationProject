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
  isNew = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private taskService: TaskService,
  ) {}

  async ngOnInit() {
    await this.taskService.loadTasks();

    this.id = this.route.snapshot.paramMap.get('id') || 'new';
    this.isNew = this.id === 'new';

    if (!this.isNew) {
      const task = this.taskService.getTaskById(this.id);
      if (task) {
        this.title = task.title;
        this.note = task.note || '';
      }
    }
  }

  async save() {
    const trimmedTitle = this.title.trim();
    if (!trimmedTitle) {
      alert('Zadej název úkolu');
      return;
    }

    if (this.isNew) {
      await this.taskService.addTask(trimmedTitle, this.note.trim());
    } else {
      await this.taskService.updateTask(this.id, trimmedTitle, this.note.trim());
    }

    this.router.navigate(['/home']);
  }
}
