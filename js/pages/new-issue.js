/*globals I */

(function() {

  // ----------
  var component = I.Pages.NewIssue = function() {
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
  
  component.prototype = {
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
          I.navigate('/');
        },
        error: function() {
          I.spin(false);
          alert('Failure!');
        } 
      });
    }
  };
  
})();