const flatLogService = require('../service/flat-log-service');
const messageService = require('../service/message-service');

const serviceDef = {
  checkFlatLog
}

function checkFlatLog(){
  return new Promise((resolve,reject)=> {

     flatLogService.getLastFlatLogEntry()
     .then((result)=> {

        const durationSinceLastSync = result[0].duration_since_last_sync;
        const lastSyncTable = result[0].table_name;
        const lastUpdateTime = result[0].last_update;

        const logDelayed = hasLogDelay(durationSinceLastSync);
        const payload = {
          message: `Log Delay Warning: Last sync table ${lastSyncTable} at ${lastUpdateTime}. Lag : ${durationSinceLastSync}`
        }
        if(logDelayed){
           postLogDelayMessage(payload)
           .then((result)=> {
              resolve(result);
           })
           .catch((error)=> {
              reject(error);
           });
        }else{
           resolve('No delay, system up to date');
        }
          
     })
     .catch((error) => {
       console.error('Failed to get last log entry', error);
       reject(error);
     })

  });
}

function hasLogDelay(durationSinceLastSync){
  if(durationSinceLastSync > 30){
       return true;
  }else{
       return false;
  }
  
}

function postLogDelayMessage(payload){
   const message = payload.message;
   return new Promise((resolve,reject)=> {
   messageService.postSlackChannelMessage(message)
   .then((result)=> {
       resolve(true);
   })
   .catch((error)=> {
      console.log('Post slack channel message error', error);
      reject(error);
   });

  });

}

module.exports = serviceDef;