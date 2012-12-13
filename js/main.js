/*globals I */

(function() {

  // ----------
  window.I = {
    server: {},
    
    // ----------
    init: function() {
      var self = this;
      
      this.$description = $('.description');
      this.$title = $('.title');
      
      this.$user = $('.user');
      if (!I.server.data.username) {
        $('<a href="#">Sign In</a>')
          .click(function(event) {
            event.preventDefault();
            self.logIn();
          })
          .appendTo(this.$user);
      } else {
        this.showLoggedIn();
      }
        
      $('.submit')
        .click(function() {
          if (I.server.data.username) {
            self.submit();
          } else {
            self.logIn({
              prompt: 'You need to sign in first.',
              callback: function() {
                self.submit();
              }
            });
          }
        });
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
    submit: function() {
      $.ajax({
        url: '/api/new-issue',
        type: 'POST',
        data: {
          description: this.$description.val(),
          title: this.$title.val()
        },
        success: function(data) {
          alert('Success!');
        },
        error: function() {
          alert('Failure!');
        } 
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