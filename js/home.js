/*globals I */

(function() {

  // ----------
  I.Views.Home = function() {
    $.ajax({
      url: '/api/issues',
      success: function(data) {
        var $list = I.template('issue-list', data);
        $('.issues').append($list);
      }
    });
  };
  
  I.Views.Home.prototype = {
  };
  
})();