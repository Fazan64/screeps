/** 
 * Returns an object {name, index} having a generated name and an index
 * for a Creep with memory.role 'role' which is to be spawned by Spawn 'spawn'
 */
function getNameByRole(spawn, role)
{
    var creepIndex = 0;
    var creeps = Game.creeps;
    
    while (creeps[spawn.room.name + 'X' + role + 'X' + creepIndex]) 
    {
        creepIndex++;
    }
    
    var answer =  
    {
        name : spawn.room.name + 'X' + role + 'X' + creepIndex,
        index : creepIndex
    };
    return answer;
}

/**
 * Makes a Spawn 'spawn' create a Creep with memory.role 'role' and bodyparts 'parts' 
 */
function createByRole (spawn, role, parts)
{
    var creepInfo = getNameByRole(spawn, role);
    
    var spawnOutput = spawn.createCreep(parts, creepInfo.name, { role: role, index: creepInfo.index })
    
    // If spawning process started succesfully
    if (spawnOutput == creepInfo.name)
    {
        console.log("Spawning " + role + ": " + creepInfo.name);
        return true;
    }
    
    console.log ("Couldn't spawn a creep, error: " + spawnOutput);
    return false;
}

/**
 * Returns how many (integer) creeps with memory.role 'role'
 * are already in Spawn "spawn"'s creation queue 
 */ 
function countInQueue(spawn, role)
{
    var inQueue = 0;
    for (var i in spawn.memory.queue)
    {
        var creepSpec = spawn.memory.queue[i];
        if (creepSpec[0] == role) inQueue++;
    }
    return inQueue;
}

/** Checks if there are more or equal Creeps with memory.role 'role' in the same room 
 * as Spawn 'spawn'. If not, schedules the appropriate amount of such Creeps to be produced
 * by Spawn 'spawn' with bodies specified by 'parts'. 'creeps' contains already existing creeps 
 * of any role. 'creeps' is of type <string, Creep array>
 */
function checkCreepSupply(spawn, role, creeps, desiredAmount, parts) 
{

    if (spawn.spawning) 
    {
        return;
    }
    
    if (!spawn.memory.queue) 
    {
        spawn.memory.queue = [];
    }
      
    // num of creeps in the room 
    var inRoom = creeps[role] ? creeps[role].length : 0;
    // num of creeps scheduled for creation
    var inQueue = countInQueue(spawn, role);
    // adds creeps to the queue until the total of in room 
    // and in queue reaches the desired quantity
    while (inRoom + inQueue < desiredAmount) 
    {
        spawn.memory.queue.push([role, parts]);
        inQueue++;
    }
    
}

var LIFETIME = 1500;
/** 
 * If called every tick, makes Spawn 'spawn' produce a Creep with memory.role 'role'
 * and body specified by 'parts' every 'interval' amount of ticks with stagger 'stagger'
 */
function spawnCreepEvery(spawn, role, interval, stagger, parts) 
{
    if ((Game.time - stagger) % interval == 0 && countInQueue(spawn, role) == 0)
    {
        if (!spawn.memory.queue) 
        {
            spawn.memory.queue = [];
        }
        spawn.memory.queue.push([role, parts]);
    }
}

/** 
 * Makes Spawn 'spawn' create Creeps according to its creation queue
 */
function spawnFromQueue(spawn) 
{
    // Spawn's busy
    if (spawn.spawning) 
        return;
    // Nothing to create, queue's empty
    if (!spawn.memory.queue || !spawn.memory.queue.length) 
        return;
    // Creation process started successfully
    if (createByRole(spawn, spawn.memory.queue[0][0], spawn.memory.queue[0][1]))
    {
        spawn.memory.queue.shift();
    }
}

var COST            = {};
COST[MOVE]          = 50;
COST[WORK]          = 100;
COST[CARRY]         = 50;
COST[ATTACK]        = 80;
COST[RANGED_ATTACK] = 150;
COST[HEAL]          = 250;
COST[TOUGH]         = 10;

/**
 * Calculates the energy cost of a Creep with bodyparts 'parts' 
 */
