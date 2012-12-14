/*globals I */

(function() {

  // ----------
  var component = I.Pages.Issue = function(config) {
    var self = this;
    this.$el = config.$el;
    
    $.ajax({
      url: '/api/get-issue',
      data: {
        id: config.id
      },
      success: function(data) {
        var $issue = I.template('issue', data.issue);
        self.$el.append($issue);
      }
    });
  };
  
  component.prototype = {
  };
  
})();