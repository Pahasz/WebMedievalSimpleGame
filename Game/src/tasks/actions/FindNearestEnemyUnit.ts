///<reference path="../../Game.ts"/>

import BlackBoard = require("../BlackBoard");
import LeafTask = require("../LeafTask");
import U = require("../../unit/Unit");
import Unit = U.Unit;
import PM = require('../../util/PlayerManager');
import PlayerManager = PM.PlayerManager
import Player = PM.Player;

class FindNearestEnemyUnit extends LeafTask{

    constructor(bb:BlackBoard) {
        super(bb);
    }

    start():void {
        super.start();
    }

    update(delta):void {
        super.update(delta);

        var closestDst:number = 0;
        var closestUnit:Unit = null;
        var _dst:number = 0;

        for(var playerName in PlayerManager.players){
            var player:Player = PlayerManager.getPlayer(playerName);
            if(player === this.bb.myPlayer) continue; //Don't search ourselves!

            var list = player.capitol.freePeasantList;
            var l = list.length;
            for(var i=0;i<l;i++){
                var unit:Unit = list[i];
                if(unit.name === 'soldier' || unit.name === 'peasant' || unit.toBeDestroyed) continue; //Don't target soldiers or peasants for now, just bannermans
                //Calc the distance. If the closest unit is null or the target being checked is closer, assign the new unit/distance.
                _dst = this.bb.me.sprite.position.distance(list[i].sprite.position);
                if(closestUnit === null || _dst <= closestDst){
                    closestUnit = list[i];
                    closestDst = _dst;
                }
            }

            list = player.capitol.buildingList;
            l = list.length;
            for(var i=0;i<l;i++){
                var unit:Unit = list[i];
                if(unit.toBeDestroyed) continue;
                //Calc the distance. If the closest unit is null or the target being checked is closer, assign the new unit/distance.
                _dst = this.bb.me.sprite.position.distance(unit.sprite.position);
                if(closestUnit === null || _dst <= closestDst){
                    closestUnit = list[i];
                    closestDst = _dst;
                }
            }
        }

        //Assign the target and succeed/fail based on if null or not.
        this.bb.target = closestUnit;
        if(this.bb.target === null)
            this.control.finishWithFailure();
        else {
            this.bb.targetPosition = closestUnit.sprite.position;
            this.control.finishWithSuccess();
        }
    }

    end():void {
        super.end();
    }
}

export = FindNearestEnemyUnit;