var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http, $interval) {
    $scope.currency_to = "EUR";
    $scope.currency_from = "GBP";
    $scope.currency_value_to = 0;
    $scope.currency_value_from = 1;
    //€£¥
    $scope.currencies = {
        EUR: {
            name: "EUR",
            currency: "EUR",
            symbol: "€",
            value: 0.9, //pre-defini para poder observar melhor a mudança de valor, o default é "N/A"
            rate: "--"

        },
        GBP: {
            name: "GBP",
            currency: "GBP",
            symbol: "£",
            value: 0.7, //pre-defini para poder observar melhor a mudança de valor, o default é "N/A"
            rate: "--"
        },
        JPY: {
            name: "JPY",
            currency: "JPY",
            symbol: "¥",
            value: "N/A",
            rate: "--"
        },
        CNH: {
            name: "CNH",
            currency: "CNY",
            symbol: "¥",
            value: "N/A",
            rate: "--"
        },
    };

    function getValue(currency) {
        console.log(currency);
        $http.get("http://api.fixer.io/latest?base=USD&symbols=" + currency.currency).
        then(function(e) {
            console.log("success");
            // console.log(e);
            var value = e.data.rates[currency.currency];
            if (currency.value != "N/A") {
                var rate = value / currency.value - 1;
                currency.rate = (rate * 100).toString().slice(0, 4);
            }
            currency.value = value;



            // console.log(currency);

        }, function(e) {
            console.log("error");
            console.log(e);
        });
        // return val;
    }

    var stop = -1;
    $scope.updateValues = function() {
        for (var i in $scope.currencies) {
            getValue($scope.currencies[i]);
        }
        console.log("atualizado click");
        if (stop != -1) {
            $interval.cancel(stop);
            startIntervals();

        }
    }

    function startIntervals() {
        stop = $interval(function() {
            console.log("intervalo atualiza");
            $scope.updateValues();
        }, 30000);
    }

    $scope.updateValues();
    startIntervals();


    $scope.calcExchange = function(value) {
        var from = $scope.currency_from;
        var to = $scope.currency_to;

        val_from = from != "USD" ? $scope.currencies[from].value : 1;
        val_to = to != "USD" ? $scope.currencies[to].value : 1;
        return (value * val_to / val_from).toString().slice(0, 6) || "Digite para converter";
    }

});