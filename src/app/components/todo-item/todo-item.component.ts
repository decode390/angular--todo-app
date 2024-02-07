import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import Swal from 'sweetalert2';
import { TodoItem } from '../../models/todo-item.model';
import { TodosService } from '../../services/todos.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  host: {
    '[class.completed]': 'todo.completed',
    '(click)' : 'toggleComplete($event)',
  },
  selector: 'app-todo-item[todo]',
  standalone: true,
  imports: [MatIconModule, CommonModule, FormsModule],
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.scss'
})
export class TodoItemComponent {
  @Input() todo!: TodoItem;
  editMode: boolean = false;

  constructor(
    public todosSvc: TodosService
  ){}

  deleteTodo(){
    Swal.fire({
      title: "Delete ToDo?",
      showCancelButton: true,
      showDenyButton: false,
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc3741"
    }).then((result) => {
      if (result.isConfirmed)
        this.todosSvc.deleteTodoById(this.todo.id).subscribe();
    });
  }

  toggleComplete(){
    if (!this.editMode)
      this.todosSvc.toggleComplete(this.todo.id)?.subscribe();
  }

  toggleEdit(){
    this.editMode = !this.editMode;
  }

  updateTextTodo(newText: string){
    this.todo.text = newText;
    this.todosSvc.updateTodoText(this.todo)?.subscribe(_ => {
      this.editMode = false;
    });
  }
}
