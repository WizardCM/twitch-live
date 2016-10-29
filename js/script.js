var sortOrder = 'byViewCount';
window.onload = function() {
    var CLIENT_ID = 'arni47763m6bx3atc5gnhcpnyfh40m9';

    Twitch.init({
        clientId: CLIENT_ID
    }, function(error, status) {
        if (error) {
            return console.log(error);
        }
        var displayName;
        var twitchAvatar;
        sortOrder = 'byViewCount';
        $('.twitch-connect').hide(100);
        $('#logout').show(400);
        Twitch.api({
            method: 'user',
            params: {
                client_id: CLIENT_ID
            }
        }, function(error, data) {
            if (error) {
                return console.log(error);
            }

            displayName = data.display_name;
            twitchAvatar = data.logo;
            Twitch.api({
                method: 'streams/followed',
                params: {
                    limit: 100,
                    stream_type: 'live'
                }
            }, function(error, streams) {
                organiseData(true, streams, sortOrder, function(dataNeeded) {
                    displayList(true, displayName, twitchAvatar, dataNeeded);
                });
            });
          });
        }
      );

    $('.twitch-connect').click(function() {
        Twitch.login({
            scope: ['user_read', 'channel_read']
        });
    });

    $('#logout').click(function() {
        Twitch.logout(function(error) {
          $('#userInfo').hide(100);
          $('#orderSection').hide();
          $('#logout').hide(100);
          $('.twitch-connect').show(400);
          $('#listOfChannels').hide(100);
        });
    });

    function organiseData(authenticated, streams, sortOrder, giveBack) {
        if (authenticated && streams) {
            var streamList = streams.streams;
            var dataNeeded = [];
            for (var i = 0; i < streamList.length; i++) {
                dataNeeded[i] = {
                    id: streamList[i]._id,
                    preview: streamList[i].preview.medium,
                    channelLogo: streamList[i].channel.logo,
                    name: streamList[i].channel.display_name,
                    url: streamList[i].channel.url,
                    status: streamList[i].channel.status,
                    game: streamList[i].game,
                    viewers: streamList[i].viewers
                };
            }

          switch(sortOrder){
            case 'byName':
            dataNeeded.sort(function(a,b){
              if(a.name.toUpperCase() > b.name.toUpperCase()){
                return 1;
              }
              if(a.name.toUpperCase() < b.name.toUpperCase()){
                return -1;
              }
              return 0;
            });
            break;

            case 'byViewCount':
            dataNeeded.sort(function(a,b){
              return b.viewers - a.viewers;
            });
            break;
          }
        }
        giveBack(dataNeeded);
    }

    function displayList(authenticated, userName, twitchAvatar, dataNeeded){
      if (authenticated) {
          $('.twitch-connect').hide(100);
          $('#user').html(userName);
          $('#userImage').attr('src', twitchAvatar);
          $('#following').html(dataNeeded.length);
          $('#userInfo').show(400);
          $('#orderSection').show(400);
          $('#logout').show(400);
      } else {
          $('#userInfo').hide(100);
          $('#orderSection').hide();
          $('#logout').hide(100);
          $('.twitch-connect').show(400);
          $('#listOfChannels').hide(100);
      }
      var listOfChannels = document.getElementById('listOfChannels');
      if (listOfChannels.hasChildNodes()) {
           $(listOfChannels).hide(400, function() {
               while (listOfChannels.firstChild) {
                   listOfChannels.removeChild(listOfChannels.firstChild);
               }
           });
         }
        for (var i = 0; i < dataNeeded.length; i++) {
            $('#listOfChannels')
                .append('<div class="row list-group-item">' +
                    '<div class="col-md-offset-1 col-md-5 preview">' +
                    '<a href="' + dataNeeded[i].url + '"target="_blank" class="list-group-item-heading"><img src="' + dataNeeded[i].preview + '" alt="twitchThumbnail"></a>' +
                    '</div>' +
                    '<div class="col-md-5 col-md-offset-1 info">' +
                    '<a href="' + dataNeeded[i].url + '"target="_blank""><h1><img src="' + dataNeeded[i].channelLogo + '" alt="channelLogo">  ' + dataNeeded[i].name + '</h1></a>' +
                    '<p class="list-group-item-text">' + dataNeeded[i].status + '</p>' +
                    '<h3>Playing: ' + dataNeeded[i].game + '</h3>' +
                    '<h3>Viewers: ' + dataNeeded[i].viewers + '</h3>' +
                    '</div>' +
                    '</div>');
            $('#listOfChannels').show(400);
        }
    }
}
