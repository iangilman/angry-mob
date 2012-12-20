/*globals mob */

(function() {

  // ----------
  var component = mob.Pages.Issue = function(config) {
    var self = this;
    this.$el = config.$el;
    
    mob.request({
      method: 'get-issue',
      content: {
        id: config.id
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
      
      var $issue = mob.template('issue', data);
      this.$el.append($issue);
      this.$el.find('button.comment')
        .click(function() {
          mob.request({
            method: 'create-comment',
            spin: true,
            content: {
              comment: self.$el.find('textarea.comment').val()
            },
            success: function() {
            }
          });
        });
    }
  };
  
})();