module.exports = 
{
    "harvester" : 
    {
        behaviour : require ('harvester')
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