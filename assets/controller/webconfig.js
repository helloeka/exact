/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var server = 'https://www.exact.co.id/SE/';
//var server = 'http://192.168.0.113:8084/SE/';
function doPost($http, service, args, result) {
    $http({
        method: 'POST',
        url: server + service,
        params: args,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function mySucces(response) {
        result(response.data);
    }, function myError(response) {
        $.LoadingOverlay("hide");
        $.alert({
            title: 'Error!',
            content: "Error process please try again !"
        });
    });
}
;
function Post(service, data, result) {
    var httpServer = server + service;
    $.post(httpServer, data, function (data, status) {
        result(data);
    });
}
var lat;
var lot;
function initGeolocation() {
    if (navigator.geolocation) {
        // Call getCurrentPosition with success and failure callbacks
        navigator.geolocation.getCurrentPosition(success);
    } else {
        alert("Sorry, your browser does not support geolocation services.");
    }
}
;

var delete_cookie = function (cvalue) {
    document.cookie = cvalue + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

function success(position) {

    lot = position.coords.longitude;
    lat = position.coords.latitude;
}
;

function getLocLat() {
    return lat;
}
function getLocLot() {
    return lot;
}
function getZona() {
    var currentTime = new Date();
    var currentTimezone = currentTime.getTimezoneOffset();
    currentTimezone = (currentTimezone / 60) * -1;
    var gmt;
    if (currentTimezone !== 0) {
        gmt = currentTimezone > 0 ? ' +' : ' ';
        gmt = currentTimezone;
    }

    return gmt;
}

function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue;
}
;

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function deleteCookies() {
    delete_cookie("token");
    delete_cookie("iduser");
    delete_cookie("email");
    window.location = "index.html";
}
