import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task';
import { TimeserviceService } from './timeservice.service';
import { localStorageTaskObj } from '../models/localStorageTaskObj';

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

  continueTask(task: Task) {
    if (!this.getCurrentTask()?.isStopped) this.getCurrentTask()?.stopCounter();
    this.setCurrentTask(task);
  }

  deleteAll() {
    this.tasks = new BehaviorSubject(new Array());
    this.currentTask?.stopCounter();
    this.currentTask = null;
  }

  toLocalStorage(): void {
    const taskObjArray: localStorageTaskObj[] = [];
    const tasks = this.tasks.value;
  
    for (const t of tasks) {
      const obj = new localStorageTaskObj();
      obj.initFromTaskObj(t);
      taskObjArray.push(obj);
    }
  
    localStorage.setItem('tasks', JSON.stringify(taskObjArray));
  
    if (this.currentTask) {
      const id = this.tasks.value.findIndex((item) => item === this.currentTask);
      localStorage.setItem('currentTaskId', id.toString());
    }
  }
  
  fromLocalStorage(): void {
    try {
      this.tasks = new BehaviorSubject(new Array());
      const localStorageItem = localStorage.getItem('tasks');
      if (!localStorageItem) return;
  
      const taskObjArray = JSON.parse(localStorageItem);      
  
      for (const task of taskObjArray) {
        const loadedTask = new localStorageTaskObj();
        loadedTask.intFromLocalStorage(task);
        this.tasks.next([...this.tasks.value, loadedTask.toTaskObj(this.ts)]);
      }
  
      // Ermittle currentTask aus Id im localStorage
      const currentTaskIdString = localStorage.getItem('currentTaskId');
      const currentTaskId = Number(currentTaskIdString);
      if (currentTaskId >= 0) this.currentTask = this.tasks.value[currentTaskId];
      if (!this.currentTask?.isStopped) this.currentTask?.startCounter();
    } catch(e) {
      console.log(e);
    }
  }  
}