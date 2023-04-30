import { BehaviorSubject } from 'rxjs';

export class task {
    name: string;
    time: BehaviorSubject<string> = new BehaviorSubject('');
    private seconds = 0;
    private minutes = 0;
    private hours = 0;
    counter: any;

    constructor(name: string, time = '00:00:00') {
        this.name = name;
        if (time) {
            const [hoursStr, minutesStr, secondsStr] = time.split(':');
            this.hours = parseInt(hoursStr);
            this.minutes = parseInt(minutesStr);
            this.seconds = parseInt(secondsStr);
        }
        this.time.next(this.formatTime(this.getTimeString()));

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
            this.time.next(this.formatTime(this.getTimeString()));
        }, 1000);
    }

    stopCounter(): void {
        clearInterval(this.counter);
    }

    private getTimeString(): string {
        const timeParts = [];

        timeParts.push(this.hours.toString().padStart(2, '0'));
        timeParts.push(this.minutes.toString().padStart(2, '0'));
        timeParts.push(this.seconds.toString().padStart(2, '0'));
        
        return timeParts.join(':');
    }

    private formatTime(timeString: string) {
        // Extrahiere Stunden, Minuten und Sekunden aus der Zeitangabe
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        
        // Erstelle eine Liste mit formatierten Zeiteinheiten, die keine führenden Nullen haben
        const formattedUnits = [];
        if (hours > 0) {
          formattedUnits.push(hours.toString())
        }
        if (minutes > 0 || formattedUnits.length > 0) {
          formattedUnits.push(minutes.toString().padStart(2, '0'));
        }
        if (seconds >= 0) {
          formattedUnits.push(seconds.toString().padStart(2, '0'));
        }
      
        // Füge die formatierten Zeiteinheiten zusammen und gib das Ergebnis zurück
        return formattedUnits.join(':');
      }
}
