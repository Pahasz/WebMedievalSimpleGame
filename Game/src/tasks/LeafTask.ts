///<reference path="Task.ts"/>

import BlackBoard = require('./BlackBoard');
import Task = require('./Task');
import TaskController = require('./control/TaskController');

/**
 * Created by Paha on 7/25/2015.
 */
class LeafTask extends Task{
    protected control:TaskController;

    constructor(bb:BlackBoard) {
        super(bb);

        this.control = new TaskController(this);
    }

    start():void {
        super.start();
    }

    update(delta):void  {
        super.update(delta);
    }

    end():void  {
        super.end();
    }


    getControl():TaskController {
        return this.control;
    }
}

export = LeafTask;