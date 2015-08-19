var roles = require("roles");

for (var name in Game.creeps) 
{
    var creep = Game.creeps[name];
    var role = creep.memory.role;
    var body = [WORK,CARRY,MOVE];
    var behaviour = function(doomed){doomed.suicide()};
    
    if (role && roles[role]) 
    {
        body = roles[role].body;
        behaviour = roles[role].behaviour;
    } 
    else
    {
        if (!creep.memory.badRole)
        {
            console.log("Invalid role found: " + role + "    Creep: " + name);
            creep.memory.badRole = true;
        }
    }

    if (!creep.memory.oldCreep) 
    {
        console.log (name + ": " + role);
        if (behaviour) 
        {
            console.log("   behaviour: handler found");
        }
        creep.memory.oldCreep = true;
    }
    
    behaviour(creep);
}

var spawner = require ('spawner');

for (var name in Game.spawns) 
{
    spawner (Game.spawns[name]);
}