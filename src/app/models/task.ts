import { BehaviorSubject } from 'rxjs';
import { TimeserviceService } from '../services/timeservice.service';
import { timeSpan } from './timeSpan';

export class Task {
    time: BehaviorSubject<string> = new BehaviorSubject('00');
    timeSpans: timeSpan[] = []
    counter: any;
    editMode: boolean = false;
    isStopped: boolean = false;

    constructor(public name: string, public ts: TimeserviceService) {}

    startCounter() {
        this.isStopped = false;
        this.timeSpans.push(new timeSpan());
        
        this.counter = setInterval(() => {
           
            this.setTotalTaskTime();

        }, 1000);
    }

    setTotalTaskTime(){
        const totalTimeSpans = [];
        for (let t of this.timeSpans) {
            const endTime = t.endTime ?? new Date();
            const diff = endTime.getTime() - t.startTime.getTime();
            totalTimeSpans.push(diff);
        }
        
        const sum = totalTimeSpans.reduce((acc, curr) => acc + curr, 0);            

        // die Dauer in Stunden, Minuten und Sekunden berechnen
        const hours = Math.floor(sum / 3600000); // 1 Stunde = 3600000 Millisekunden
        const minutes = Math.floor((sum % 3600000) / 60000); // 1 Minute = 60000 Millisekunden
        const seconds = Math.floor((sum % 60000) / 1000); // 1 Sekunde = 1000 Millisekunden

        const timeString = hours.toString().padStart(2, '0') + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');

        this.time.next(this.ts.formatTimeShort(timeString));
    }

    stopCounter(): void {
        const timeSpan = this.timeSpans.at(-1);
        timeSpan!.endTime = new Date();
        this.isStopped = true;
        clearInterval(this.counter);
        this.counter = null;
    }  
}
