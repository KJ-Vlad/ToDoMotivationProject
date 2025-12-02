import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule],
})
export class HomePage implements OnInit {

  tasks: Task[] = [];
  loading = true;

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.taskService.loadTasks();                 //nacte ulozene hodnoty
    this.tasks = this.taskService.getTasks();           //tu je zobrazí je v seznamu
    this.loading = false;
  }

  async toggleDone(task: Task) {
    await this.taskService.toggleDone(task);            //prepinani mezi splneno/nesplneno
  }

  newTask() {
    this.router.navigate(['/edit-task', 'new']);        //prida novy ukol
  }

  editTask(task: Task) {
    this.router.navigate(['/edit-task', task.id]);      //upravuje existujici ukol
  }

  goToMotivation() {
    this.router.navigate(['/motivation']);              //stránka s citátem
  }
}
