'use strict';
const messageService = require('./service/message-service');
const flatLogMonitorService = require('./service/flat-log-monitor-service');

function postLogMessage(message){
  console.log('Posting Log Message...');
  messageService.postSlackChannelMessage(message)
  .then((result) => {
     console.log(result);
     console.log('Posting successfull...');
  }).catch((error) => {
     console.error(error);
     console.log('Posting failed ...');
  });

}

function monitorFlatLog(){
   console.log('Monitor Flat Log ......');
   // checkFlatLog();
   setInterval(()=> {
      checkFlatLog();
   },60000);
   
}

function checkFlatLog(){
   console.log('Checking Flat Log ......');
   flatLogMonitorService.checkFlatLog()
         .then((result)=> {
            console.log('SUCCESS : Flat Log ...', result);
         })
         .catch((error)=> {
            console.error('ERROR: checkFlatLog', error);
   });

}

//postLogMessage("Test Message");
monitorFlatLog();