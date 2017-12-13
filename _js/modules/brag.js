let bragMsg = 'Coded with 💖 by Urs Grupp - https://www.21sieben.de ';
if (typeof InstallTrigger !== 'undefined' || (!!window.chrome && !!window.chrome.webstore)) {
  let bragMsgFormatted = ['%c ' + bragMsg, 'display:block; padding:5px; background: #303e43; line-height:40px; color:#fff;'];
  window.console.log.apply(console, bragMsgFormatted);
} else {
  window.console.log(bragMsg);
}
