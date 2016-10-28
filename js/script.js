window.onload = function(){
  var CLIENT_ID = 'arni47763m6bx3atc5gnhcpnyfh40m9';
  Twitch.init({clientId: CLIENT_ID}, function(error, status) {
    if(error){
      console.log(error);
    }
    if(status.authenticated){
      var displayName;
      var twitchAvatar;
      $('.twitch-connect').hide();
      $('#logout').show();
      Twitch.api({method: 'user', params:{client_id: CLIENT_ID}}, function(error, data){
        if(error){
          return;
        }
        displayName = data.display_name;
        twitchAvatar = data.logo;
        Twitch.api({method: 'streams/followed', params:{limit: 100, stream_type: 'live'}}, function(error, streams){
          updateBasicInfo(status.authenticated, displayName, twitchAvatar, streams);
          updateStreamList(status.authenticated, streams);
        });
      });
    }
  });

  $('.twitch-connect').click(function(){
    Twitch.login({
      scope: ['user_read', 'channel_read']
    });
    $('.twitch-connect').hide();
  });

  $('#logout').click(function(){
    Twitch.logout(function(error){
      updateBasicInfo(false);
    });
  });

  function updateBasicInfo(authenticated, username, logo, streams){
    if(authenticated){
      $('.twitch-connect').hide();
      $('#user').html(username);
      $('#userImage').attr('src', logo);
      $('#following').html(streams.streams.length);
      $('#basicInfo').show();
      $('#orderSection').show();
      $('#logout').show();
    } else {
      $('#basicInfo').hide();
      $('#orderSection').hide();
      $('#logout').hide();
      $('.twitch-connect').show();

    }
  }

  function updateStreamList(authenticated, streams){
    if(authenticated){

    }

  }
}
