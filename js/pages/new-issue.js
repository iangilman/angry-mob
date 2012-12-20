/*globals mob */

(function() {

  // ----------
  var component = mob.Pages.NewIssue = function() {
    var self = this;
    
    this.$description = $('.description');
    this.$title = $('.title');
    
    _.defer(function() {
      self.$title
        .focus();
    });

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
      var title = $.trim(this.$title.val());
      if (!title) {
        alert('You at least need a title');
        return;
      }

      mob.request({
        method: 'new-issue',
        spin: true,
        content: {
          description: this.$description.val(),
          title: title
        },
        success: function(data) {
          mob.navigate('/issue/' + data.id);
        } 
      });
    }
  };
  
})();