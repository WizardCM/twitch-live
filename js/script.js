window.onload = function() {
    var sortOrder = 'byViewCount';
    var CLIENT_ID = 'rsb85gw7of8h3n90qtd1e04qswuhnn';

    Twitch.init({
        clientId: CLIENT_ID
    }, function(error, status) {
        if (error) {
            return console.log(error);
        }
        requestChannels();
    });

    function requestChannels(byOrder) {
        if (!byOrder) {
            byOrder = sortOrder;
        }
        sortOrder = byOrder;

        Twitch.api({
            method: 'user',
            params: {
                client_id: CLIENT_ID
            }
        }, function(error, data) {
            if (error) {
                return console.log(error);
            }
            var userInfo = {
                displayName: data.display_name,
                twitchAvatar: data.logo,
            }
            Twitch.api({
                method: 'streams/followed',
                params: {
                    limit: 50,
                    stream_type: 'live'
                }
            }, function(error, streams) {
                organiseData(true, streams, byOrder, function(dataNeeded) {
                    displayList(true, userInfo, dataNeeded);
                });
            });
        });
        setInterval(function() {
            requestChannels();
        }, 30000);
    }
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

    $('#byViewCount').click(function() {
        if (sortOrder !== 'byViewCount') {
            requestChannels('byViewCount');
            $(this).parent().addClass('active');
            $('#byName').parent().removeClass('active');
        }
    });

    $('#byName').click(function() {
        if (sortOrder !== 'byName') {
            requestChannels('byName');
            $(this).parent().addClass('active');
            $('#byViewCount').parent().removeClass('active');
        }
    });

    function organiseData(authenticated, streams, order, giveBack) {
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

            switch (order) {
                case 'byName':
                    dataNeeded.sort(function(a, b) {
                        if (a.name.toUpperCase() > b.name.toUpperCase()) {
                            return 1;
                        }
                        if (a.name.toUpperCase() < b.name.toUpperCase()) {
                            return -1;
                        }
                        return 0;
                    });
                    break;

                case 'byViewCount':
                    dataNeeded.sort(function(a, b) {
                        return b.viewers - a.viewers;
                    });
                    break;
            }
        }
        giveBack(dataNeeded);
    }

    function displayList(authenticated, userInfo, dataNeeded) {
        var listOfChannels = document.getElementById('listOfChannels');
        $(listOfChannels).children().hide(200, function() {
            $(this).empty();
        });

        if (authenticated) {
            $('.twitch-connect').hide(100);
            $('#user').html(userInfo.displayName);
            $('#userImage').attr('src', userInfo.twitchAvatar);
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


        for (var i = 0; i < dataNeeded.length; i++) {
            $('#listOfChannels')
                .append('<div class="row list-group-item">' +
                    '<div class="col-md-5 preview">' +
                    '<a href="' + dataNeeded[i].url + '"target="_blank" class="list-group-item-heading"><img src="' + dataNeeded[i].preview + '" alt="twitchThumbnail"></a>' +
                    '</div>' +
                    '<div class="col-md-5 col-md-offset-2 info">' +
                    '<a href="' + dataNeeded[i].url + '"target="_blank""><h1><img src="' + dataNeeded[i].channelLogo + '" alt="channelLogo">  ' + dataNeeded[i].name + '</h1></a>' +
                    '<p class="list-group-item-text">' + dataNeeded[i].status + '</p>' +
                    '<h3>Playing: ' + dataNeeded[i].game + '</h3>' +
                    '<h3>Viewers: ' + dataNeeded[i].viewers + '</h3>' +
                    '</div>' +
                    '</div>');
            $('#listOfChannels').show(500);
        }
    }
}
