/*globals mob */

(function() {

  // ----------
  var component = mob.Pages.Home = function() {
    mob.request({
      method: 'issues',
      success: function(data) {
        var open = {
          issues: _.where(data.issues, {
            status: mob.STATUS_OPEN
          })
        };
        
        var closed = {
          issues: _.where(data.issues, {
            status: mob.STATUS_CLOSED
          })
        };
        
        $('.open-issues').append(mob.template('issue-list', open));
        $('.closed-issues').append(mob.template('issue-list', closed));
      }
    });
  };
  
  component.prototype = {
  };
  
})();