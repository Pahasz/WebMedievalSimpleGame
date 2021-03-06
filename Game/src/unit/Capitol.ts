/// <reference path="./../Game.ts"/>

import Game = require('../Game');
import Peasant = require('./Peasant');
import Building = require('./Building');
import House = require('./House');
import Farm = require('./Farm');
import Mine = require('./Mine');
import Keep = require('./Keep');
import Barracks = require('./Barracks');
import CircularQueue = require('../util/CircularQueue');
import Task = require('../tasks/Task');
import PM = require('../util/PlayerManager');
import PlayerManager = PM.PlayerManager
import Player = PM.Player;
import U = require('./Unit');
import Unit = U.Unit;
import Group = U.Group;

/**
 * Created by Paha on 7/23/2015.
 *
 * Super prototyping extension of the prototype class.
 */
class Capitol extends Unit{
    static playerCounter : number;
    freePeasantList : Unit[] = [];
    workerList : Unit[] = [];
    armyList : Unit[] = [];
    buildingList : Unit[] = [];
    groupList : Group[] = [];
    dropoffList : Unit[] = [];
    lastResources : number = 0;
    avgResources : number = 0;
    timer : Phaser.TimerEvent;
    taskQueue:CircularQueue<any>;

    constructor(x:number, y:number, warGame:Game, playerName:string, sprite:Phaser.Sprite, width?:number, height?:number){
        super(x, y, warGame, playerName, sprite, width, height);

        this.timer = this.warGame.game.time.events.loop(Phaser.Timer.SECOND*1, this.calcRate, this);
        this.type = 'building';
        this.name = 'capitol';
        this.taskQueue = new CircularQueue<any>(100);
        PlayerManager.getPlayer(playerName).capitol = this;
    }

    start():void {
        super.start();

        this.sprite.loadTexture('capitol');
        this.width = this.sprite.width;
        this.height = this.sprite.height;
        this.addToDropoffList(this);
    }

    update(delta){
        super.update(delta);
        var unit:Unit = null;

        var i;
        for(i=0;i<this.freePeasantList.length;i++) {
            unit = this.freePeasantList[i];
            if(unit.toBeDestroyed){
                unit.finalDestroy();
                this.freePeasantList.splice(i, 1);
                i--;
            }else
                this.freePeasantList[i].update(delta);
        }
        for(i=0;i<this.workerList.length;i++) {
            unit = this.workerList[i];
            if(unit.toBeDestroyed){
                unit.finalDestroy();
                this.workerList.splice(i, 1);
                i--;
            }else
                this.workerList[i].update(delta);
        }
        for(i=0;i<this.armyList.length;i++) {
            unit = this.armyList[i];
            if(unit.toBeDestroyed){
                unit.finalDestroy();
                this.armyList.splice(i, 1);
                i--;
            }else
                this.armyList[i].update(delta);
        }
        for(i=0;i<this.buildingList.length;i++) {
            unit = this.buildingList[i];
            if(unit.toBeDestroyed){
                unit.finalDestroy();
                this.buildingList.splice(i, 1);
                i--;
            }else
                this.buildingList[i].update(delta);
        }
    }

    addFreePeasant(name:string, x:number, y:number, id?:number):Unit{
        var sprite:Phaser.Sprite = this.warGame.peasantGroup.getFirstDead();
        if(sprite === undefined || sprite === null) sprite = this.warGame.peasantGroup.create(0,0,'');
        else sprite.reset(0,0);

        var unit = new Peasant(x, y, this.warGame, this.playerName, sprite);
        unit.name = name;
        unit.type = 'peasant';
        unit.id = id || unit.id; //ID is made in the constructor, but if we have one supplied, use that instead.
        unit.sprite.autoCull = true;

        this.freePeasantList.push(unit);
        return unit;
    }

    addBuilding(name:string, x:number, y:number, id?:number):Building{
        var unit:Building = null;
        var sprite:Phaser.Sprite = this.warGame.buildingGroup.getFirstDead();
        if(sprite === undefined || sprite === null)
            sprite = this.warGame.buildingGroup.create(0,0,'');
        else
            sprite.reset(0,0);

        if(name === 'house') unit = new House(x, y, this.warGame, this.playerName, sprite);
        if(name === 'farm') unit = new Farm(x, y, this.warGame, this.playerName, sprite);
        if(name === 'barracks') unit = new Barracks(x, y, this.warGame, this.playerName, sprite);
        if(name === 'mine') unit = new Mine(x, y, this.warGame, this.playerName, sprite);
        if(name === 'keep') unit = new Keep(x, y, this.warGame, this.playerName, sprite);

        unit.name = name;
        unit.type = 'building';
        unit.id = id || unit.id;
        unit.sprite.autoCull = true;

        this.buildingList.push(unit);
        return unit;
    }

    addGroup(leader:Peasant){
        var group:Group = new Group(leader);
        leader.getBannerMan().group = group;
        this.groupList.push(group);
        return group;
    }

    addToDropoffList(unit:Unit):void{
        this.dropoffList.push(unit);
    }

    removeFromDropoffList(unit:Unit):void{
        for(var i=0;i<this.dropoffList.length;i++){
            if(this.dropoffList[i] === unit){
                this.dropoffList.splice(i, 1);
                break;
            }
        }
    }

    removeGroup(group:Group){
        for(var i=0;i<=this.groupList.length;i++)
            if(this.groupList[i] === group){
                this.groupList.splice(i, 1);
                break;
            }
    }

    getGroupList():Group[]{
        return this.groupList;
    }

    addTaskToQueue(func:any){
        this.taskQueue.add(func);
    }

    getTaskFromQueue():Task{
        return this.taskQueue.popFirst();
    }

    calcRate = () =>{
        this.avgResources = this.food - this.lastResources;
        this.lastResources = this.food;
    };

    destroy(){
        var i=0;
        for(i=0;i<this.freePeasantList.length;i++)
            this.freePeasantList[i].destroy();
        for(i=0;i<this.workerList.length;i++)
            this.workerList[i].destroy();
        for(i=0;i<this.armyList.length;i++)
            this.armyList[i].destroy();
        for(i=0;i<this.buildingList.length;i++)
            this.buildingList[i].destroy();

        this.freePeasantList = [];
        this.workerList = [];
        this.armyList = [];
        this.buildingList = [];

        this.text.destroy();

        this.warGame.game.time.events.remove(this.timer);
    }
}

export = Capitol;