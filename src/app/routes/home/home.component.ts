import { ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
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
  currentTaskInEditMode: task | null = null;

  constructor(public ts: TaskserviceService, private formBuilder: FormBuilder, public title: Title, public elem: ElementRef, public cdRef: ChangeDetectorRef) {
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    for(let t of this.ts.getTasks()){
      if(t === this.currentTaskInEditMode) continue;
      t.editMode = false;      
    }
    this.currentTaskInEditMode = null;
  }

  editModeTaskName(t: task, target:any) {
    t.editMode = true;
    this.cdRef.detectChanges();
    const td = target.closest('.tdTaskName');
    const input = td?.querySelector('input');
    input?.focus();
    this.currentTaskInEditMode = t;
  }

  editTaskName(task: task, name:string) {
    task.name = name;
    task.editMode = false;
    this.cdRef.detectChanges();
  }
}
