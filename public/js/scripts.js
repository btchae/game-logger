$(document).ready(function() {
  //Container
  var $container = $('#container');
  var $navbar = $('#navbar');
  var $home = $('<li>Home</li>');
  $home.click(function() {
    $container.empty();
    $loginForm.hide();
    $signupForm.hide();
    $container.append('<h1>Welcome to Game Logger!</h1>');
  });
  var $profile = $('<li>Profile</li>');
  var $users = $('<li>Users</li>');
  $users.click(function() {
    getUsers();
  });
  var $searchGames = $('<li>Search Games</li>');
  $searchGames.click(function() {
    $container.empty();
    $loginForm.hide();
    $signupForm.hide();
    var $form = $('<form></form>');
    $form.attr('method','get');
    $form.submit(function(e){
      e.preventDefault();
      searchGames($input.val());
      console.log($input.val());
    });
  var $input = $('<input></input>');
  $input.attr('type','text');
  $input.attr('placeholder','Search Games');
  $form.append($input);
  $container.append($form);
  var $gameSearchButton = $('<button>Game Search</button>');
  $form.append($gameSearchButton);
  });
  var $login = $('<li>Login</li>');
  $login.click(function() {
    $container.empty();
    $signupForm.hide();
    $loginForm.show();
  });
  var $signup = $('<li>Sign Up</li>');
  $signup.click(function() {
    $container.empty();
    $loginForm.hide();
    $signupForm.show();
  })
  var $logout = $('<li>Logout</li>');
  $logout.click(function(e){
    Cookies.remove("jwt_token");
    location.reload();
  });

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
    $navbar.append($searchGames);
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
      console.log(data);
      if(data.token){
        Cookies.set("jwt_token", data.token);
        Cookies.set("id", data.userId);
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

//Getting all users
var getUsers = function() {
  $.ajax({
    url: '/users',
    method: 'GET'
  }).done(function(data) {
    console.log(data);
    displayUsers(data);
  });
};

var displayUsers = function(data) {
  var $container = $('#container');
  var $loginForm = $("#login-form");
  var $signupForm = $("#signup-form");
  $container.empty();
  $loginForm.hide();
  $signupForm.hide();
  for (var i = 0; i < data.length; i++) {
    console.log(data[i].id);
    console.log(data[i].username);
    var userList = $('<p id='+data[i].id+'>'+data[i].username+'</p>')
    userList.click(function() {
      console.log(this.getAttribute('id'));
      getSingleUser(this.getAttribute('id'));
    });
    $container.append(userList);
  }
};

var getSingleUser = function(id) {
  $.ajax({
    url: '/users/'+id,
    method: 'GET'
  }).done(function(data) {
    console.log(data);
    displayUser(data);
  });
};

var displayUser = function(data) {
  var $container = $('#container');
  var $loginForm = $("#login-form");
  var $signupForm = $("#signup-form");
  $container.empty();
  $loginForm.hide();
  $signupForm.hide();
  var $displayUserDiv = $('<div id='+data.user.id+'></div>');
  var $displayUsername = $('<p>'+'Username: '+data.user.username+'</p>');
  var $displayEmail = $('<p>'+'Email: '+data.user.email+'</p>');
  var $displayGame = $('<div></div>');
  $displayGame.html('<h4>Games:</h4>');
  $displayUserDiv.append($displayUsername);
  $displayUserDiv.append($displayEmail);
  $displayUserDiv.append($displayGame);
  for (var i = 0; i < data.games.length; i++) {
    var $gameList = $('<p id='+data.games[i].id+'>'+data.games[i].title+'</p>')
    $gameList.click(function() {
      console.log(this.getAttribute('id'));
      getSingleGame(this.getAttribute('id'));
    });
    $displayGame.append($gameList);
    $container.append($displayUserDiv);
  }
};

var getSingleGame = function(id) {
  $.ajax({
    url: '/games/'+id,
    method: 'GET'
  }).done(function(data) {
    console.log(data);
    displayGame(data);
  });
};

var displayGame = function(data) {
  var $container = $('#container');
  var $loginForm = $("#login-form");
  var $signupForm = $("#signup-form");
  $container.empty();
  $loginForm.hide();
  $signupForm.hide();
  var $displayGameDiv = $('<div id='+data.id+'></div>');
  var $displayGameTitle = $('<p>'+'Title: '+data.title+'</p>');
  // var $displayGameImage = $('<img src='+data.image+'>');
  var $displayGameDeck = $('<p>'+data.deck+'</p>');
  var $displayGameDescription = $('<p>'+'Description: '+'</p>');
  $displayGameDescription.html(data.description);
  var $displayGamePlatforms = $('<p>'+'Platforms: '+'</p>');
  var $displayGameRatings = $('<p>'+'Ratings: '+'</p>');
  $displayGameDiv.append($displayGameTitle);
  // $displayGameDiv.append($displayGameImage);
  $displayGameDiv.append($displayGameDeck);
  $displayGameDiv.append($displayGameDescription);
  $displayGameDiv.append($displayGamePlatforms);
  $displayGameDiv.append($displayGameRatings);
  $container.append($displayGameDiv);
};

var searchGames = function(query) {
  $.ajax({
    url: '/games/search/'+query,
    method: 'GET'
  }).done(function(data) {
    displaySearchResults(data);
  });
};

var displaySearchResults = function(data) {
  console.log(data);
  var $container = $('#container');
  var $loginForm = $("#login-form");
  var $signupForm = $("#signup-form");
  $container.empty();
  $loginForm.hide();
  $signupForm.hide();
  for (var i = 0; i < data.length; i++) {
    var $gameResults = $('<div id='+i+'></div>');
    var $gameTitle = $('<p>'+'Title: '+data[i].name+'</p>');
    var $gameImage = $('<img src='+data[i].image['small_url']+'>');
    var $gameDeck = $('<p>'+data[i].deck+'</p>');
    var $gameDescription = $('<p></p>');
    $gameDescription.html('Description: '+data[i].description);
    var $gamePlatforms = $('<ul>Platforms:</ul>');
    for (var j = 0; j < data[i].platforms.length; j++) {
      console.log(data[i].platforms[j]);
      var $platformList = $('<li>'+data[i].platforms[j].name+'</li>');
      $gamePlatforms.append($platformList);
    }
    $gameResults.append($gameTitle);
    $gameResults.append($gameImage);
    $gameResults.append($gameDeck);
    $gameResults.append($gameDescription);
    $gameResults.append($gamePlatforms);
    $gameResults.append('<hr>');
    $container.append($gameResults);
  }
};