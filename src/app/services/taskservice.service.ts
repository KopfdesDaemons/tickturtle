import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task';
import { TimeserviceService } from './timeservice.service';
import { timeSpan } from '../models/timeSpan';

@Injectable({
  providedIn: 'root'
})
export class TaskserviceService {

  private currentTask: Task | null = null;
  private tasks: BehaviorSubject<Task[]> = new BehaviorSubject(new Array());

  constructor(private ts: TimeserviceService) { }

  addTask(newTask: Task) {
    this.tasks.next([...this.tasks.value, newTask]);
    if (this.currentTask) this.currentTask.stopCounter();
    this.currentTask = newTask;
    this.toLocalStorage();
  }

  getTasks(): Task[] {
    return [...this.tasks.value].reverse();
  }

  getCurrentTask(): Task | null {
    return this.currentTask;
  }

  deleteTask(taskToDelete: Task) {
    this.tasks.next(this.tasks.value.filter((task) => task !== taskToDelete));
    if (taskToDelete === this.currentTask) {
      taskToDelete.stopCounter();
      this.currentTask = this.tasks.value.at(-1) ?? null;
    }
    this.toLocalStorage();
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

  setCurrentTask(task: Task) {
    this.currentTask = task;
  }

  deleteAll() {
    this.tasks = new BehaviorSubject(new Array());
    this.currentTask?.stopCounter();
    this.currentTask = null;
  }

  toLocalStorage(): void {
    const taskMap: { [name: string]: { timeSpans: any[]; isStopped: boolean } } = {};
    const tasks = this.tasks.value;
  
    for (const t of tasks) {
      taskMap[t.name] = {
        timeSpans: t.timeSpans,
        isStopped: t.isStopped,
      };
    }
  
    localStorage.setItem('tasks', JSON.stringify(taskMap));
  
    if (this.currentTask) {
      const id = this.tasks.value.findIndex((item) => item === this.currentTask);
      localStorage.setItem('currentTaskId', id.toString());
    }
  }
  
  fromLocalStorage(): void {
    try {
      const localStorageItem = localStorage.getItem('tasks');
      if (!localStorageItem) return;
  
      const obj: { [name: string]: { timeSpans: any[]; isStopped: boolean } } = JSON.parse(localStorageItem);
  
      for (const taskName in obj) {
        if (obj.hasOwnProperty(taskName)) {
          const taskData = obj[taskName];
  
          const loadedTask = new Task(taskName, this.ts);
          loadedTask.isStopped = taskData.isStopped;
  
          // Lade timeSpans
          const timeSpans = taskData.timeSpans.map((obj: any) => {
            const timeSp: timeSpan = new timeSpan();
            timeSp.startTime = new Date(obj.startTime);
            timeSp.endTime = obj.endTime ? new Date(obj.endTime) : null;
            return timeSp;
          });
  
          loadedTask.timeSpans = timeSpans;
          loadedTask.setTotalTaskTime();
          this.tasks.next([...this.tasks.value, loadedTask]);
        }
      }
  
      const currentTaskIdString = localStorage.getItem('currentTaskId');
      const currentTaskId = Number(currentTaskIdString);
  
      if (currentTaskId >= 0) {
        this.currentTask = this.tasks.value[currentTaskId];
      }
  
      if (!this.currentTask?.isStopped) {
        this.currentTask?.startCounter();
      }
    } catch {}
  }  
}