import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { task } from '../models/task';

@Injectable({
  providedIn: 'root'
})
export class TaskserviceService {

  private currentTask: task | undefined;
  private tasks: BehaviorSubject<task[]> = new BehaviorSubject(new Array());

  constructor() { }

  addTask(task: task) {
    this.tasks.next(this.tasks.value.concat(task));
    this.currentTask?.stopCounter();
    this.currentTask = task;
  }

  // Gibt eine Kopie der aktuellen Aufgaben zurück
  getTasks(): task[] {
    return [...this.tasks.value].reverse();
  }

  getCurrentTask() {
    return this.currentTask;
  }
}
