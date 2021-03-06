///<reference path="../Task.ts"/>

import BlackBoard = require('../BlackBoard');
import LeafTask = require('../LeafTask');

/**
 * Created by Paha on 7/25/2015.
 */
class MoveTo extends LeafTask{
    constructor(bb:BlackBoard){
        super(bb);
    }

    start(){
        super.start();
    }

    update(delta){
        super.update(delta);

        if(this.control.failCheck !== null && this.control.failCheck()) {
            this.control.finishWithFailure();
            return;
        }

        if(this.bb.targetPosition === undefined || this.bb.targetPosition === null)
            return;

        if(this.bb.me.walkTowardsPosition(this.bb.targetPosition, this.bb.disToStop, this.bb.moveSpeed))
            this.control.finishWithSuccess();

    }
}

export = MoveTo;