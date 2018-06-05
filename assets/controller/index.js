/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
app.directive('ngTab', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 9 | event.which === 10) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngTab);
                });

                event.preventDefault();
            }
        });
    };
});
app.directive('ngFocusOut', function ($timeout) {
    return function ($scope, elem, attrs) {
        $scope.$watch(attrs.ngFocusOut, function (newval) {
            if (newval) {
                $timeout(function () {
                    elem[0].focusout();
                }, 0, false);
            }
        });
    };
});
app.directive('autoComplete', function ($timeout) {
    return function (scope, element, iAttrs) {
        element.autocomplete({
            source: scope[iAttrs.uiItems],
            select: function () {
                $timeout(function () {
                    element.trigger('input');
                }, 0);
            }
        });
    };
});
app.directive('ngAutocomplete', function ($parse) {
    return {
        scope: {
            details: '=',
            ngAutocomplete: '=',
            options: '='
        },

        link: function (scope, element, attrs, model) {

            //options for autocomplete
            var opts;

            //convert options provided to opts
            var initOpts = function () {
                opts = {};
                if (scope.options) {
                    if (scope.options.types) {
                        opts.types = [];
                        opts.types.push(scope.options.types);
                    }
                    if (scope.options.bounds) {
                        opts.bounds = scope.options.bounds;
                    }
                    if (scope.options.country) {
                        opts.componentRestrictions = {
                            country: scope.options.country
                        };
                    }
                }
            };
            initOpts();

            //create new autocomplete
            //reinitializes on every change of the options provided
            var newAutocomplete = function () {
                scope.gPlace = new google.maps.places.Autocomplete(element[0], opts);
                google.maps.event.addListener(scope.gPlace, 'place_changed', function () {
                    scope.$apply(function () {
//              if (scope.details) {
                        scope.details = scope.gPlace.getPlace();
//              }
                        scope.ngAutocomplete = element.val();
                    });
                });
            };
            newAutocomplete();

            //watch options provided to directive
            scope.watchOptions = function () {
                return scope.options;
            };
            scope.$watch(scope.watchOptions, function () {
                initOpts();
                newAutocomplete();
                element[0].value = '';
                scope.ngAutocomplete = element.val();
            }, true);
        }
    };
});
function dataPersonal(data) {
    var dataPersonal = data;
    return dataPersonal;
}
;

