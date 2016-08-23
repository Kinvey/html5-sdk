$('#loginForm').on('submit', function(event) {
  // Prevent the form submission
  event.preventDefault();

  // Get username and password
  var username = $('#username').val();
  var password = $('#password').val();

  // Login with Kinvey
  Kinvey.User.login(username, password);
});

$('#loginWithMICForm').on('submit', function(event) {
  // Prevent the form submission
  event.preventDefault();

  // Login with MIC
  Kinvey.User.loginWithMIC('http://localhost:3000');
});
