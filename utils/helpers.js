function filterMsgData(msgData) {
  let msgObjAry = [];

  JSON.parse(msgData).forEach((msg) => {
    let msgObj = {};

    msgObj.message = msg.message;
    msgObj.timeOfMsg = msg.timeOfMessage;
    msgObj.userId = msg.userId;
    msgObj.room = msg.room;
    msgObj.userName = msg.user.username;

    msgObjAry.push(msgObj);
  });
  return msgObjAry;
}

module.exports = { filterMsgData };
