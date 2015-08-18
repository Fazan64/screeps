module.exports = 
{
    "harvester" : 
    {
        body : [WORK, CARRY, MOVE],
        behaviour : function (creep)
        {
            if(creep.carry.energy < creep.carryCapacity) 
            {
            	var sources = creep.room.find(FIND_SOURCES);
            	creep.moveTo(sources[0]);
            	creep.harvest(sources[0]);
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
        body : [ATTACK, ATTACK, TOUGH, MOVE],
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
        body : [RANGED_ATTACK, RANGED_ATTACK, ATTACK, TOUGH, MOVE],
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
        body : [WORK, WORK, CARRY, MOVE],
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
        body : [WORK, WORK, CARRY, MOVE],
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
        body : [HEAL, MOVE],
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