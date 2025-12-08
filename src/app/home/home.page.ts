import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

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
    private router: Router
  ) {}

  async ngOnInit() {
    await this.taskService.loadTasks();
    this.tasks = this.taskService.getTasks();
    this.loading = false;
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
}
