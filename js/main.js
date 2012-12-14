/*globals I, Spinner, Path */

(function() {

  // ----------
  window.I = {
    Pages: {},
    server: {},
    currentView: null,
    spinner: null,
    mode: '',
    
    // ----------
    init: function() {
      var self = this;
      
      this.$user = $('.user');
      if (!this.loggedIn()) {
        $('<a href="#">Sign In</a>')
          .click(function(event) {
            event.preventDefault();
            self.logIn();
          })
          .appendTo(this.$user);
      } else {
        this.showLoggedIn();
      }
      
      this.$newIssue = $('.new-issue')
        .click(function(event) {
          event.preventDefault();
          self.go('NewIssue');
        });
      
      this.go('Home');
      
      Path.map('/issue/:id').to(function() {
        self.go('Issue', this.params);
      });
      
      Path.history.listen();
      Path.dispatch(document.location.pathname);
    },
    
    // ----------
    go: function(mode, config) {
      config = config || {};
      
      var $div = $("<div>")
        .addClass(mode)
        .append(this.template(mode + '-page'));
        
      $(".main-content")
        .empty()
        .append($div);
        
      this.mode = mode;
      if (this.mode in this.Pages) {
        config.$el = $div;
        this.currentView = new this.Pages[this.mode](config);
      }
    },
    
    // ----------
    spin: function(value) {
      if (value) {
        this.spinner = new Spinner().spin($("body")[0]);     
      } else {
        this.spinner.stop();
      }
    },
    
    // ----------
    template: function(name, config) {
      var rawTemplate = $("#" + name + "-template").text();
      var template = _.template(rawTemplate);
      var html = template(config);
      return $(html);
    },

    // ----------
    loggedIn: function() {
      return !!this.server.data.username;
    },
    
    // ----------
    logIn: function(config) {
      var self = this;
      var $login = $('.login').show();
      
      if (config.prompt) {
        $login.find('.prompt').text(config.prompt);
      }
      
      var twitterUrl = "";
      $.ajax({
        url: "/api/get-twitter-url", 
        success: function(data) {
          twitterUrl = data.url;
        }, 
        error: function() {
        }
      });
    
      this.$twitter = $(".twitter")
        .click(function() {
          window.open(twitterUrl, "_blank", "width=700,height=500");
          var interval = setInterval(function() {
            if (I.server.data.username) {
              clearInterval(interval);
              self.showLoggedIn();
              $login.hide();
              if (config.callback) {
                config.callback();
              }
            }
          }, 500);
        });
    },
    
    // ----------
    showLoggedIn: function() {
      this.$user
        .text(I.server.data.username + ' ');

      $('<a href="#">Sign Out</a>')
        .click(function(event) {
          event.preventDefault();
          location.href = 'logout';
        })
        .appendTo(this.$user);
    }
  };
  
  // ----------
  $(document).ready(function() {
    I.init();
  });
  
})();