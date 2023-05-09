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
    if (this.currentTask) {
      this.currentTask.stopCounter();
    }
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
      this.currentTask = null;
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

  toLocalStorage(): void {
    const taskMap: Map<string, string> = new Map();
    const tasks = this.tasks.value;
    for(const t of tasks) {
      taskMap.set(t.name, JSON.stringify(t.timeSpans))
    }
    localStorage.setItem('tasks', JSON.stringify([...taskMap]));
  }

  fromLocalStorage():void {
    const string = localStorage.getItem('tasks') ?? '';
    const obj = JSON.parse(string);
    console.log(obj);

    for(const t of obj){
      const loadedTask = new Task(t[0], this.ts);

      // Load timeSpans
      const timeSpansString = t[1];
      console.log(timeSpansString);
      
      const timeSpans = JSON.parse(timeSpansString).map((obj: any) => {
        const timeSp: timeSpan = new timeSpan();
        timeSp.startTime = new Date(obj.startTime);
        timeSp.endTime = obj.endTime ? new Date(obj.endTime) : null;
        return timeSp;
      });
      

      loadedTask.timeSpans = timeSpans;
      loadedTask.setTotalTaskTime();
      this.tasks.next([...this.tasks.value, loadedTask]);
    }

    this.currentTask = this.tasks.value.at(-1) ?? null;
    if(!this.currentTask?.timeSpans.at(-1)?.endTime){
      this.currentTask?.startCounter();
    } else{
      this.currentTask.isStopped = true;
    }
  }
}