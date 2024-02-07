import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodosService } from '../../services/todos.service';
import { NewTodoFormComponent } from '../new-todo-form/new-todo-form.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    TodoItemComponent, 
    CommonModule,
    NewTodoFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit{
  constructor(
    public todosSvc: TodosService,
  ){}

  ngOnInit(): void {
  }

}
