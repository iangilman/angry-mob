/*globals I */

(function() {

  // ----------
  var component = I.Pages.Home = function() {
    $.ajax({
      url: '/api/issues',
      success: function(data) {
        var $list = I.template('issue-list', data);
        $('.issues').append($list);
      }
    });
  };
  
  component.prototype = {
  };
  
})();