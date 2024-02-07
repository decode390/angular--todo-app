import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { TodoItem } from '../models/todo-item.model';

@Injectable({
  providedIn: 'root'
})
export class TodosService {

  private readonly _todos = new BehaviorSubject<TodoItem[]>([]);
  readonly todos$ = this._todos.asObservable();
  
  private get currentTodos() : TodoItem[] {
    return this._todos.getValue();
  }
  

  constructor(
    private _http: HttpClient,
  ) {
    this.getTodos().subscribe();
  }


  getTodos() {
    return this._http.get<TodoItem[]>(`/todos`)
      .pipe(tap( v => this._todos.next(v) ))
  }


  addTodo({text, completed}: TodoItem){
    const itemToPost = {text, completed};
    return this._http.post<TodoItem>(`/todos`, itemToPost)
      .pipe(tap(v => this._todos.next([...this.currentTodos, v])))
  }


  deleteTodoById(id: string){

    return this._http.delete<TodoItem>(`/todos/${id}`)
      .pipe(tap(_ => 
        this._todos.next([...this.currentTodos.filter(e => e.id !== id)])
      ));

  }


  updateTodoText({id, text}: TodoItem){
    const todosAndToModify = this.getCurrentTodosAndTodoById(id);
    if (!todosAndToModify) return;
    const {toModify, todos} = todosAndToModify;
    toModify.text = text;

    return this._http.put<TodoItem>(`/todos/${id}`, toModify)
      .pipe(tap(_ => 
        this._todos.next(todos)));
  }


  toggleComplete(id: string){
    const todosAndToModify = this.getCurrentTodosAndTodoById(id);
    if (!todosAndToModify) return;
    const {toModify, todos} = todosAndToModify;
    toModify.completed = !toModify.completed;
    
    return this._http.put<TodoItem>(`/todos/${id}`, toModify)
      .pipe(tap(_ => this._todos.next(todos)));
  }


  private getCurrentTodosAndTodoById(id: string): TodosAndToModify | null{
    const index = this.currentTodos.findIndex(e => e.id === id);
    if (index === -1) return null;
    const todos = [...this.currentTodos];
    const toModify = todos[index];
    return {toModify, todos};
  }
  
}


interface TodosAndToModify{
  todos: TodoItem[],
  toModify: TodoItem
}
