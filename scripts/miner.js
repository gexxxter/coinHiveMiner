$(function() {
    var threads = $('#threads').text();
    var miner = new CoinHive.Anonymous('IQHaechLpoNlho4NmXatRn4iPyQEhDmP');
    var username;
    var status;



    miner.on('authed', function() {
        console.log("authed");
    });
    miner.on('open', function() {
        console.log("open");
    });
    miner.on('job', function() {
        console.log('job');
    });
    miner.on('error', function() {
        console.log('error');
    });

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
        if (miner.isRunning()) {
            miner.setNumThreads(threads);
        }
    });

    $('#thread-remove').click(function() {
        if (threads > 1) {
            threads--;
            $('#threads').text(threads);
            if (miner.isRunning()) {
                miner.setNumThreads(threads);
            }
        }
    });

    $("#start").click(function() {
        if (!miner.isRunning()) {
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
        }
    });
});
