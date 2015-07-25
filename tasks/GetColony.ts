/**
 * Created by Paha on 7/25/2015.
 */

///<reference path="../Game.ts"/>

class GetColony extends Task{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    start() {
        super.start();
    }

    update(delta) {
        super.update(delta);

        this.bb.target = this.bb.me.colony;
        this.bb.targetPosition = this.bb.target.sprite.position;
        this.finish(false);
    }

    finish(failed:boolean) {
        super.finish(failed);
    }
}