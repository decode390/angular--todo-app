import { HttpClientTestingModule } from "@angular/common/http/testing";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder } from "@angular/forms";
import { TodoItem } from "../../models/todo-item.model";
import { TodosService } from "../../services/todos.service";
import { NewTodoFormComponent } from "./new-todo-form.component";
import { delay, of } from "rxjs";

let fixture: ComponentFixture<NewTodoFormComponent>;
let component: NewTodoFormComponent;
let todosSvc: TodosService;

const todo: TodoItem = {
    id: '1',
    text: 'Test todo 1',
    completed: false
}

describe('new-todo-form-component', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NewTodoFormComponent
            ],
            providers: [
                TodosService, 
                FormBuilder
            ],
            schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewTodoFormComponent);
        component = fixture.componentInstance;
        todosSvc = fixture.debugElement.injector.get(TodosService);
        fixture.detectChanges();
    });

    
    it('should create', () => {
        expect(component).toBeTruthy();
    });


    it('addTodo with form invalid should be markAllAsTouched', () => {
        component.newTodoForm.patchValue({text: '1234'});
        component.addTodo();
        const formControl = component.newTodoForm.get('text');
        expect(formControl?.valid).toBeFalse();
        expect(formControl?.value).toBe('1234');
    });

    it('addTodo valid form should be call addTodo', (done) => {
        component.newTodoForm.patchValue({text: '12345'});
        const spy = spyOn(todosSvc, 'addTodo').and.callFake(_ => of(todo).pipe(delay(0)));
        component.addTodo();
        expect(spy).toHaveBeenCalled();
        todosSvc.addTodo(todo).subscribe(_ => {
            const formControlText = component.newTodoForm.get('text');
            const formControlCompleted = component.newTodoForm.get('completed');
            expect(formControlText?.value).toBe('');
            expect(formControlCompleted?.value).toBeFalse();
            done();
        });
    });

});