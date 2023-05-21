import { TimeserviceService } from "../services/timeservice.service";
import { Task } from "./task";
import { timeSpan } from "./timeSpan";

export class localStorageTaskObj {
    name: string = ''
    timeSpans: timeSpan[] = []
    isStopped: boolean = false

    // zur Vorbereitung für die Speicherung in den localStorage
    initFromTaskObj(task: Task) {
        this.name = task.name;
        this.timeSpans = task.timeSpans;
        this.isStopped = task.isStopped;
    }

    // der localStorage wird in dieses Object geladen
    intFromLocalStorage(localStorageObj: any) {
        this.name = localStorageObj.name;
        for(const timeS of localStorageObj.timeSpans){
            if(timeS.startTime) timeS.startTime = new Date(timeS.startTime);
            if(timeS.endTime) timeS.endTime = new Date(timeS.endTime);
        };
        this.timeSpans = localStorageObj.timeSpans;
        this.isStopped = localStorageObj.isStopped;
    }

    // gibt ein Task Objekt zurück, weil im localStorage nur die obigen Daten gespeichert werden
    toTaskObj(ts: TimeserviceService): Task{
        const task = new Task(this.name, ts);
        task.timeSpans = this.timeSpans;
        task.isStopped = this.isStopped;
        task.setTotalTaskTime();
        return task;  
    }
}