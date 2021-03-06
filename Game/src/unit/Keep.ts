///<reference path="../Game.ts"/>

import _Game = require('../Game');
import _Building = require('./Building');
import _BannerMan = require('../components/BannerMan');
import _Peasant = require('./Peasant');

/**
 * Created by Paha on 8/3/2015.
 */
class Keep extends _Building implements IDropoffPoint{
    bannerMan:_BannerMan = null;
    nextSpawnTime:number = 0;
    respawnTime:number = 10000;
    requestedPickup:boolean = false;
    bannermanCost:number = 25;

    constructor(x:number, y:number, warGame:_Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number) {
        super(x, y, warGame, playerName, sprite, width, height);
    }


    start():void {
        super.start();
        this.sprite.loadTexture('capitol');
        this.currRetaliationStrength = this.maxRetaliationStrength = 75;
        this.retaliationStrengthTime = 500;
        this.capitol.addToDropoffList(this);
    }

    update(delta):void {
        super.update(delta);

        //TODO This needs to be fixed. The worker needs to be casted to a bannerman and immediately assigned the keep.
        //TODO The problem is that the bannerman isn't immediately available...

        //If the worker is null/destroyed and the next spawn time is -1... set the next spawn time.
        if((this.worker === null || this.worker.toBeDestroyed) && this.nextSpawnTime === -1){
            this.nextSpawnTime = this.warGame.game.time.now + this.respawnTime;

        }else if((this.worker === null || this.worker.toBeDestroyed) && this.nextSpawnTime !== -1) {
            if(this.warGame.game.time.now >= this.nextSpawnTime && this.capitol.food >= this.bannermanCost) {
                this.worker = this.capitol.addFreePeasant('leader', this.sprite.x, this.sprite.y);
                this.bannerMan = null; //We have to null this so we can acquire a new one below!
                this.capitol.food -= this.bannermanCost;
                this.nextSpawnTime = -1;
            }
        }else if(this.worker !== null && !this.worker.toBeDestroyed && this.bannerMan == null){
            this.bannerMan = (<_Peasant>this.worker).getBannerMan();
            this.bannerMan.keep = this;
        }

        if(this.food > 0 && !this.requestedPickup){
            this.requestedPickup = true;
            this.capitol.addTaskToQueue(this.deliverToColony);
        }
    }

    destroy():void {
        super.destroy();
        this.worker.destroy();
        this.capitol.removeFromDropoffList(this);
    }
}

export = Keep;