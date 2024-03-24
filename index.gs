// label to check for & to apply to forwarded messages. must exist in the gmail account this is being run on
const APP_FORWARDED_LABEL = "Forwarded";
// comma separated list of email addresses to forward to
const FORWARD_EMAIL_ADDRESSES = "";

function forwardPostMost() {
  // Find the post most
  let threads = GmailApp.getInboxThreads();
  threads.forEach((thread) => {
    let firstMessage = thread.getMessages()[0];
    let labels = thread.getLabels();

    // Check if the thread has already been forwarded
    let shouldSkip = false;
    labels.forEach((label) => {
      if (label.getName() === APP_FORWARDED_LABEL) {
        shouldSkip = true;
        return;
      }
    });

    if (shouldSkip) {
      Logger.log("Skipped already forwarded post most!");
      removeIfNeeded(thread);
      return;
    }

    if (
      firstMessage.getFrom() ===
        "The Washington Post <email@washingtonpost.com>" &&
      firstMessage.getSubject().includes("The Post Most")
    ) {
      firstMessage.forward(FORWARD_EMAIL_ADDRESSES);
      // Label the thread so it isn't forwarded on future days, even if I forget to remove it
      let label = GmailApp.getUserLabelByName(APP_FORWARDED_LABEL);
      thread.addLabel(label);
      Logger.log("Found and forwarded post most for today!");

      removeIfNeeded(thread);
    }
  });
}

// If I've already opened the thread, delete the message
function removeIfNeeded(postMostThread) {
  Logger.log("Checking if thread needs to be removed!");
  if (!postMostThread.isUnread()) {
    Logger.log("Thread has been opened, moving to trash!");
    postMostThread.moveToTrash();
  }
}
