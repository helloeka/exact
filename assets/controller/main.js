/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var app = angular.module('exact', ['ui.router', 'wt.responsive', 'jQueryScrollbar','angularModalService']);
app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");
    $stateProvider

            .state('/', {
                url: '/',
                templateUrl: 'view/listkirim.html'
            })
            .state('kirim', {
                url: '/kirim',
                templateUrl: 'view/kirim.html'
            })
            .state('opd', {
                url: '/kopd',
                templateUrl: 'view/opd.html'
            })
            .state('liststamp', {
                url: '/liststamp',
                templateUrl: 'view/liststamp.html'
            })
            .state('stamp', {
                url: '/stamp',
                templateUrl: 'view/stamp.html'
            })
            .state('stampforme', {
                url: '/stampforme',
                templateUrl: 'view/stampforme.html'
            })
            .state('kirimstamp', {
                url: '/kirimstamp',
                templateUrl: 'view/kirimstamp.html'
            })
            .state('kontrol', {
                url: '/kontrol',
                templateUrl: 'view/kontrol.html'
            })
            .state('track', {
                url: '/track?_nokiriman=:accountNumer',
                templateUrl: 'view/track.html'
            })
            .state('pickup', {
                url: '/pickup',
                templateUrl: 'view/pickup.html'
            })
            .state('buktikirim', {
                url: '/buktikirim',
                templateUrl: 'view/buktikirim.html'
            })
            .state('listtrace', {
                url: '/listtrace',
                templateUrl: 'view/listtrace.html'
            })
            .state('trace', {
                url: '/trace',
                templateUrl: 'view/trace.html'
            })
            .state('profile', {
                url: '/profile',
                templateUrl: 'view/profile.html'
            })
            .state('profilecorp', {
                url: '/profilecorp',
                templateUrl: 'view/profilecorp.html'
            })
            .state('myprofile', {
                url: '/myprofile',
                templateUrl: 'view/myprofile.html'
            })
            .state('invoice', {
                url: '/invoice',
                templateUrl: 'view/bagianInvoice.html'
            })
            .state('saving', {
                url: '/saving',
                templateUrl: 'view/mysaving.html'
            })
            .state('savingcorp', {
                url: '/saving',
                templateUrl: 'view/mysavingcorp.html'
            })
            .state('myinvoice', {
                url: '/myinvoice',
                templateUrl: 'view/myinvoice.html'
            })
            .state('myapparel', {
                url: '/myapparel',
                templateUrl: 'view/myapparel.html'
            })
            .state('addressbook', {
                url: '/addresbook',
                templateUrl: 'view/addressbook.html'
            })
            .state('notifikasi', {
                url: '/notifikasi',
                templateUrl: 'view/notifikasi.html'
            })
            .state('pengguna', {
                url: '/pengguna',
                templateUrl: 'view/pengguna.html'
            })
            .state('departement', {
                url: '/departement',
                templateUrl: 'view/departement.html'
            })
            .state('pushnotifikasi', {
                url: '/pushnotifikasi',
                templateUrl: 'view/pushnotifikasi.html'
            })
            .state('pengalihaninvoice', {
                url: '/pengalihaninvoice',
                templateUrl: 'view/pengalihaninvoice.html'
            })
            .state('lokasiambil', {
                url: '/lokasiambil',
                templateUrl: 'view/lokasiambil.html'
            })
            .state('lokasi', {
                url: '/lokasi',
                templateUrl: 'view/lokasi.html'
            })
            .state('ongkir', {
                url: '/ongkir',
                templateUrl: 'view/ongkir.html'
            });
});
