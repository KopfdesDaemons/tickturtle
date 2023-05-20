import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TimeserviceService {


  // Entfernt Minuten und Stunden, wenn diese 0 sind
  // Macht aus 00:00:12 -> 12
  formatTimeShort(timeString: string) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
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

    if(formattedUnits.length == 0) return '00';

    // Füge die formatierten Zeiteinheiten zusammen
    return formattedUnits.join(':');
  }


  // Fügt führende Nullen zur verkürzten Zeit hinzu
  // Macht aus 12 -> 00:00:12
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


  // Addiert zwei Zeiten im Format HH:mm:ss
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

  calcTimeFromMilliseconds(millisekunden: number) {
    // die Dauer in Stunden, Minuten und Sekunden berechnen
    const hours = Math.floor(millisekunden / 3600000); // 1 Stunde = 3600000 Millisekunden
    const minutes = Math.floor((millisekunden % 3600000) / 60000); // 1 Minute = 60000 Millisekunden
    const seconds = Math.floor((millisekunden % 60000) / 1000); // 1 Sekunde = 1000 Millisekunden

    const timeString = hours.toString().padStart(2, '0') + ':' +
      minutes.toString().padStart(2, '0') + ':' +
      seconds.toString().padStart(2, '0');

    return timeString;
  }
}
