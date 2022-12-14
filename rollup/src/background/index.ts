console.log('background script')

var popup = chrome.extension.getViews({ type: "popup" })[0]

chrome.webRequest.onCompleted.addListener(
  function (details) {
    if (details.url == 'https://wedata.weixin.qq.com/mp2/cgi/reportdevlog/GetWxaJsErrInfoSummary') {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id!, {
          type: 2,
          message: 'GetWxaJsErrInfoSummary接口调用完成'
        }, function (response) {
        });
      });
    }
  },
  { urls: ['https://*/*', 'http://*/*'] },
);
