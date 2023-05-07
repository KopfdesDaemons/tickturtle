import { BehaviorSubject } from 'rxjs';
import { TimeserviceService } from '../services/timeservice.service';

export class task {
    name: string;
    time: BehaviorSubject<string> = new BehaviorSubject('');
    private seconds = 0;
    private minutes = 0;
    private hours = 0;
    counter: any;
    editMode: boolean = false;
    isStopped: boolean = false;

    constructor(name: string, public ts: TimeserviceService, time = '00:00:00') {
        this.name = name;
        if (time) {
            const [hoursStr, minutesStr, secondsStr] = time.split(':');
            this.hours = parseInt(hoursStr);
            this.minutes = parseInt(minutesStr);
            this.seconds = parseInt(secondsStr);
        }
        this.time.next(this.ts.formatTimeShort(this.getTimeString()));
        this.startCounter();
    }
    
    startCounter() {
        this.isStopped = false;
        this.counter = setInterval(() => {
            this.seconds++;
    
            if (this.seconds === 60) {
                this.seconds = 0;
                this.minutes++;
            }
    
            if (this.minutes === 60) {
                this.minutes = 0;
                this.hours++;
            }
            this.time.next(this.ts.formatTimeShort(this.getTimeString()));
        }, 1000);
    }

    stopCounter(): void {
        this.isStopped = true;
        clearInterval(this.counter);
    }

    private getTimeString(): string {
        const timeParts = [];

        timeParts.push(this.hours.toString().padStart(2, '0'));
        timeParts.push(this.minutes.toString().padStart(2, '0'));
        timeParts.push(this.seconds.toString().padStart(2, '0'));

        return timeParts.join(':');
    }
}
