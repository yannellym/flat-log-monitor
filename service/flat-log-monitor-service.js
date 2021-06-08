const flatLogService = require('../service/flat-log-service');
const messageService = require('../service/message-service');
const NIGHTDELAYINMIN = 1440;
const DAYDELAYINNMIN = 30;

const serviceDef = {
  flatLogMassCheck
}

function checkFlatLog(summaryTable,delayGracePeriod){
return new Promise((resolve,reject)=> {

      flatLogService.getFlatLogEntry(summaryTable,delayGracePeriod)
      .then((result)=> {
         postSingleDelayMessage(result).then((result) => {
            resolve(result);
         });
      }).catch((error) => {
          reject(error);
      });

});
   
  
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

function postSingleDelayMessage(result){

   return new Promise((resolve,reject)=> {

   if(result.length > 0){

      const durationSinceLastSync = result[0].duration_since_last_sync;
      const lastSyncTable = result[0].table_name;
      const lastUpdateTime = result[0].last_update;
      const sync_delayed = result[0].sync_delayed;

      if(sync_delayed === 1){

      const payload = {
        message: `Log Delay Warning: Last sync table ${lastSyncTable} at ${lastUpdateTime}. Lag : ${durationSinceLastSync}`
      };
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
   }else{
      resolve('No delay, system up to date');
   }

   });

}

async function flatLogMassCheck(){
   const hivSummaryCheck = await checkFlatLog('flat_hiv_summary',DAYDELAYINNMIN);
   console.log('hivSummaryCheck .... Done');
   const surgeSummaryCheck = await checkFlatLog('surge_weekly_report_dataset',NIGHTDELAYINMIN);
   console.log('surgeSummaryCheck .... Done');
   const pepSummaryCheck = await checkFlatLog('flat_pep_summary',NIGHTDELAYINMIN);
   console.log('pepSummaryCheck .... Done');
   const hivMonthlySummary = await checkFlatLog('hiv_monthly_report_dataset',NIGHTDELAYINMIN);
   console.log('hivMonthlySummary .... Done');
   console.log('All checks done .... Done');

}

module.exports = serviceDef;