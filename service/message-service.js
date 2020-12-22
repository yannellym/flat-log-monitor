'use strict';
const slackApiService = require('./slack-api-service');

const serviceDef = {
  postSlackChannelMessage
}

function postSlackChannelMessage(message){

  return new Promise((resolve, reject) => {

    const payload = {
      "text": message
    };

    slackApiService.postChannelMesssage(payload)
    .then((result) => {
        console.log(result);
        resolve(result);
    }).catch((error) => {
       reject(error);
    });

  });

}


module.exports = serviceDef;

