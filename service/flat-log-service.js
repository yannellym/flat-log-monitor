const connection = require('../connection/conection');

const serviceDef = {
  getFlatLogEntry
}

function getFlatLogEntry(summaryTable,delayGracePeriod){
  const sql = `select date_updated as last_update, table_name , IF(TIMESTAMPDIFF(MINUTE,date_updated,NOW()) > ${delayGracePeriod},1,0) AS 'sync_delayed',TIMESTAMPDIFF(MINUTE,date_updated,NOW()) as duration_since_last_sync from etl.flat_log where table_name like '%${summaryTable}%'  order by date_created desc limit 1;`;
  return runSql(sql)
}

function runSql(sql){
  return new Promise((resolve, reject) => {
  console.log('sql ...', sql);
  connection
    .getConnectionPool()
    .then((pool) => {
      pool.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Error", error);
          reject(error);
        } else {
          console.log("getLastFlatLogEntry successfull ", results);
          resolve(results);
        }
      });
    })
    .catch((error) => {
      reject(error);
    });

  });

}

module.exports = serviceDef;