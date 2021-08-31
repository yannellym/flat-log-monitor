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
   await checkFlatLog('flat_obs',DAYDELAYINNMIN);
   console.log('flatObsCheck .... Done');
   await checkFlatLog('flat_lab_obs',DAYDELAYINNMIN);
   console.log('flatLabObsCheck .... Done');
   await checkFlatLog('flat_orders',NIGHTDELAYINMIN);
   console.log('flaOrdersCheck .... Done');
   await checkFlatLog('flat_labs_and_imaging',DAYDELAYINNMIN);
   console.log('flatLabsImagingCheck .... Done');
   await checkFlatLog('flat_hiv_summary',DAYDELAYINNMIN);
   console.log('hivSummaryCheck .... Done');
   await checkFlatLog('flat_appointment',DAYDELAYINNMIN);
   console.log('flatAppointmentCheck .... Done');
   await checkFlatLog('flat_vitals',NIGHTDELAYINMIN);
   console.log('flatVitalsCheck .... Done');
   await checkFlatLog('flat_defaulters',NIGHTDELAYINMIN);
   console.log('flatDefaultersCheck .... Done');
   await checkFlatLog('flat_case_manager',NIGHTDELAYINMIN);
   console.log('flatCaseManagerCheck .... Done');
   await checkFlatLog('flat_family_testing',NIGHTDELAYINMIN);
   console.log('flatFamilyTestingCheck  .... Done');
   await checkFlatLog('surge_weekly_report_dataset',NIGHTDELAYINMIN);
   console.log('surgeSummaryCheck .... Done');
   await checkFlatLog('flat_pep_summary',NIGHTDELAYINMIN);
   console.log('pepSummaryCheck .... Done');
   await checkFlatLog('hiv_monthly_report_dataset',NIGHTDELAYINMIN);
   console.log('hivMonthlySummary .... Done');
   await checkFlatLog('flat_prep_summary',NIGHTDELAYINMIN);
   console.log('prepSummaryCheck .... Done');
   await checkFlatLog('flat_covid_screening',NIGHTDELAYINMIN);
   console.log('covidScreeningCheck .... Done');
   await checkFlatLog('flat_cdm',NIGHTDELAYINMIN);
   console.log('covidFlatCdm .... Done');
   console.log('All checks done .... Done');

}

module.exports = serviceDef;