function calculateCost (parts)
{
    var cost = 0;
    console.log ("----------------");
    console.log ("Evaluating cost:");
    for (var i in parts)
    {
        var part = parts[i];
        console.log (part);
        if (COST[part])
        {
            cost += COST[part];
        }
    }
    console.log ("Evaluated cost: " + cost);
    console.log ("----------------");
    return cost;
}

var MAX_PARTS = 30;

function generateBody (baseParts, maxEnergy)
{
    var baseBody = [];
    baseBody = baseBody.concat (baseParts);
    
    // Add enougn MOVE parts to let it move at half the max speed
    for (var i = 0; i < baseParts.length / 2; i++) 
    {
        baseBody.push(MOVE);
    }
    
    // How many baseBodys we can produce with maxEnergy
    var times = Math.floor (maxEnergy / calculateCost(baseBody));
    
    // If there are more parts than maximum, lower the 'times' accordingly
    if (times * baseBody.length > MAX_PARTS)
    {
        times = Math.floor (MAX_PARTS / baseBody.length);
    }
    else if (times == 0)
    {
        return [];
    }
    
    // Construct a finalBody out of 'times' baseBodys, which is the biggest body affordable for the maxEnergy
    var finalBody = [];
    for (var i = 0; i < times; i++) 
    {
        finalBody = finalBody.concat (baseBody);
    }
    
    console.log ('baseBody cost: ' + calculateCost(baseBody));
    console.log ('maximum energy: '+ maxEnergy);
    console.log (finalBody);
    return finalBody;
}

/** 
 * Makes Spawn 'spawn' perform spawner behaviour
 */
module.exports = function (spawn) 
{
    var allCreeps = spawn.room.find(FIND_MY_CREEPS);
    
    // Make a dictionary 'roleCreeps' <string, Creep Array>
    // with roles as hash codes
    var roleCreeps = {};
    for (var i in allCreeps) 
    {
        var thisCreep = allCreeps[i];
        
        if (!roleCreeps[thisCreep.memory.role]) 
        {
            roleCreeps[thisCreep.memory.role] = [];
        }
            
        roleCreeps[thisCreep.memory.role].push(thisCreep);
    }

    // Get total energy usable in Creep creation
    var totalEnergy = spawn.energy;
    
    // Find all extensions
    var extensions = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: function (s) 
        {
            return s.structureType == STRUCTURE_EXTENSION;
        }
    });
    
    for (var i in extensions) 
    {
        totalEnergy += extensions[i].energy;
    }
    
    var baseBodies = require ('baseBodies');
    
    // Max energy a single creep may cost
    var spawningEnergy = totalEnergy;
    
    var harvesterBody = generateBody (baseBodies['harvester'], spawningEnergy);
    var guardBody =     generateBody (baseBodies['guard'],     spawningEnergy);

    spawnCreepEvery  (spawn, 'harvester', Math.round(LIFETIME / 6), 0, harvesterBody);
    checkCreepSupply (spawn, 'harvester', roleCreeps,               1, harvesterBody);

    spawnCreepEvery (spawn, 'upgrader', LIFETIME / 2, 100, generateBody (baseBodies['upgrader'], spawningEnergy));
    spawnCreepEvery (spawn, 'builder',  LIFETIME / 2, 200, generateBody (baseBodies['builder'],  spawningEnergy));
    
    // Make number of guards and number of enemies in the room match
    var targets = spawn.room.find (FIND_HOSTILE_CREEPS);
    var min = targets.length < 1 ? 1 : targets.length;
    checkCreepSupply (spawn, 'guard', roleCreeps, min, guardBody);

    // Find all storages in the room
    var storages = spawn.room.find(FIND_MY_STRUCTURES, {
        filter: function (s) 
        {
            return s.structureType == STRUCTURE_STORAGE;
        }
    });
    
    // If there are storages in the room, schedule creation of tankers
    if (storages.length >= 1) 
    {
        var tankerBody = generateBody (baseBodies['tanker'], spawningEnergy);
        checkCreepSupply (spawn, 'tanker', roleCreeps,   1,   tankerBody);
        spawnCreepEvery  (spawn, 'tanker', LIFETIME / 2, 400, tankerBody);
    }

    spawnFromQueue (spawn);
}