function getDataUserBisnis(data) {
    var dataPersonal = data;
    return dataPersonal;
}
;
function initGeolocation() {
    if (navigator.geolocation) {
        // Call getCurrentPosition with success and failure callbacks
        navigator.geolocation.getCurrentPosition(success);
    } else {
        alert("Sorry, your browser does not support geolocation services.");
    }
}
;
function success(position) {
    lot = position.coords.longitude;
    lat = position.coords.latitude;
    setCookie('_lat', lat);
    setCookie('_lot', lot);
    setCookie('_zona', getZona());
}
;
initGeolocation();
var kodeBarcode = '';
app.controller('indexController', function ($scope, $http, $state) {
    $scope.index = function () {
        $state.go('landing');
        window.location.reload();
    };
   // init();
    function init() {
        $('#menu-login').show();
        $('#menu-logout').hide();
        $.LoadingOverlay("show");
        params = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xparam: 'getprofileweb',
            xloginfrom: 'W'
        };
        doPost($http, 'myexweb.exgetprofileinfo?', params, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                window.location.href = "dashboard.html?token=" + getCookie('token');
                $('#menu-login').hide();
                $('#menu-logout').show();
            } else {
                $.LoadingOverlay("hide");
                $('#menu-login').show();
                $('#menu-logout').hide();
            }
        });
    }
    ;
    $scope.dashboard = function () {
        $.LoadingOverlay("show");
        params = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xparam: 'getprofileweb',
            xloginfrom: 'W'
        };
        doPost($http, 'myexweb.exgetprofileweb?', params, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                window.location.href = "dashboard.html?token=" + getCookie('token');
            } else {
                $.LoadingOverlay("hide");
                $.confirm({
                    title: 'Warning!',
                    content: 'Session anda telah habis silahkan login ulang',
                    buttons: {
                        Ya: function () {
                            $('#myModal').modal('show');
                        },
                        heyThere: {
                            text: 'Tidak', // With spaces and symbols
                            action: function () {

                            }
                        }
                    }
                });
            }
        });
    };
});
app.controller('loginController', function ($scope, $http, $interval) {
    $scope.reset = function () {
        $scope.email = '';
        $scope.password = '';
    };

    var action;
    var sid;
    var barcode;
    function init() {
        // start web socket
        var ws = new WebSocket("wss://www.exact.co.id/SE/nikitarn?appid=request");

        ws.onopen = function ()
        {
            // Web Socket is connected, send data using send()
//            ws.send("Message to send");
//            alert("Message is sent...");
        };

        ws.onmessage = function (evt)
        {
            var received_msg = evt.data;
            var received = JSON.parse(received_msg);
            action = received.action;
            sid = received.sid;
            barcode = received.barcode;
            if (action === 'connected' || action === 'barcode') {
                var vbarcode = encodeURI(barcode);
                $('#barcode').html('<img src="https://www.exact.co.id/SE/res/qrgenerator?fc=800021&size=300&barcode=' + vbarcode + '" style="z-index: 50px;width: 300px;height: 300px;postion:absolute:left:0px;right:0px;">');
                $.LoadingOverlay("hide");
            } else if (action === 'login') {
                $.LoadingOverlay("show");
                var param = {
                    xsession: kodeBarcode,
                    xsid: sid,
                    xbarcode: barcode
                };
                doPost($http, 'myexweb.exweblogin?', param, function (result) {
                    if (result.STATUS === 'OK') {
                        var _dataPersonal = dataPersonal(result.PERSONAL[0]);
                        setCookie("token", result.TOKEN);
                        setCookie("iduser", _dataPersonal.ID_USER);
                        setCookie("email", _dataPersonal.EMAIL);
                        // Hide it after 3 seconds
                        setTimeout(function () {
                            $.LoadingOverlay("hide");
                        }, 4000);
                        window.location.href = "dashboard.html?token=" + getCookie('token');
                        $scope.reset;
                    } else {
                        $.LoadingOverlay("hide");
                    }
                });
//                console.log(received);
            } else {
                $.LoadingOverlay("hide");
            }
        };

        ws.onclose = function ()
        {
            // websocket is closed.
            //alert("Connection is closed...");
        };

        window.onbeforeunload = function (event) {
            socket.close();
        };
    }
    $scope.getBarcode = function () {
        $.LoadingOverlay("show");
        init();
//        $interval(init, 9000);
    };
    $scope.login = function () {
        // Show full page LoadingOverlay
        $.LoadingOverlay("show");
        params = {
            xzona: getZona(),
            xtokenz: getCookie('token'),
            xparam: 'galogin',
            xloginfrom: 'W',
            xuserid: $scope.email,
            xpassword: $scope.password
        };
        doPost($http, 'myexweb.exloginweb?', params, function (result) {
            if (result.STATUS === 'OK') {
                var _dataPersonal = dataPersonal(result.PERSONAL[0]);
                setCookie("token", result.TOKEN);
                setCookie("iduser", _dataPersonal.ID_USER);
                setCookie("email", _dataPersonal.EMAIL);
                // Hide it after 3 seconds
                setTimeout(function () {
                    $.LoadingOverlay("hide");
                }, 3000);
                window.location.href = "dashboard.html?token=" + getCookie('token');
                $scope.reset;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.logout = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xkodeuser: getCookie('email'),
            xloginfrom: 'W',
            xtoken: getCookie('token'),
            xzona: getZona()
        };
        $.confirm({
            title: 'Warning!',
            content: 'Apakah anda akan keluar dali aplikasi ?',
            buttons: {
                Ya: function () {
                    $.LoadingOverlay("show");
                    doPost($http, 'myexweb.exlogout?', param, function (result) {
                        if (result.STATUS === 'OK') {
                            $.LoadingOverlay("hide");
                            delete_cookie("token");
                            delete_cookie("iduser");
                            delete_cookie("email");
                            window.location = "index.html";
                        } else {
                            $.LoadingOverlay("hide");
                            $.alert({
                                title: 'Error!',
                                content: result.ERROR
                            });
                        }
                        ;
                    });
                },
                heyThere: {
                    text: 'Tidak', // With spaces and symbols
                    action: function () {

                    }
                }
            }
        });
    };
});
app.controller('trackController', function ($scope, $http, $stateParams, $state) {
    $scope.nokiriman = $stateParams._nokiriman;
    $scope.getTrack = function () {
        $.LoadingOverlay("show");
        var param = {
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xnokiriman: $scope.nokiriman
        };
        doPost($http, 'myexweb.extrackresi?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("Hide");
                $scope.dataTracking = result.DATA;
                // window.location.reload();
            } else {
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
                $.LoadingOverlay("Hide");
                $scope.dataTracking = [];
                $state.go('landing');
            }

        });

    };

});
// CONTROLLER FOR LOKASI
var DATA_DOP = {};
app.controller('lokasiController', function ($scope, $http) {
    $scope.kolom = 'ALAMAT';
    $scope.getParamCari = function () {
        var param = {
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xmenu: 'lokasi'
        };
        doPost($http, 'myexweb.exloadsearching?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.paramcari = result.LIST_SEARCH;
            } else {

            }

        });
    };
    $scope.getDop = function () {
        $.LoadingOverlay("show");
        var param = {
            xparamz: 'listdop',
            xlat: lat,
            xlon: lng,
            xkodepos: kodeposDop,
            xnamakolom: $scope.kolom,
            xvalue: $scope.cari
        };
        doPost($http, 'myexweb.exlistdop?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataDop = result.LIST_DOP;
                $scope.lokasi = result.LOKASI;
                DATA_DOP.data = result;
                initAutocomplete();
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
});

