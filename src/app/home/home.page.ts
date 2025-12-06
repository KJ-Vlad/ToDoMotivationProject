import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';           // pro ngModel v searchbaru
import { Router } from '@angular/router';
import { TaskService } from '../services/task.service';
import { Task } from '../models/task';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonicModule, CommonModule, FormsModule],
})
export class HomePage implements OnInit {

  tasks: Task[] = [];            // vsechny ulohy
  loading = true;                // indikace nacitani
  searchTerm: string = '';       // text pro hledani uloh

  constructor(
    private taskService: TaskService,
    private router: Router
  ) {}

  async ngOnInit() {
    await this.taskService.loadTasks();       // nacte ulozene ulohy z pameti
    this.tasks = this.taskService.getTasks(); // ulohy se ulozi do seznamu
    this.loading = false;
  }

  // vraci ulohy vyfiltrovane podle searchTerm
  get filteredTasks(): Task[] {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      return this.tasks;                      // bez hledani vrat vse
    }

    // filtruje podle nazvu nebo poznamky
    return this.tasks.filter(t =>
      t.title.toLowerCase().includes(term) ||
      (t.note ?? '').toLowerCase().includes(term)
    );
  }

  async toggleDone(task: Task) {
    await this.taskService.toggleDone(task);  // prepina ulohu mezi hotovo/nehotovo
  }

  async deleteTask(task: Task, event: Event) {
    event.stopPropagation();                  // zabrani otevreni editace pri kliku na tlacitko

    const confirmDelete = confirm('Opravdu chces smazat tuto ulohu?');
    if (!confirmDelete) return;

    await this.taskService.deleteTask(task.id); // smaze ulohu z pameti
    this.tasks = this.taskService.getTasks();   // obnovi seznam
  }

  newTask() {
    this.router.navigate(['/edit-task', 'new']);    // vytvori novou ulohu
  }

  editTask(task: Task, event?: Event) {
    if (event) {
      event.stopPropagation();                     // zabrani dvojimu spusteni klikani
    }
    this.router.navigate(['/edit-task', task.id]); // uprava existujici ulohy
  }

  goToMotivation() {
    this.router.navigate(['/motivation']);         // prejde na stranku s citatem
  }
}
