import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeserviceService {

  constructor() { }

  formatTimeShort(timeString: string) {
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

  formatTimeLong(time: string): string {
    let hours = 0;
    let minutes = 0;
    let seconds = 0;
  
    const timeArray = time.split(":").map(Number);
    const lastIndex = timeArray.length - 1;
  
    if (lastIndex === 0) {
      // Wenn nur Sekunden übergeben wurden (Format: "ss")
      seconds = timeArray[0];
    } else if (lastIndex === 1) {
      // Wenn Minuten und Sekunden übergeben wurden (Format: "mm:ss")
      minutes = timeArray[0];
      seconds = timeArray[1];
    } else if (lastIndex === 2) {
      // Wenn Stunden, Minuten und Sekunden übergeben wurden (Format: "HH:mm:ss")
      hours = timeArray[0];
      minutes = timeArray[1];
      seconds = timeArray[2];
    }
  
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  

  addTime(time1: string, time2: string) {
    const [hours1, minutes1, seconds1] = time1.split(':').map(Number);
    const [hours2, minutes2, seconds2] = time2.split(':').map(Number);

    let totalSeconds = seconds1 + seconds2;
    let carryOver = Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
    
    let totalMinutes = minutes1 + minutes2 + carryOver;
    carryOver = Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
    
    const totalHours = hours1 + hours2 + carryOver;
    const totalTime = this.formatTimeLong(`${totalHours}:${totalMinutes}:${totalSeconds}`);
    return totalTime;
  }
}
