import { BehaviorSubject } from 'rxjs';
import { TimeserviceService } from '../services/timeservice.service';
import { timeSpan } from './timeSpan';

export class Task {
    time: BehaviorSubject<string> = new BehaviorSubject('00');
    timeSpans: timeSpan[] = []
    counter: any;
    isStopped: boolean = false;

    // Für Tabelle
    nameEditMode: boolean = false;
    accordionOpen: boolean = false;
    
    constructor(public name: string, public ts: TimeserviceService) {}

    startCounter() {
        this.isStopped = false;
        const lastTimeSpan = this.timeSpans.at(-1);
        const startTime= lastTimeSpan?.startTime;
        const endTime = lastTimeSpan?.endTime;
        if(!(startTime && !endTime)){
            this.timeSpans.push(new timeSpan());
        }
        
        this.counter = setInterval(() => {
           
            this.setTotalTaskTime();

        }, 1000);
    }

    setTotalTaskTime(){
        const totalTimeSpans = [];
        for (let t of this.timeSpans) {
            const endTime = t.endTime ?? new Date();
            const diff = endTime.getTime() - t.startTime.getTime();
            t.span = this.ts.calcTimeFromMilliseconds(diff);
            totalTimeSpans.push(diff);
        }
        
        // rechne alle timeSpans zusammen
        const sum = totalTimeSpans.reduce((acc, curr) => acc + curr, 0);  

        const timeString = this.ts.calcTimeFromMilliseconds(sum);
        this.time.next(this.ts.formatTimeShort(timeString));
    }

    stopCounter(): void {
        const timeSpan = this.timeSpans.at(-1);
        timeSpan!.endTime = new Date();
        this.isStopped = true;
        clearInterval(this.counter);
        this.counter = null;
    }
    
    deleteTimeSpan(timeS: timeSpan) {
        const index = this.timeSpans.findIndex(function (t) { return t === timeS })

        const lastTimeSpan = this.timeSpans.at(-1);
        if (lastTimeSpan === timeS) this.isStopped = true;
    
        this.timeSpans.splice(index, 1);
        this.setTotalTaskTime();
    }
}
