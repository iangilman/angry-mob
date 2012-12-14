/*globals mob */

(function() {

  // ----------
  var component = mob.Pages.Issue = function(config) {
    var self = this;
    this.$el = config.$el;
    
    $.ajax({
      url: '/api/get-issue',
      data: {
        id: config.id
      },
      success: function(data) {
        var $issue = mob.template('issue', data.issue);
        self.$el.append($issue);
      }
    });
  };
  
  component.prototype = {
  };
  
})();