$(document).ready(function() {
  //Container
  var $container = $('#container');
  var $navbar = $('#navbar');
  var $home = $('<li>Home</li>');
  $home.click(function() {
    $container.hide();
    $container.append('<h1>Welcome to Game Logger!</h1>');
  });
  var $profile = $('<li>Profile</li>');
  var $users = $('<li>Users</li>');
  var $searchGames = $('<li>Search Games</li>');
  var $login = $('<li>Login</li>');
  $login.click(function() {
    $loginForm.show();
  });
  var $signup = $('<li>Sign Up</li>');
  var $logout = $('<li>Logout</li>');

  // Auth related jQuery objects
  var $loginForm = $("#login-form");
  var $logoutLink = $("#logout-link");
  var $signupLink = $("#signup-link");
  var $signupForm = $("#signup-form");

  //check if the user's logged in
  // in reality check if token is still valid
  if(Cookies.get("jwt_token")){
    console.log('logged in');
    $loginForm.hide();
    $signupLink.hide();
    $logoutLink.hide();
    $navbar.append($home);
    $navbar.append($profile);
    $navbar.append($users);
    $navbar.append($logout);
    $navbar.show();
  } else {
    console.log('not logged in');
    $loginForm.hide();
    $signupLink.hide();
    $signupForm.hide();
    $logoutLink.hide();
    $navbar.append($home);
    $navbar.append($users);
    $navbar.append($login);
    $navbar.append($signup);
    $navbar.show();
  }

  // Event listener and handler to login
  $loginForm.submit(function(e){
    e.preventDefault();
    $.ajax({
      url: "/auth",
      method: "POST",
      data: {
        username: $loginForm.find("[name=username]").val(),
        password: $loginForm.find("[name=password]").val()
      }
    }).success(function(data){
      // console.log(data);
      if(data.token){
        Cookies.set("jwt_token", data.token);
          $signupForm.hide();
          $signupLink.hide();
          $loginForm.hide();
      } else {
        console.log("ERROR LOGGING IN");
      }
    });
  });

  // Event listener and handler to signup
  $signupForm.submit(function(e) {
    e.preventDefault();
    console.log('sending ajax to signup');
    console.log($signupForm.find("[name=username]").val());
    console.log($signupForm.find("[name=email]").val());
    console.log($signupForm.find("[name=password]").val());
    $.ajax({
      url: '/users',
      method: 'POST',
      data: {
        username: $signupForm.find("[name=username]").val(),
        email: $signupForm.find("[name=email]").val(),
        password: $signupForm.find("[name=password]").val()
      }
    }).done(function(data) {
      // if the response is true;
      if(data) {
        redirectLogin();
      }
    });
  });

  // Event Listener and handler to logout
  $logoutLink.click(function(e){
    Cookies.remove("jwt_token");
    location.reload();
  });

  // Rendering functions
  var signedUp = function() {
    $signupForm.hide();
    $signupLink.hide();
    $loginForm.show();
  }

  var redirectLogin = function() {
    $signupForm.hide();
    $signupLink.hide();
    $loginForm.show();
  }

  // Event listener and handler to signup
  $signupLink.click(function(e) {
    e.preventDefault();
    $loginForm.hide();
    $logoutLink.hide();
    $signupLink.hide();
    $signupForm.show();
  });
});

var testAuth = function() {
  $.ajax({
    url: '/users/test',
    method: 'GET'
  }).done(function(data) {
    console.log(data);
  }); 
};