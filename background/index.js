// http://stackoverflow.com/questions/29946401/why-is-this-chrome-browseraction-seticon-method-not-working
function createSetIconAction(path, callback) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.onload = function() {
    ctx.drawImage(image,0,0,19,19);
    var imageData = ctx.getImageData(0,0,19,19);
    var action = new chrome.declarativeContent.SetIcon({imageData: imageData});
    callback(action);
  }
  image.src = chrome.runtime.getURL(path);
}

function loadConditions(callback) {
  chrome.storage.sync.get("whitelist", function(list) {
    var conditions = [];
    list.whitelist.forEach(function(item) {
      var condition = new chrome.declarativeContent.PageStateMatcher({
        pageUrl: { urlContains: item.URL }
      });
      conditions.push(condition);
    });
    callback(conditions);
  });
}

function updateRules() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    loadConditions(function(conditions) {
      createSetIconAction("icons/true/wlist_true.png", function(setIconAction) {
        chrome.declarativeContent.onPageChanged.addRules([
          {
            conditions: conditions,
            actions: [ setIconAction ]
          }
        ]);
      });
    })
  });
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.greeting == "whitelist.uploaded") {
    updateRules();
  }
});

chrome.runtime.onInstalled.addListener(function() {
  updateRules();
});