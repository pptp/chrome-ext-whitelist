(function() {
  
  var GridManager = {
    list: [],
  
    loadData: function() {
      var self = this;
      var d = $.Deferred();

      chrome.storage.sync.get("whitelist", function(list) {
        d.resolve(list.whitelist);
      });

      return d.promise().then(function(list) {
        self.list = list = list.filter(function(item) {
          return item && item.URL;
        });
        return list;
      });
    },

    save: function() {
      var self = this;
      var d = $.Deferred();
      chrome.storage.sync.set({"whitelist": self.list}, function() {
        d.resolve();
        chrome.runtime.sendMessage({greeting: "whitelist.uploaded"});
      });
      return d.promise();
    }
  };

  var clients = [
    { URL: "google.ru" },
  ];

  $("#whitelist-grid").jsGrid({
    width: "800px",

    autoload: true,

    inserting: true,
    editing: true,
    sorting: true,
    paging: true,

    controller: {
      loadData: GridManager.loadData.bind(GridManager)
    },

    onItemInserted: function(data) {
      return GridManager.save();
    },

    onItemUpdated: function(data) {
      return GridManager.save();
    },

    onItemDeleted: function() {
      return GridManager.save();
    },

    fields: [
      { name: "URL", type: "text", validate: "required", width: "auto" },
      { type: "control", width: 75 }
    ]
  });

}).call(this)