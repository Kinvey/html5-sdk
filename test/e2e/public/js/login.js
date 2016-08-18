$('#loginForm').on('submit', function(event) {
  // Prevent the form submission
  event.preventDefault();

  // Get username and password
  var username = $('#username').val();
  var password = $('#password').val();

  // Login with Kinvey
  Kinvey.User.login(username, password).then(function(user) {
    $('body').append('<div id="notify" style="display: none;"></div>');
  }).catch(function(error) {
    $('body').append('<div id="notify" style="display: none;"></div>');
  });
});
