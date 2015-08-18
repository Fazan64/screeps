var COST            = {};
COST[MOVE]          = 50;
COST[WORK]          = 100;
COST[CARRY]         = 50;
COST[ATTACK]        = 80;
COST[RANGED_ATTACK] = 150;
COST[HEAL]          = 250;
COST[TOUGH]         = 10;

function CalculateCost (parts)
{
    var cost = 0;
    for (var part in parts)
    {
        if (COST[part])
        {
            cost += COST[part];
        }
    }
    return cost;
}

//region CreepBody

function CreepBody (parts)
{
    /*protected*/ this._parts = parts;
    /*protected*/ this._cachedCost = CalculateCost (parts);
}

CreepBody.prototype.getCost = function ()
{
    if (!this._cachedCost)
    {
        this._cachedCost = CalculateCost (this._parts);    
    }
    return this._cachedCost;
};

CreepBody.prototype.getParts = function ()
{
    return this._parts;
};

CreepBody.prototype.setParts = function (parts)
{
    this._parts = parts;
    this._cachedCost = CalculateCost (parts);
};

//endregion CreepBody

/** Contains the base parts needed for these Creeps to minimally fulfil their roles.
 * Use generateBody in 'spawner' module to get the finalBody configuration.
 * To get base body configurations use role names as hash keys (baseBodies ["harvester"])
 */
module.exports = 
{
	"harvester" :   new CreepBody ([WORK, CARRY]),
    
    "guard" :       new CreepBody ([ATTACK, TOUGH]),
    
    "shooter" :     new CreepBody ([RANGED_ATTACK, TOUGH]),
    
    "upgrader" :    new CreepBody ([WORK, CARRY]),
    
    "builder" :     new CreepBody ([WORK, CARRY]),
    
    "healer" :      new CreepBody ([HEAL, TOUGH]),
    
    "tanker" :      new CreepBody ([CARRY, CARRY])
}