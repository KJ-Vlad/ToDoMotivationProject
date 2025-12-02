import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Task {
  
}

export interface Task {
  id: string;
  title: string;
  note?: string;
  done: boolean;
}
