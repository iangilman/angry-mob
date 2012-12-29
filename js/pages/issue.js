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

    mob.subscribe(this, 'loggedIn', _.bind(this._updateButtons, this));
  };
  
  component.prototype = {
    // ----------
    render: function(data) {
      var self = this;
      
      this.creatorId = data.creator.id;
      this.status = data.status;
      
      var statusText = {};
      statusText[mob.STATUS_OPEN] = 'Open';
      statusText[mob.STATUS_CLOSED] = 'Closed';

      data.status_text = statusText[data.status] || 'Unknown';
      var $issue = mob.template('issue', data);
      this.$el.html($issue);
      
      this.$edit = this.$el.find('.edit')
        .click(function() {
          mob.navigate('/issue/' + self.id + '/edit');
        });

      this.$close = this.$el.find('.close')
        .click(function() {
          self.changeStatus(mob.STATUS_CLOSED);
        });
        
      this.$reopen = this.$el.find('.reopen')
        .click(function() {
          self.changeStatus(mob.STATUS_OPEN);
        });
        
      this._updateButtons();
      
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
          issue_id: this.id
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
        mob.error('Can\'t post blank comment');
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
    },

    // ----------
    changeStatus: function(status) {
      var self = this;
      
      mob.request({
        method: 'update-issue',
        spin: true,
        content: {
          id: this.id,
          status: status
        },
        success: function(data) {
          self.render(data.issue);
        } 
      });
    },

    // ----------
    _updateButtons: function() {
      if (!this.$edit) {
        return;
      }
      
      var isCreator = (this.creatorId == mob.server.data.user_id);
      this.$edit.toggle(isCreator);
      this.$close.toggle(isCreator && this.status == mob.STATUS_OPEN);
      this.$reopen.toggle(isCreator && this.status == mob.STATUS_CLOSED);
    }
  };
  
})();