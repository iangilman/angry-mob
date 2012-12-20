/*globals mob */

(function() {

  // ----------
  var component = mob.Pages.Issue = function(config) {
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
      
      var $issue = mob.template('issue', data);
      this.$el.append($issue);
      
      this.$el.find('button.comment')
        .click(function() {
          if (mob.loggedIn()) {
            self.submitComment();
          } else {
            mob.logIn({
              prompt: 'You need to sign in first.',
              callback: function() {
                self.submitComment();
              }
            });
          }
        });
        
      mob.request({
        method: 'get-issue-comments',
        content: {
          id: this.id
        },
        success: function(data) {
          self.renderComments(data);
        }
      });
    },

    // ----------
    renderComments: function(data) {
      this.$el.find('.comments')
        .append(mob.template('comment-list', data));
    },
    
    // ----------
    submitComment: function() {
      var self = this;
      
      var $comment = this.$el.find('textarea.comment');
      var body = $.trim($comment.val());
      if (!body) {
        alert('Can\'t post blank comment');
        return;
      }
      
      mob.request({
        method: 'create-comment',
        spin: true,
        content: {
          comment: body,
          issue_id: self.id
        },
        success: function(data) {
          $comment.val('');
          
          self.renderComments({
            comments: [
              data.comment
            ]
          });
        }
      });
    }
  };
  
})();