export class TodoItem {
    constructor(
        public readonly id: string,
        public text: string,
        public completed: boolean,
    ){}
}