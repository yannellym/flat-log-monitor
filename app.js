'use strict';
const flatLogMonitorService = require('./service/flat-log-monitor-service');
const eidQueueMonitorService = require('./service/eid-queue-service');

const checkLogInterval = 3600000;

function monitorFlatLog(){
   console.log('Monitor Flat Log ......');
   checkFlatLog();
   setInterval(()=> {
      checkFlatLog();
   },checkLogInterval);
   
}

function monitorEidQueue(){

   console.log('Monitor EID qeueue ......');
   checkEidQueue();
   setInterval(()=> {
      checkEidQueue()
   },checkLogInterval);

}
function checkFlatLog(){
   console.log('Checking Flat Log ......');
   flatLogMonitorService.flatLogMassCheck().then((result)=>{
      console.log(`checkFlatLog success result`, result);
   }).catch((error)=>{
      console.error(`checkFlatLog error`, error);
   });;

}
function checkEidQueue(){
   eidQueueMonitorService.checkEidLabQueues()
   .then((result)=>{
      console.log(`checkEidQueue success result`, result);
   }).catch((error)=>{
      console.error(`checkEidQueue error`, error);
   });
}


monitorFlatLog();
monitorEidQueue();
