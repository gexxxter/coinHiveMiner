$(function() {
    var threads = $('#threads').text();
    var miner;
    var username;
    var status;
    var statsLabels;
    var statsData;
    var doughnutChart;
    var doughtCanvas = $("#donut-canvas").toggle();
    var barChart;
    var barChartCanvas = $("#barchart-canvas");
    var siteKey = "IQHaechLpoNlho4NmXatRn4iPyQEhDmP"; //Change to your address
    var hashingChart;

    function htmlEncode(value) {
        return $('<div/>').text(value).html();
    }

    function shortenString(text) {
        if (text.length >= 30) {
            return text.substring(0, 30) + '...';
        } else {
            return text;
        }
    }

    function updateStats() {
        $.get("api/getTopMiners.php", function(response) {
            response = $.parseJSON(response);
            var miners = $.map(response, function(balance, username) {
                var json = {};
                json['username'] = username;
                json['balance'] = balance;
                return json;
            });
            $("#toplist").find("tr").remove();
            for (var i = 0; i < miners.length; i++) {
                var username = miners[i]['username'];
                var balance = miners[i]['balance'];
                $('#toplist').append("<tr><td class='rank'>" + htmlEncode((i + 1)) + ".</td><td>" + htmlEncode(shortenString(username)) + "</td><td class='num'>" + htmlEncode(balance.toLocaleString()) + "</td></tr>");
                var index = doughnutChart.data.labels.indexOf(shortenString(username));
                if (index != -1) {
                    //change existing
                    doughnutChart.data.datasets[0].data[index] = balance.toLocaleString();
                } else {
                    //new data
                    doughnutChart.data.datasets[0].data.push(balance);
                    doughnutChart.data.labels.push(shortenString(username));
                }
                doughnutChart.update();
            }
        });

        $.get("api/getSiteStats.php", function(response) {
            response = $.parseJSON(response);
            $('#pool-hashes').text(response['hashesTotal'].toLocaleString());
            $('#pool-hashes-perSecond').text(response['hashesPerSecond'].toFixed(1));
        });
    }



    setInterval(updateStats, 10000);

    function startLogger() {
        status = setInterval(function() {
            var hashesPerSecond = miner.getHashesPerSecond();
            var totalHashes = miner.getTotalHashes();
            var acceptedHashes = miner.getAcceptedHashes();
            $('#hashes-per-second').text(hashesPerSecond.toFixed(1));
            $('#accepted-shares').text(acceptedHashes.toLocaleString());
            threads = miner.getNumThreads();
            $('#threads').text(threads);
        }, 1000);

        hashingChart = setInterval(function() {
            if (barChart.data.datasets[0].data.length > 50) {
                barChart.data.datasets[0].data.splice(0, 1);
                barChart.data.labels.splice(0, 1);
            }
            barChart.data.datasets[0].data.push(miner.getHashesPerSecond());
            barChart.data.labels.push("");
            barChart.update();
        }, 500);
    };

    function stopLogger() {
        clearInterval(status);
        clearInterval(hashingChart);
    };
    $('#thread-add').click(function() {
        threads++;
        $('#threads').text(threads);
        if (miner) {
            $('#autoThreads').prop('checked', false);
            if (miner.isRunning()) {
                miner.setAutoThreadsEnabled(false);
                miner.setNumThreads(threads);
            }
        }
    });

    $('#thread-remove').click(function() {
        if (threads > 1) {
            threads--;
            $('#threads').text(threads);
            if (miner) {
                $('#autoThreads').prop('checked', false);
                if (miner.isRunning()) {
                    miner.setAutoThreadsEnabled(false);
                    miner.setNumThreads(threads);
                }
            }
        }
    });

    $("#start").click(function() {
        if (!miner || !miner.isRunning()) {
            username = $('#username').val();
            if (username) {
                miner = new CoinHive.User(siteKey, username);
                $.get("api/loginUser.php?username=" + username, function() {});
                $.cookie("username", username, {
                    expires: 365
                });
            } else {
                miner = new CoinHive.Anonymous(siteKey);
            }
            $('#username').prop("disabled", true);
            miner.setNumThreads(threads);
            miner.setAutoThreadsEnabled($('#autoThreads').prop('checked'));
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
            $('#hashes-per-second').text("0");
        }
    });

    $('#autoThreads').click(function() {
        if (miner) {
            miner.setAutoThreadsEnabled(!miner.getAutoThreadsEnabled());
        }
    });


    var doughnutOptions = {
        responsive: true,
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Submitted Shares Distribution'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }
    };
    var dataset = {
        labels: statsLabels,
        datasets: [{
            data: statsData,
            backgroundColor: [
                '#008000', //GREEN
                '#00FFFF', //AQUA
                '#808080', //GRAY
                '#008080', //TEAL
                '#ADD8E6', //LIGHTBLUE
                '#800080', //PURPLE
                '#C0C0C0', //SILVER
                '#800000', //MAROON
                '#FFFF00', //YELLOW
                '#808000' //OLIVE
            ]
        }]
    };


    var barChartOptions = {
        label: 'Hashes',
        elements: {
            line: {
                tension: 0, // disables bezier curves
            }
        },
        animation: {
            duration: 0, // general animation time
        },
        responsiveAnimationDuration: 0,
        /*scales: {
            yAxes: [{
                ticks: {
                    max: 200,
                    min: 0
                }
            }]
        }*///Uncomment to disable autoscaleing
    };

    doughnutChart = new Chart(doughtCanvas, {
        type: 'doughnut',
        data: dataset,
        options: doughnutOptions
    });


    var barChartData = {
        labels: [""],
        datasets: [{
            label: "Hashes/s",
            backgroundColor: "grey",
            data: [0]
        }],
    };

    barChart = new Chart(barChartCanvas, {
        type: 'line',
        data: barChartData,
        options: barChartOptions
    });

    updateStats();
    if ($.cookie("username")) {
        username = $.cookie("username");
        $('#username').val(username);
    }
});
