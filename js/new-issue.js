/*globals I */

(function() {

  // ----------
  I.Views.NewIssue = function() {
    var self = this;
    
    this.$description = $('.description');
    this.$title = $('.title');
    
    $('.submit')
      .click(function() {
        if (I.loggedIn()) {
          self.submit();
        } else {
          I.logIn({
            prompt: 'You need to sign in first.',
            callback: function() {
              self.submit();
            }
          });
        }
      });
  };
  
  I.Views.NewIssue.prototype = {
    // ----------
    submit: function() {
      I.spin(true);
      $.ajax({
        url: '/api/new-issue',
        type: 'POST',
        data: {
          description: this.$description.val(),
          title: this.$title.val()
        },
        success: function(data) {
          I.spin(false);
          I.go('Home');
        },
        error: function() {
          I.spin(false);
          alert('Failure!');
        } 
      });
    }
  };
  
})();