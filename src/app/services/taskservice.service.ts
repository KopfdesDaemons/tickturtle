import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { task } from '../models/task';
import { TimeserviceService } from './timeservice.service';

@Injectable({
  providedIn: 'root'
})
export class TaskserviceService {

  private currentTask: task | null = null;
  private tasks: BehaviorSubject<task[]> = new BehaviorSubject(new Array());

  constructor(private ts: TimeserviceService) { }

  addTask(newTask: task) {
    this.tasks.next([...this.tasks.value, newTask]);
    if (this.currentTask) {
      this.currentTask.stopCounter();
    }
    this.currentTask = newTask;
  }

  getTasks(): task[] {
    return [...this.tasks.value].reverse();
  }

  getCurrentTask(): task | null {
    return this.currentTask;
  }

  deleteTask(taskToDelete: task) {
    this.tasks.next(this.tasks.value.filter((task) => task !== taskToDelete));
    if (taskToDelete === this.currentTask) {
      this.currentTask = null;
    }
  }

  getTotalTime(): string {
    let totalTime = "00:00:00";
    const tasks = this.tasks.value;

    for (const task of tasks) {
      const time = task.time.value;
      if (!time) continue;
      const formattedTime = this.ts.formatTimeLong(time);
      totalTime = this.ts.addTime(totalTime, formattedTime);
    }

    return this.ts.formatTimeShort(totalTime);
  }
}
