/*globals mob */

(function() {

  // ----------
  var component = mob.Pages.Home = function() {
    $.ajax({
      url: '/api/issues',
      success: function(data) {
        var $list = mob.template('issue-list', data);
        $('.issues').append($list);
      }
    });
  };
  
  component.prototype = {
  };
  
})();