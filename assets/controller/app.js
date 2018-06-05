
var app = angular.module('exact', ['ui.router','wt.responsive','jQueryScrollbar','angularModalService']);
app.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider
        .state('landing', {
            url: '/',
            templateUrl: 'auth/main.html'
        })
        .state('join', {
            url: '/join',
            templateUrl: 'auth/join.html'
        })
        .state('track', {
            url: '/track?_nokiriman=:accountNumer',
            templateUrl: 'auth/track.html'
        })
        .state('ongkir', {
            url: '/ongkir',
            templateUrl: 'auth/ongkir.html'
        })
        .state('intro', {
            url: '/intro',
            templateUrl: 'auth/intro.html'
        })
        .state('lokasi', {
            url: '/lokasi',
            templateUrl: 'auth/lokasi.html'
        })

        .state('syarat', {
            url: '/syarat',
            templateUrl: 'auth/syarat.html'
        })
        ;

});

