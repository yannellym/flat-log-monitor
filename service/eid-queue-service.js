'use strict'
const connection = require('../connection/conection');
const messageService = require('../service/message-service');
const momemt = require('moment');

function getAlupeEidQueueCount(){
  const queueTable = 'eid_sync_queue_alupe';
   return processEidQueueCount(queueTable);
}

function getAmpathEidQueueCount(){
  const queueTable = 'eid_sync_queue';
   return processEidQueueCount(queueTable);
}

async function processEidQueueCount(table){
  try{
    const queueCountResult = await getEidQueueCount(table);
    console.log(`queueCountResult`, queueCountResult);
    if(queueCountResult.length){
      const count = queueCountResult[0].eid_patient_queue;
      await evaluateQueueCount(count,table);
    }

  }catch(e){

     return Promise.reject(e);
  }
 
}

function checkEidLabQueues(){
    return Promise.allSettled([getAmpathEidQueueCount(),getAlupeEidQueueCount()]);
}


function getEidQueueCount(table){

   const sql = `SELECT 
   COUNT(*) AS 'eid_patient_queue'
        FROM
   etl.${table};`;

   console.log(`getEidQueueCount sql `, sql);

   return new Promise((resolve, reject)=>{

    connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error", error);
          reject(error);
        } else {
          console.log("getEidQueueCount successfull ", results);
          resolve(results);
        }
      });
    })
    .catch((error) => {
      reject(error);
    });
       
   });
}

function evaluateQueueCount(count,queueTable){
     console.log(`evaluateQueueCount ${count} ${queueTable}`);
     const now = momemt().format('YYYY-MM-DD hh:mm:ss');
      const message = `${count} patients in ${queueTable} at ${now}`;
     
      if(count > 0){
         return messageService.postSlackChannelMessage(message)
      }else{
        return Promise.resolve(message);
      }
}

module.exports = { checkEidLabQueues }