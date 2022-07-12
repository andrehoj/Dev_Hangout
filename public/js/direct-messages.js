if (document.location.pathname.includes("/directmessages")) {
  console.log("link");
  $("#chat-form").submit(async function (e) {
    e.preventDefault();

    let message = $("#chat-input").val().trim();
    let reciever = document.location.pathname.split("/")[2];

    if (message) {
      let session = await getCurrentSession();
      let recieverData = await getRecieverUsername(reciever);
      let res = await saveDm(message, recieverData, session);
    } else {
      //error message if something goes wrong
    }
  });
}
