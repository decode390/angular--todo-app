import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodosService } from '../../services/todos.service';
import { TodoItem } from '../../models/todo-item.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-new-todo-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggleModule,
    CommonModule
  ],
  templateUrl: './new-todo-form.component.html',
  styleUrl: './new-todo-form.component.scss'
})
export class NewTodoFormComponent {
  newTodoForm: FormGroup;
  // text:

  get invalidTextFormat() {
    const textControl = this.newTodoForm.get('text')!;
    const invalid = textControl.invalid && (textControl.touched);
    return invalid;
  }

  constructor(
    private fb: FormBuilder,
    public todosSvc: TodosService,
  ){
    this.newTodoForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(5)]],
      completed: false
    });
  }

  addTodo(){
    if (this.newTodoForm.valid) {

      const {text, completed} = this.newTodoForm.value;
      this.todosSvc.addTodo(new TodoItem('', text, completed)).subscribe(_ => {
        this.newTodoForm.patchValue({text: '', completed: false});
      });

    } else {
      this.newTodoForm.markAllAsTouched();
    } 
  }

}
