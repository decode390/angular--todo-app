import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { skip } from "rxjs";
import { TodoItem } from "../models/todo-item.model";
import { TodosService } from "./todos.service";

let service: TodosService;
let httpMock: HttpTestingController;

const todoList: TodoItem[] = [
    {
        id: '1',
        text: 'Test todo 1',
        completed: false
    },
    {
        id: '2',
        text: 'Test todo 2',
        completed: true
    },
];

describe('todos service', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [TodosService],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        });
    });

    beforeEach(() => {
        service = TestBed.inject(TodosService);
        httpMock= TestBed.inject(HttpTestingController);
        
        const getTodosRequest = httpMock.expectOne({
            url: '/todos',
            method: 'get'
        });

        getTodosRequest.flush(todoList);
        httpMock.verify();
    });


    it('getTodos must be return default list of todos', () => {
        service.getTodos().subscribe(v => {
            expect(v).toEqual(todoList);
        });
        
        const req = httpMock.expectOne('/todos');
        req.flush(todoList);
    });


    it('addTodo must be return the array with new todo', () => {
        const newTodo: TodoItem = {
            id: "3",
            text: "Text todo 3",
            completed: false
        };

        service.todos$.pipe(skip(1)).subscribe(v => {
            expect(v).toEqual([...todoList, newTodo]);
        });

        service.addTodo(newTodo).subscribe();
        const req = httpMock.expectOne({url: '/todos', method: 'post'});
        req.flush(newTodo);
    });


    it('deleteTodoById must be delete todo of list', () => {
        const idToDelete = '1';

        service.todos$.pipe(skip(1)).subscribe(v => {
            expect(v).toEqual(todoList.filter(e => e.id !== idToDelete));
        });

        service.deleteTodoById(idToDelete).subscribe();
        const req = httpMock.expectOne({url: `/todos/${idToDelete}`, method: 'delete'});
        req.flush({...todoList[0]});
    });


    it('updateTodoText must be emit the new todo', () => {
        const todoToUpdate = {...todoList[0], text: 'modified'};

        service.todos$.pipe(skip(1)).subscribe(v => {
            expect(v.find(e => e.id == todoToUpdate.id)?.text).toBe('modified');
        });

        service.updateTodoText(todoToUpdate)?.subscribe();
        const req = httpMock.expectOne({url: `/todos/${todoToUpdate.id}`, method: 'put'});
        req.flush(todoToUpdate);
    });


    it('updateTodoText returns undefined when not found', () => {
        const notFoundTodo = {...todoList[0], id: '123'};
        const svResp = service.updateTodoText(notFoundTodo);
        expect(svResp).toBeFalsy();
    });

    
    it('toggleComplete must be works', () => {
        const todoToChange = {...todoList[0]};

        service.todos$.pipe(skip(1)).subscribe(v => {
            expect(v.find(e => e.id === todoToChange.id)?.completed).toBe(!todoToChange.completed);
        });

        service.toggleComplete(todoToChange.id)?.subscribe();
        const req = httpMock.expectOne({url: `/todos/${todoToChange.id}`, method: 'put'});
        req.flush({...todoToChange, completed: !todoToChange.completed});
    });


    it('toggleComplete returns undefined when not found', () => {
        const notFoundTodo = {...todoList[0], id: '123'};
        const svResp = service.toggleComplete(notFoundTodo.id);
        expect(svResp).toBeFalsy();
    });


    it('getCurrentTodosAndTodoById must be works', () => {
        const todoToFind = {...todoList[0]};
        const result = (service as any).getCurrentTodosAndTodoById(todoToFind.id);
        expect(result).toEqual(jasmine.objectContaining({
            todos: [...todoList],
            toModify: {...todoList[0]}
        }));
    });
    

    it('getCurrentTodosAndTodoById must be return null when not found', () => {
        const notFoundTodo = {...todoList[0], id: '123'};
        const result = (service as any).getCurrentTodosAndTodoById(notFoundTodo.id);
        expect(result).toBeFalsy();
    });

});