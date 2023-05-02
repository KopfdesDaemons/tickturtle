import { Component } from '@angular/core';
import { TaskserviceService } from 'src/app/services/taskservice.service';
import { task } from 'src/app/models/task'; 
import { FormBuilder, FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import {
  faCheck
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  faCheck = faCheck;

  newTaskForm: FormGroup;
  isButtonDisabled = true;

  constructor(public ts: TaskserviceService, private formBuilder: FormBuilder, public title: Title) {
    this.newTaskForm = this.formBuilder.group({
      newTask: [''],
    })
    
    // Aktiviert und Deaktiviert den Hinzufügenbutton
    this.newTaskForm.get('newTask')?.valueChanges.subscribe(value => {
      this.isButtonDisabled = (value == '');
    });
  }
  
  addTask() {
    const newTask: task = new task(this.newTaskForm.get('newTask')?.value);
    this.ts.addTask(newTask);
    this.newTaskForm.controls['newTask'].setValue('');
    this.ts.getCurrentTask()?.time.subscribe((value)=> {
      this.title.setTitle('TickTurtle ' + value + ' ' + this.ts.getCurrentTask()?.name)
    })
  }
}
