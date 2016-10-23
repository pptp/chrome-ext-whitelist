// http://stackoverflow.com/questions/29946401/why-is-this-chrome-browseraction-seticon-method-not-working
function createSetIconAction(tabId, path, callback) {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var image = new Image();
  image.onload = function() {
    ctx.drawImage(image,0,0,19,19);
    var imageData = ctx.getImageData(0,0,19,19);
    // var action = new chrome.declarativeContent.SetIcon({imageData: imageData});
    var action = chrome.pageAction.setIcon({
      tabId: tabId,
      imageData: imageData
    });
    callback(action);
  }
  image.src = chrome.runtime.getURL(path);
}

function loadConditions(callback) {
  chrome.storage.local.get("whitelist", function(list) {
    var conditions = [];
    if (list.whitelist) {
      list.whitelist.forEach(function(item) {
        // var condition = new chrome.declarativeContent.PageStateMatcher({
        //   pageUrl: { urlContains: item.URL }
        // });
        var condition = item.URL;
        conditions.push(condition);
      });
    }

    callback(function(url) {
      for (var i in conditions) {
        if (url.indexOf(conditions[i]) != -1) {
          return true;
        } 
      }
    });
  });
}

function updateRules(tabId, tab) {
  loadConditions(function(checkUrl) {
    if (checkUrl(tab.url)) {
      createSetIconAction(tabId, "icons/true/wlist_true.png", function(setIconAction) {
        setIconAction();
      });
    }
  });
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  chrome.pageAction.show(tabId);
  if (changeInfo.status === 'complete') {
    updateRules(tabId, tab);
  }
})



  /*
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
  */




// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   if (request.greeting == "whitelist.uploaded") {
//     updateRules();
//   }
// });

// chrome.runtime.onInstalled.addListener(function() {
//   updateRules();
// });

/*

  "browser_action": {
    "default_title": "Check Jabber",
    "default_icon": {
      "16": "icons/false/wlist_false_16.png",
      "48": "icons/false/wlist_false_48.png",
      "128": "icons/false/wlist_false_128.png"
    },
    "default_popup": "popup/index.html"
  },
*/