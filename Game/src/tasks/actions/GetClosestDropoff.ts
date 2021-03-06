///<reference path="../../Game.ts"/>

import BlackBoard = require('../BlackBoard');
import LeafTask = require('../LeafTask');

import Unit = require('../../unit/Unit');

/**
 * Created by Paha on 8/4/2015.
 */
class GetClosestDropoff extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    check():boolean {
        return super.check();
    }

    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);

        var list:Unit.Unit[] = this.bb.me.capitol.dropoffList;
        var l = list.length;
        var closestDrop:Unit.Unit=null;
        var closestDis:number=0;
        var _dst;
        for(var i=0;i<l;i++){
            var unit = list[i];
            _dst = this.bb.me.sprite.position.distance(unit.sprite.position);
            if(_dst <= closestDis || closestDrop === null){
                closestDis = _dst;
                closestDrop = unit;
            }
        }

        this.bb.target = closestDrop;
        this.bb.targetPosition = closestDrop.sprite.position;
        if(this.bb.target !== null)
            this.control.finishWithSuccess();
        else
            this.control.finishWithFailure();
    }

    end():void {
        super.end();
    }
}

export = GetClosestDropoff;