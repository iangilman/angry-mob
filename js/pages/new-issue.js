/*globals mob */

(function() {

  // ----------
  var component = mob.Pages.NewIssue = function() {
    var self = this;
    
    this.$description = $('.description');
    this.$title = $('.title');
    
    $('.submit')
      .click(function() {
        if (mob.loggedIn()) {
          self.submit();
        } else {
          mob.logIn({
            prompt: 'You need to sign in first.',
            callback: function() {
              self.submit();
            }
          });
        }
      });
  };
  
  component.prototype = {
    // ----------
    submit: function() {
      mob.spin(true);
      $.ajax({
        url: '/api/new-issue',
        type: 'POST',
        data: {
          description: this.$description.val(),
          title: this.$title.val()
        },
        success: function(data) {
          mob.spin(false);
          mob.navigate('/');
        },
        error: function() {
          mob.spin(false);
          alert('Failure!');
        } 
      });
    }
  };
  
})();