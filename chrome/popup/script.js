document.addEventListener("DOMContentLoaded", function() {
  var checker = document.getElementById("jabber-checker");
  new Checker(checker);
});

(function() {

  function Checker(root) {
    this.root = root;

    this.root.innerHTML = this.template;
    this.input = this.root.getElementsByClassName("check-field")[0];

    Object.defineProperty(this, 'value', {
      get: function() {
        return this.input.value;
      },
      set: function(value) {
        this.input.value = value;
      }
    });

    this.input.addEventListener("keyup", this.validate.bind(this));
    this.input.addEventListener("click", this.validate.bind(this));
  }

  Checker.prototype.template = "<input type='text' class='check-field' />";

  Checker.prototype.regexp = /^[a-zA-Z\-_+]+([\.-]?[a-zA-Z\-_+]+)*@[a-zA-Z\-_+]+([\.-]?[a-zA-Z\-_+]+)*(\.[a-zA-Z]{2,6})+$/;


  Checker.prototype.validate = function() {
    if (this.value) {
      this.check() ?
        this.makeSuccess() :
        this.makeFail();
    } else {
      this.makeEmpty();
    }
  };


  Checker.prototype.check = function() {
    return this.regexp.test(this.value);
  };


  Checker.prototype.makeSuccess = function() {
    this.input.classList.remove("fail");
    this.input.classList.add("success");
  };

  Checker.prototype.makeFail = function() {
    this.input.classList.add("fail");
    this.input.classList.remove("success");
  };

  Checker.prototype.makeEmpty = function() {
    this.input.classList.remove("fail");
    this.input.classList.remove("success");
  };

  this.Checker = Checker;

}).call(window)