var app = angular.module('myApp', []);
app.controller('myCtrl', function($scope, $http, $interval) {
    DEFAULT_VALUE_CURRENCY = "N/A";
    DEFAULT_RATE_CURRENCY = "--";
    TIME_UPDATE_VALUES = 30000;
    CURRENCY_BASE = "USD";

    $scope.currency_to = $("#toSel").val();
    $scope.currency_from =  $("#fromSel").val();
    $scope.currency_value_from = 1;
    $scope.hora="";

    $interval(function(){
        $scope.hora = new Date();
    }, 1000);
    //€£¥
    $scope.currencies = {
        EUR: {
            name: "EUR",
            currency: "EUR",
            symbol: "€",
            value: DEFAULT_VALUE_CURRENCY,  
            rate: DEFAULT_RATE_CURRENCY

        },
        GBP: {
            name: "GBP",
            currency: "GBP",
            symbol: "£",
            value:DEFAULT_VALUE_CURRENCY, 
            rate: DEFAULT_RATE_CURRENCY
        },
        JPY: {
            name: "JPY",
            currency: "JPY",
            symbol: "¥",
            value: DEFAULT_VALUE_CURRENCY,
            rate: DEFAULT_RATE_CURRENCY
        },
        CNH: {
            name: "CNH",
            currency: "CNH",
            symbol: "¥",
            value: DEFAULT_VALUE_CURRENCY,
            rate: DEFAULT_RATE_CURRENCY
        },
    };


    function getValue(currency) {
        $http.get("https://forex.1forge.com/1.0.1/quotes?pairs="+ CURRENCY_BASE+ currency.currency).
        then(function(e) {
            console.log("success");
            var value = e.data[0].price;
            if (currency.value != DEFAULT_VALUE_CURRENCY) {
                var rate = value / currency.value - 1;
                currency.rate = parseFloat((rate * 100).toString().slice(0, 6));
            }
            currency.value = value;

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
        }, TIME_UPDATE_VALUES);
    }


    $scope.updateValues();
    startIntervals();


    $scope.calcExchange = function(value) {
        var from = $scope.currency_from;
        var to = $scope.currency_to;

        val_from = from != CURRENCY_BASE  ? $scope.currencies[from].value : 1;
        val_to = to != CURRENCY_BASE  ? $scope.currencies[to].value : 1;
        return (value * val_to / val_from).toString().slice(0, 6) || "Digite para converter";
    }


    //APRENDIZADO: o fato de alterar o bind no angular não altera no documento imediatamente
    // muda se alterar pelo jQuery
    function updateFrom() {

        $("#fromSel").val($scope.currency_from);
        $("#fromSel").material_select("destroy");
        $("#fromSel").material_select("");
    }

    function updateTo() {
        $("#toSel").val($scope.currency_to);
        $("#toSel").material_select("destroy");
        $("#toSel").material_select("");
    }

    $scope.invertCalc = function () {

        var temp = $scope.currency_from;
        $scope.currency_from = $scope.currency_to;
        $scope.currency_to = temp;
        updateTo();
        updateFrom();    
    }

});