//GOOLGE MAP
var lng = parseFloat(getCookie('_lot'));
var lat = parseFloat(getCookie('_lat'));
var myLoc = {
    lng: lng,
    lat: lat
};
var kodeposDop;
var postcode;
var kota;
var options = {
    types: ['address'],
    componentRestrictions: {country: 'id'}
};
function getDo() {
    var data = DATA_DOP.data;
    return data;
}
function initAutocomplete() {
    var DATA = DATA_DOP.data;
    var listDop = DATA.LIST_DOP;
    var Location = DATA.LOKASI;
    var map = new google.maps.Map(document.getElementById('map'), {
        center: myLoc,
        zoom: 18,
        mapTypeId: 'roadmap'
    });

    var i = 0;
    for (i; i < Location.length; i++) {
        var icon = {
            url: listDop[i].PIN, // url
            scaledSize: new google.maps.Size(30, 50), // scaled size
            origin: new google.maps.Point(0, 0), // origin
            anchor: new google.maps.Point(0, 0), // anchor
            color: listDop[i].ACTIVE
        };

        var marker = new google.maps.Marker({
            position: Location[i],
            map: map,
            animation: google.maps.Animation.DROP,
            label: listDop[i].NAMA_DOP,
            icon: icon,
            data: listDop[i]
        });
    }
    ;
    // Create the search box and link it to the UI element.
    var input = document.getElementById('pac-input');
    var searchBox = new google.maps.places.SearchBox(input, options);
    //set positio place
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox.setBounds(map.getBounds());
    });
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function () {
        var places = searchBox.getPlaces();
        if (places.length === 0) {
            return;
        }
        if (!places[0].geometry) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + places.name + "'");
            return;
        }
        // get psot code
        var address = '';
        if (places[0].address_components) {
            address = [
                (places[0].address_components[6] && places[0].address_components[6].short_name ||
                        '')
            ].join(' ');
        }
        //hasil disini

        var postalcode = places[0].address_components[6];
        kodeposDop = postalcode.long_name;
        kota = places[0].address_components[3].long_name;
        var xlng = places[0].geometry.viewport.b.b;
        var xlat = places[0].geometry.viewport.f.b;
        lat = xlat;
        lng = xlng;

        // Clear out the old markers.
        markers.forEach(function (marker) {
            marker.setMap(null);
        });
        markers = [];

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function (place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
//            var icon = {
//                url: place.icon,
//                size: new google.maps.Size(71, 71),
//                origin: new google.maps.Point(0, 0),
//                anchor: new google.maps.Point(17, 34),
//                scaledSize: new google.maps.Size(25, 25)
//            };
            // Create a marker for each place.
            markers.push(new google.maps.Marker({
                map: map,
                icon: icon,
                title: place.name,
                position: place.geometry.location
            }));
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}

