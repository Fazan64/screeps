/** Contains the base parts needed for these Creeps to minimally fulfil their roles.
 * Use generateBody in 'spawner' module to get the finalBody configuration.
 * To get base body configurations use role names as hash keys (baseBodies ["harvester"])
 */
module.exports = 
{
	"harvester" :   [WORK, CARRY],
    
    "guard" :       [ATTACK, TOUGH],
    
    "shooter" :     [RANGED_ATTACK, TOUGH],
    
    "upgrader" :    [WORK, CARRY],
    
    "builder" :     [WORK, CARRY],
    
    "healer" :      [HEAL, TOUGH],
    
    "tanker" :      [CARRY, CARRY]
}