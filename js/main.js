/*globals mob, Spinner, Path, Modernizr */

(function() {

  // ----------
  window.mob = {
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
      
      $(document).on("click", "a", function(event) {
        if (Modernizr.history) {
          event.preventDefault();
          Path.history.pushState({}, '', $(this).attr('href'));
        }
      });
      
      var routes = {
        Home: '',
        NewIssue: '/new-issue',
        Issue: '/issue/:id'
      };
      
      _.each(routes, function(v, k) {
        Path.map(v + '(/)').to(function() {
          self.go(k, this.params);
        });
      });
      
      Path.history.listen();
      Path.dispatch(document.location.pathname);
    },
    
    navigate: function(path) {
      if (Modernizr.history) {
        Path.history.pushState({}, '', path);
      } else {
        location.href = path;
      }
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

      config = config || {};
      var $login = $('.login').show();
      
      if (config.prompt) {
        $login.find('.prompt')
          .text(config.prompt)
          .show();
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
            if (mob.server.data.username) {
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
        .text(mob.server.data.username);

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
    mob.init();
  });
  
})();