var idOrigin = {};
var idOriginDes = {};
var ZONA_DES = {};
app.controller('ongkirController', function ($scope, $http, $state) {
    $scope.getLocalKota = function () {
        $.LoadingOverlay("show");
        var paramCode = {
            xlat: getCookie('_lat'),
            xtoken: getCookie('token'),
            xlon: getCookie('_lot')
        };
        doPost($http, 'myexweb.exgetpostal?', paramCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $('#kotaasal').val(result.NAMA_KOTA);
                idOrigin.result = result.ID_ORG_DES;
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    $scope.checkKodePos = function () {
        $scope.kodepos = document.getElementById("kodepos").value;
        if ($scope.kodepos.length > 4) {
            $.LoadingOverlay("show");
            var param = {
                xtoken: getCookie('token'),
                xpostalcode: $scope.kodepos,
                xparam: 'getpostalcode',
                xkodeuser: getCookie('email'),
                xloginfrom: 'W',
                xzona: getCookie('_zona')
            };
            doPost($http, 'myexweb.exgetdatapos?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $scope.kotatujuan = result.NAMA_KOTA;
                    idOriginDes.result = result.ID_ORG_DES;
                    ZONA_DES.result = result.ZONA;
                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error!',
                        content: result.ERROR
                    });
                }
            });
        }
    };
    $scope.getKota = function () {
        $.LoadingOverlay("show");
        var param = {
            xkota: $scope.item.title
        };
        doPost($http, 'myexweb.exgetkota?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.titles = result.LIST_KOTA;
                idOrigin.result = result.LIST_KOTA[0].ID_ORIGIN;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.getZonaOngkir = function () {
        $.LoadingOverlay("show");
        var param = {
            xidperusahaan: getCookie('_idbis'),
            xpostalcodedes: $('#kodepos').val(),
            xtoken: getCookie('token'),
            xidorigin: idOrigin.result,
            xkodeuser: getCookie('email'),
            xloginfrom: 'W',
            xparam: 'zonaongkir'
        };
        doPost($http, 'myexweb.exgetzonaongkir?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                ZONA_DES.result = result.ZONA;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    };
//    GET AKSES PENGGUAN
    $scope.hitungOngkir = function () {
        $.LoadingOverlay("show");
        var param = {
            xidorigin: idOrigin.result,
            xiddes: idOriginDes.result,
            xberat: $scope.berat,
            xpcs: $scope.jumlah,
            xzonatujuan: ZONA_DES.result,
            xloginfrom: 'W',
            xzonapostujuan: ZONA_DES.result,
            xparam: 'zonaongkir'
        };
        doPost($http, 'myexweb.exlistongkir?', param, function (result) {
            if (result.STATUS === 'OK') {
                $('#ongkir-service').empty();
                var DATA_SERVICE = result.LIST_SERVICES;
                var items = [];
                $.each(DATA_SERVICE, function (l, val) {
                    items += '<tr class="tr-width">';
                    items += '<td>' + val.PRODUK + '</td>';
                    items += '<td>' + val.HARI + '</td>';
                    items += '<td style="text-align: right;">' + val.ONGKIR_CASH + '</td>';
                    items += '<td style="text-align: right;">' + val.ONGKIR_SAVING + '</td>';
                    items += '<td style="text-align: right;">' + val.BIAYA_TAMBAHAN + '</td>';
                    items += '</tr>';
                });
                $('#ongkir-service').append(items);
            }
            $.LoadingOverlay("hide");
        });
    }
    ;
}
);
app.controller('penawaranController', function ($scope, $http) {
    $scope.mintaPenawaran = function () {
        $.LoadingOverlay("show");
        $.alert({
            title: 'Info',
            content: 'Permintaan penawaran telah kami catatkan! <br> Bagian pemesanan kami akan menghubungi anda, Terimakasih'
        });
        $.LoadingOverlay("hide");
//        var param = {
//            xidperusahaan: getCookie('_idbis'),
//            xpostalcodedes: $('#kodepos').val(),
//            xtoken: getCookie('token'),
//            xidorigin: getCookie('_origin'),
//            xkodeuser: getCookie('email'),
//            xloginfrom: 'W',
//            xparam: 'zonaongkir'
//        };
//        doPost($http, 'myexweb.exgetzonaongkir?', param, function (result) {
//            if (result.STATUS === 'OK') {
//                $.LoadingOverlay("hide");
//                ZONA_DES = result.ZONA_DES;
//            } else {
//                $.LoadingOverlay("hide");
//                $.alert({
//                    title: 'Error',
//                    content: result.ERROR
//                });
//            }
//        });
    };
});