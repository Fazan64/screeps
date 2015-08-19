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
    
    for (var i in sources)
    {
        var source = sources [i];
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

module.exports = function (creep)
{
	if(creep.carry.energy < creep.carryCapacity) 
    {
        var sources = creep.room.find(FIND_SOURCES);
        if (sources.length) 
        {
            var targetSource = findUnoccupiedSource(sources);
            if (targetSource) 
            {
                // Say that this creep will operate this source
                Memory.sources[targetSource.id]++;
                creep.moveTo(targetSource);
                creep.harvest(targetSource);
            }

        }
    }
    else 
    {
        creep.moveTo(Game.spawns.Spawn1);
        creep.transferEnergy(Game.spawns.Spawn1);
    }
}