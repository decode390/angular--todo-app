import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { delay, of } from 'rxjs';
import Swal from 'sweetalert2';
import { TodoItem } from '../../models/todo-item.model';
import { TodosService } from '../../services/todos.service';
import { TodoItemComponent } from './todo-item.component';

let component: TodoItemComponent;
let fixture: ComponentFixture<TodoItemComponent>;
let todosService: TodosService;

const todo: TodoItem = {
  id: '1',
  text: 'Test todo 1',
  completed: false
}

describe('TodoItemComponent', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        TodoItemComponent
      ],
      providers: [TodosService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  });
  
  beforeEach(() => {
    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = todo;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });
  

  
  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  
  it('should be call toggleComplete', () => {
    const spy = spyOn(todosService, 'toggleComplete').and.callThrough();
    component.toggleComplete();
    expect(spy).toHaveBeenCalled();
  });

  
  it('should be call deleteTodo', (done) => {
    const spy = spyOn(todosService, 'deleteTodoById').and.callThrough();
    component.deleteTodo();
    Swal.clickConfirm();
    setTimeout(() => {
      expect(spy).toHaveBeenCalled();
      done();
    });
  });


  it('should be toggle edit', () => {
    component.toggleEdit();
    expect(component.editMode).toBe(true);
    component.toggleEdit();
    expect(component.editMode).toBe(false);
  });


  it('should be call updateTodoText', (done) => {
    const spy = spyOn(todosService, 'updateTodoText').and.callFake(_ => of(todo).pipe(delay(0)));
    component.updateTextTodo('text changed');
    component.toggleEdit();
    expect(spy).toHaveBeenCalled();
    todosService.updateTodoText(todo)?.subscribe(_ => {
      expect(component.todo.text).toBe('text changed');
      expect(component.editMode).toBe(false);
      done();
    });
  })
  
});
