const connection = require('../connection/conection');

const serviceDef = {
  getLastFlatLogEntry
}

function getLastFlatLogEntry(){

  return new Promise((resolve, reject) => {

  console.log('getLastFlatLogEntry called ...');
  const sql = `select date_updated as last_update, table_name ,TIMESTAMPDIFF(MINUTE,date_updated,NOW()) as duration_since_last_sync from etl.flat_log where table_name like '%flat_hiv_summary%' order by date_created desc limit 1;`;
  console.log("sql", sql);
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