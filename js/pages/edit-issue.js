/*globals mob */

(function() {

  // ----------
  var component = mob.Pages.EditIssue = function(config) {
    var self = this;
    this.$el = config.$el;
    this.id = config.id;
    
    mob.request({
      method: 'get-issue',
      content: {
        id: this.id
      },
      success: function(data) {
        self.render(data.issue);
      }
    });
  };
  
  component.prototype = {
    // ----------
    render: function(data) {
      var self = this;
      
      if (data.creator.id != mob.server.data.user_id) {
        mob.error('Only the creator of this issue can edit it.');
        return;
      }
      
      this.$el.append(mob.template('edit-issue', data));
      
      this.$description = $('.description');
      this.$title = $('.title');
      
      _.defer(function() {
        self.$title
          .focus();
      });
  
      $('.submit')
        .click(function() {
          self.submit();
        });
        
      $('.cancel')
        .click(function() {
          mob.navigate('/issue/' + self.id);
        });
    },
    
    // ----------
    submit: function() {
      var title = $.trim(this.$title.val());
      if (!title) {
        mob.error('You at least need a title');
        return;
      }

      mob.request({
        method: 'update-issue',
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
