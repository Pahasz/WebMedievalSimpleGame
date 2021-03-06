/// <reference path="./../Game.ts"/>
///<reference path="Unit.ts"/>
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Unit = require('./Unit');
var TakeResource = require('../tasks/actions/TakeResource');
var MoveTo = require('../tasks/actions/MoveTo');
var GetColony = require('../tasks/actions/GetColony');
var GetClosestDropoff = require('../tasks/actions/GetClosestDropoff');
var GiveResource = require('../tasks/actions/GiveResource');
var Sequence = require('../tasks/composite/Sequence');
/**
 * An extension of the super prototype class.
 */
var Building = (function (_super) {
    __extends(Building, _super);
    function Building(x, y, warGame, playerName, sprite, width, height) {
        var _this = this;
        _super.call(this, x, y, warGame, playerName, sprite, width || 30, height || 30);
        this.nextRetIncrease = 0;
        this.refillTime = 1000;
        this.worker = null;
        this.maxRetaliationStrength = 5;
        this.currRetaliationStrength = 5;
        this.retaliationStrengthRate = 1;
        this.retaliationStrengthTime = 1000;
        this.deliverToColony = function (bb) {
            bb.target = _this;
            bb.targetPosition = _this.sprite.position;
            var seq = new Sequence(bb);
            var takeResource = new TakeResource(bb);
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(takeResource);
            seq.control.addTask(new GetColony(bb));
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(new GiveResource(bb));
            takeResource.getControl().finishCallback = function () { return _this.requestedPickup = false; };
            return seq;
        };
        this.deliverToDropoff = function (bb) {
            bb.target = _this;
            bb.targetPosition = _this.sprite.position;
            var seq = new Sequence(bb);
            var takeResource = new TakeResource(bb);
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(takeResource);
            seq.control.addTask(new GetClosestDropoff(bb));
            seq.control.addTask(new MoveTo(bb));
            seq.control.addTask(new GiveResource(bb));
            takeResource.getControl().finishCallback = function () { return _this.requestedPickup = false; };
            return seq;
        };
        this.type = 'building';
        this.name = 'farm';
        this.food = 0;
        this.iron = 0;
        this.blackBoard.moveSpeed = 0;
        this.sprite.angle = 0;
    }
    Building.prototype.start = function () {
        _super.prototype.start.call(this);
    };
    Building.prototype.update = function (delta) {
        _super.prototype.update.call(this, delta);
        if (this.currRetaliationStrength < this.maxRetaliationStrength && this.warGame.game.time.now >= this.nextRetIncrease) {
            this.currRetaliationStrength += this.retaliationStrengthRate;
            if (this.currRetaliationStrength >= this.maxRetaliationStrength)
                this.currRetaliationStrength = this.maxRetaliationStrength;
            this.nextRetIncrease = this.warGame.game.time.now + this.retaliationStrengthTime;
        }
    };
    return Building;
})(Unit.Unit);
module.exports = Building;
//# sourceMappingURL=Building.js.map