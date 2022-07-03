if ($("#direct-msg-list li").length < 1) {
  let noDmsMsg = $("<p class='m-0 text-center'>😭 DM's are empty 😭</p>");
  $("#direct-msg-list").append(noDmsMsg);
}
