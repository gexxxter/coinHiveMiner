$(function() {
    var threads = $('#threads').text();
    var miner;
    var username;
    var status;
    var siteKey = "IQHaechLpoNlho4NmXatRn4iPyQEhDmP";

    // miner.on('authed', function() {
    //     console.log("authed");
    // });
    // miner.on('open', function() {
    //     console.log("open");
    // });
    // miner.on('job', function() {
    //     console.log('job');
    // });
    // miner.on('error', function() {
    //     console.log('error');
    // });

    function sortMiners(miner, otherMiner) {
        return miner['balance'] > otherMiner['balance'] ? -1 : 1;
    }

    function updateToplist(){
      $.get("api/getTopMiners.php", function(response) {
          response = $.parseJSON(response);
          var arr = $.map(response, function(balance, username) {
              var json = {};
              json['username'] = username;
              json['balance'] = balance;
              return json;
          });
          arr.sort(sortMiners);
          $("#toplist").find("tr").remove();
          for (var i = 0; i < arr.length; i++) {
              $('#toplist').append("<tr><td class='rank'>" + (i + 1) + ".</td><td>" + arr[i]['username'] + "</td><td>" + arr[i]['balance'] + "</td></tr>");
          }
      });
    }

    updateToplist();
    setInterval(updateToplist, 10000);

    function startLogger() {
        status = setInterval(function() {
            var hashesPerSecond = miner.getHashesPerSecond();
            var totalHashes = miner.getTotalHashes();
            var acceptedHashes = miner.getAcceptedHashes();
            $('#hashes-per-second').text(hashesPerSecond.toFixed(1));
            $('#accepted-shares').text(acceptedHashes);
            console.log("h/s " + hashesPerSecond + " totalHashes: " + totalHashes + " acceptedHashes: " + acceptedHashes);


        }, 1000);
    };

    function stopLogger() {
        clearInterval(status);
    };
    $('#thread-add').click(function() {
        threads++;
        $('#threads').text(threads);
        if (miner && miner.isRunning()) {
            miner.setNumThreads(threads);
        }
    });

    $('#thread-remove').click(function() {
        if (threads > 1) {
            threads--;
            $('#threads').text(threads);
            if (miner && miner.isRunning()) {
                miner.setNumThreads(threads);
            }
        }
    });

    $("#start").click(function() {
        if (!miner || !miner.isRunning()) {
            username = $('#username').val();
            if (username) {
                miner = new CoinHive.User(siteKey, username);
                $.get("api/loginUser.php?username=" + username, function() {});
            } else {
                miner = new CoinHive.Anonymous(siteKey);
            }

            $('#username').prop("disabled", true);
            miner.setNumThreads(threads);
            miner.start();
            stopLogger();
            startLogger();
            console.log('miner started');
            $("#start").text("Stop");
        } else {
            miner.stop();
            stopLogger();
            console.log('miner stopped');
            $('#username').prop("disabled", false);
            $("#start").text("Start");
        }
    });
});
