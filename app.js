'use strict';
const flatLogMonitorService = require('./service/flat-log-monitor-service');

function monitorFlatLog(){
   console.log('Monitor Flat Log ......');
   setInterval(()=> {
      checkFlatLog();
   },3600000);
   
}
function checkFlatLog(){
   console.log('Checking Flat Log ......');
   flatLogMonitorService.flatLogMassCheck();

}
checkFlatLog();
monitorFlatLog();