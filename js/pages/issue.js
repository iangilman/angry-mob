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
        var config = data.issue;
        config.display_date = new Date(config.creation_date).toDateString();
        var $issue = mob.template('issue', config);
        self.$el.append($issue);
      }
    });
  };
  
  component.prototype = {
  };
  
})();