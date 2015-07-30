///<reference path="../../Game.ts"/>

/**
 * Created by Paha on 7/25/2015.
 */
class ParentTaskController extends TaskController{
    public tasks:Task[];
    public currTask:Task;
    public index:number;

    constructor(task:Task) {
        super(task);

        this.tasks = [];
        this.currTask = null;
        this.index = 0;
    }

    addTask(task:Task){
        this.tasks.push(task);
    }
}