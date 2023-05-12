import { ChangeDetectorRef, Component, ElementRef, HostListener } from '@angular/core';
import { TaskserviceService } from 'src/app/services/taskservice.service';
import { Task } from 'src/app/models/task';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import {
  faCheck,
  faXmark,
  faPause,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import { TimeserviceService } from 'src/app/services/timeservice.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  faCheck = faCheck;
  faXmark = faXmark;
  faPause = faPause;
  faPlay = faPlay;

  newTaskForm: FormGroup;
  isButtonDisabled = true;
  currentTaskInEditMode: Task | null = null;

  constructor(public ts: TaskserviceService, private formBuilder: FormBuilder, public title: Title, public elem: ElementRef, public cdRef: ChangeDetectorRef, public timeS: TimeserviceService, public meta: Meta ) {
    this.newTaskForm = this.formBuilder.group({
      newTask: [''],
    })

    const description = 'Record the working time of several work steps and get the total time. No registration required.'
    this.meta.addTag({ name: 'description', content: description }); 

    ts.fromLocalStorage();

    // Aktiviert und Deaktiviert den Hinzufügenbutton
    this.newTaskForm.get('newTask')?.valueChanges.subscribe(value => {
      this.isButtonDisabled = (value == '');
    });
  }

  addTask() {
    const newTask: Task = new Task(this.newTaskForm.get('newTask')?.value, this.timeS);
    newTask.startCounter();
    this.ts.addTask(newTask);
    this.newTaskForm.controls['newTask'].setValue('');
    this.ts.getCurrentTask()?.time.subscribe((value) => {
      this.title.setTitle('TickTurtle ' + value + ' ' + this.ts.getCurrentTask()?.name)
    })
  }

  deleteTask(t: Task) {
    this.ts.deleteTask(t);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: any) {
    if (event.target.parentNode?.classList.contains('inputfeld')) return;

    // Bearbeitenmodus verlassen, wenn klick auf Webseite
    for (let t of this.ts.getTasks()) {
      if (t == this.currentTaskInEditMode) continue;
      t.editMode = false;
    }
    this.currentTaskInEditMode = null;
  }

  editModeTaskName(t: Task, target: any) {
    t.editMode = true;
    this.cdRef.detectChanges();
    const td = target.closest('.tdTaskName');
    const input = td?.querySelector('input');
    input?.focus();
    this.currentTaskInEditMode = t;
  }

  editTaskName(task: Task, name: string) {
    task.name = name;
    this.ts.toLocalStorage();
    task.editMode = false;
    this.cdRef.detectChanges();
  }

  stopCounter() {
    const t = this.ts.getCurrentTask();
    t?.stopCounter();
    this.ts.toLocalStorage();
  }

  startCounter() {
    const t = this.ts.getCurrentTask();
    t?.startCounter();
    this.ts.toLocalStorage();
  }

  deleteAllTasks() {
    this.ts.deleteAll();
    this.ts.toLocalStorage();
  }

  print(){
    window.print();
  }
}
