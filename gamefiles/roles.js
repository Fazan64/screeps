var MAX_HARVESTERS_PER_SOURCE = 3;

/**
 * Finds a source which is operated by less than maximum harvesters.
 * If there isn't such, returns the one with least operating harvesters
 */
function findUnoccupiedSource (sources)
{
    if (!Memory.sources)
    {
        Memory.sources = [];
    }
    
    var leastCrowdedSource = null;
    var minOccupants = 9999;
    for (var source in sources)
    {
        // Memory.sources [source.id] holds a number of harvesters
        // operating the source with such id
        if (!Memory.sources [source.id])
        {
            Memory.sources [source.id] = 0;
            return source;
        }
        if (Memory.sources [source.id] < MAX_HARVESTERS_PER_SOURCE) 
        {
            return source;
        }
        if (Memory.sources [source.id] < minOccupants) 
        {
            minOccupants = Memory.sources [source.id];
            leastCrowdedSource = source;
        }
    }
    
    // All sources occupied, return the least crowded
    return leastCrowdedSource;
}

module.exports = 
{
    "harvester" : 
    {
        behaviour : function (creep)
        {
            if(creep.carry.energy < creep.carryCapacity) 
            {
            	var sources = creep.room.find(FIND_SOURCES);
                if (sources.length)
                {
                    var targetSource = findUnoccupiedSource (sources);
                    if (targetSource)
                    {
                        // Say that this creep will operate this source
                        Memory.sources [targetSource.id]++;
                        creep.moveTo  (targetSource);
                        creep.harvest (targetSource);
                    }
                    
                }
            }
            else 
            {
            	creep.moveTo(Game.spawns.Spawn1);
            	creep.transferEnergy(Game.spawns.Spawn1)
            }
        }
    },
    
    "guard" : 
    {
        behaviour : function (creep)
        {
            var targets = creep.room.find(FIND_HOSTILE_CREEPS).filter (function (creep) { return creep.owner.username != "Source Keeper" });
        	if(targets.length >= 1)
        	{
        		creep.moveTo(targets[0]);
        		creep.attack(targets[0]);
        	}
        }
    },
    
    "shooter" : 
    {
        behaviour : function (creep)
        {
            var targets = creep.room.find(FIND_HOSTILE_CREEPS).filter (function (creep) { return creep.owner.username != "Source Keeper" });
        	if(targets.length >= 1)
        	{
        	    
        	    if (creep.pos.getRangeTo (targets[0].pos) > 3)
        	    {
        	       creep.moveTo(targets[0]); 
        	    }
        		
        		creep.rangedAttack(targets[0]);
        		
        	}
        }
    },
    
    "upgrader" : 
    {
        behaviour : function (creep)
        {
            if(creep.carry.energy < creep.carryCapacity) 
            {
                var spawn = Game.spawns.Spawn1
            	creep.moveTo (spawn)
                spawn.transferEnergy (creep);
            }
            else 
            {
                var controller = creep.room.controller;
            	creep.moveTo(controller);
            	creep.upgradeController(controller)
            }
        }
    },
    
    "builder" : 
    {
        behaviour : function (creep)
        {
            var spawn =  Game.spawns.Spawn1
            if (creep.carry.energy == 0)
            {
                creep.moveTo (spawn)
                spawn.transferEnergy (creep)
            }
            else
            {
                var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        		if(targets.length) 
        		{
        			creep.moveTo(targets[0]);
        		    creep.build(targets[0]);
        		}
            } 
        }
    },
    
    "healer" : 
    {
        behaviour : function (creep)
        {
            // Creeps with health less then maximum
            var targets = creep.room.find(FIND_MY_CREEPS).filter (function (creep) {return creep.hitsMax > creep.hits});
        	if(targets.length >= 1)
        	{
        		creep.moveTo(targets[0]);
        		creep.heal(targets[0]);
        	}
        }
    }
}