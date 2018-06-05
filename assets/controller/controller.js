/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//DATA USER ACCOUNT
var DATA_USER;
var ID_KORPORASI;
var ID_BISNIS;
var ID_USER;
var LAT_USER;
var LOT_USER;
var ID_ORIGIN_USER;
var ZONA_USER;
var EMAIL_USER;
var TOKEN_USER = getCookie('token');
var TIPE_USER;
var IS_ADMIN;
var ID_KONTRAK_PERSONAL;
var ID_KONTRAK_PERUSAHAAN;
var NAMA_USER;
var LOGIN_FROM = 'W';
var KODE_POS_MANIFEST;
var ID_ORIGIN_LOGIN;
var DATA_PROFILE;
//DIRECTIVE//
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
app.directive('opendialog', function () {
    var openDialog = {
        link: function (scope, element, attr) {
            function openDialog() {
                var element = angular.element('#myModal');
                var ctrl = element.controller();
                ctrl.setModel(scope.blub);
                element.modal('show');
            }
            element.bind('click', openDialog);
        }
    };
    return openDialog;
});
app.directive('focusOn', function () {
    return function (scope, elem, attr) {
        scope.$on('focusOn', function (e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});

app.factory('focus', function ($rootScope, $timeout) {
    return function (name) {
        $timeout(function () {
            $rootScope.$broadcast('focusOn', name);
        });
    }
});
app.filter('startFrom', function () {
    return function (input, start) {
        if (!input || !input.length) { return; }
        start = +start; //parse to int
        return input.slice(start);
    };
});
app.service('exact-api', function () {
    this.api = function () {
        doPost($http, 'myexweb.exgetprofileinfo?', params, function (result) {
            return result;
        });
    }
});


////////////////
var dataStamp = {};
var DATA_RETURN = [];
var ID_USER_PENERIMA;
var ID_USER_PENGIRIM;
var DATA_PENGIRIM;
// DATA PENERIMA;
var DATA_PENERIMA;
var ID_KODE_POS_ORIGIN_PENERIMA;
var ID_DES_PENERIMA;
var PHONE_PENERIMA = {};
var FREEPORT_ORIGIN_PENERIMA;
var ID_KODE_POS_DES_PENERIMA;
var ZONA_DES_PENERIMA;
var SALDO;
var lat;
var lot;
var ONGKIR;
var FLAG_CHARGE;
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

app.controller('dashboardController', function ($scope, $http, $state) {
    initGeolocation();
    $scope.email = getCookie('email');
    $scope.init = function () {
        hideMenu();
        $scope.getProfileAccount();
        $scope.profileName = null;
    };
    function setUsrDta(userid, email, token, tipe, corp) {
        var data = {
            xuserid: userid,
            xemail: email,
            xtoken: token,
            xtipe: tipe,
            xlogin: 'W'
        };
        return JSON.stringify(data);
    }
    ;
    $scope.getProfileAccount = function () {
        $.LoadingOverlay("show");
        params = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xparam: 'getprofileweb',
            xlat: getCookie('_lat'),
            xlon: getCookie('_lot'),
            xloginfrom: 'W'
        };
        doPost($http, 'myexweb.exgetprofileinfo?', params, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                DATA_USER = result.DEFAULT_PROFILE;
                localStorage.setItem('_usrdta_', setUsrDta(DATA_USER.ID_USER, DATA_USER.EMAIL, getCookie('token'), DATA_USER.TIPE_USER, DATA_USER.ID_KORPORASI));
                if (DATA_USER.LOGO !== null || DATA_USER.LOGO !== undefined) {
                    $scope.logoImage = DATA_USER.LOGO;
                } else {
                    $scope.logoImage = 'assets/img/img.jpg';
                }
                $scope.profileNama = DATA_USER.NAMA;
                $scope.profileSaldo = DATA_USER.SALDO_TERAKHIR;
                $scope.profileTipe = DATA_USER.TIPE_USER;
                $scope.profileMenu = result.ALL_PROFILE;
                ID_USER = DATA_USER.ID_USER;
                NAMA_USER = DATA_USER.NAMA;
                EMAIL_USER = DATA_USER.EMAIL;
                ID_KORPORASI = DATA_USER.ID_KORPORASI;
                TIPE_USER = DATA_USER.TIPE_USER;
                SALDO = DATA_USER.SALDO_TERAKHIR;
                TOKEN_USER = DATA_USER.TOKEN;
                LAT_USER = DATA_USER.LAT_PROFILE;
                LOT_USER = DATA_USER.LON_PROFILE;
                $scope.menubisnis = DATA_USER.TIPE_USER;
                hideMenu(DATA_USER.TIPE_USER);
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    function hideMenu(data) {
        $('#account').show();
        $('#saldo_corp').hide();
        if (data === 'PERSONAL' || data === 'MEMBER') {
            $('#corp').hide();
        } else {
            $('#corp').show();
        }
    }

    $scope.myProfile = function (data) {
        DATA_PROFILE = data;
        if (data.TIPE_USER === 'PERSONAL' || data.TIPE_USER === 'MEMBER') {
            $state.go('profile');
        } else {
            $state.go('profilecorp');
        }
    };
    $scope.getAccountUser = function (account) {
        $.LoadingOverlay("show");
        var param = {
            xidperusahaan: account.ID_KORPORASI,
            xuserid: account.ID_USER,
            xkodeuser: account.EMAIL,
            xloginfrom: 'W',
            xtoken: getCookie('token'),
            xzona: getZona(),
            xlat: getCookie('_lat'),
            xlon: getCookie('_lot')
        };
        doPost($http, 'myexweb.exgetprofilewebdetail?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                DATA_USER = result.DATA_USER;
                localStorage.setItem('_usrdta_', setUsrDta(DATA_USER.ID_USER, DATA_USER.EMAIL, getCookie('token'), DATA_USER.TIPE_USER, DATA_USER.ID_KORPORASI));
                if (DATA_USER.LOGO !== null || DATA_USER.LOGO !== undefined) {
                    $scope.logoImage = DATA_USER.LOGO;
                } else {
                    $scope.logoImage = 'assets/img/img.jpg';
                }
                // klw staff salfo terahir hide
                ID_USER = DATA_USER.ID_USER;
                NAMA_USER = DATA_USER.NAMA;
                EMAIL_USER = DATA_USER.EMAIL;
                ID_KORPORASI = DATA_USER.ID_KORPORASI;
                TIPE_USER = DATA_USER.TIPE_USER;
                SALDO = DATA_USER.SALDO_TERAKHIR;
                TOKEN_USER = DATA_USER.TOKEN;
                LAT_USER = DATA_USER.LAT_PROFILE;
                LOT_USER = DATA_USER.LON_PROFILE;
                $scope.profileNama = NAMA_USER;
                $scope.profileSaldo = DATA_USER.SALDO_TERAKHIR;
                $scope.profileTipe = DATA_USER.TIPE_USER;
                $scope.menubisnis = DATA_USER.TIPE_USER;
                console.log(DATA_USER);
                hideMenu(DATA_USER.TIPE_USER);
                $('.collapse').collapse('hide');
                $state.go('/');
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $state.go('/');
            }
            ;
        });
    };
    $scope.logout = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xzona: getZona()
        };
        $.confirm({
            title: 'Warning!',
            content: 'Apakah ingin keluar dari aplikasi ?',
            buttons: {
                Ya: function () {
                    $.LoadingOverlay("show");
                    doPost($http, 'myexweb.exlogout?', param, function (result) {
                        if (result.STATUS === 'OK') {
                            $.LoadingOverlay("hide");
                            delete_cookie("token");
                            delete_cookie("iduser");
                            delete_cookie("email");
                            localStorage.clear();
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
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


// CONTROLLER FOR KIRIM
var DATA_PRODUCT;
var DATA_SERVICE = [];
var KATEGORI_KIRIMAN;
var ID_KIRIMAN;
var JANJI_TIBA;
var DATA_PENGIRIM_LAIN = {};

var berat;

//KIRIM
function getIdProduct(arg) {
    DATA_PRODUCT = arg;
    JANJI_TIBA = arg.JANJI_TIBA;
    postProduct(DATA_PRODUCT);
    var scope = angular.element(document.getElementById('service')).scope();
    var scopeService = angular.element(document.getElementById('service')).scope();
    $.confirm({
        title: 'Warning!',
        content: 'Apakah anda akan mengunakan service ?',
        buttons: {
            Ya: function () {
                scope.showServices(arg.ID_PRODUK);
            },
            heyThere: {
                text: 'Tidak', // With spaces and symbols
                action: function () {
                    scope.getPembayaran();
                    $('#myProduk').modal('hide');
                }
            }
        }
    });
}
;

function postProduct(data) {
    var product = JSON.stringify(data);
    var param = {
        xuserid: ID_USER,
        xisadmin: IS_ADMIN,
        xidperusahaan: ID_KORPORASI,
        xidkontrak: ID_KONTRAK_PERSONAL,
        xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
        xtoken: TOKEN_USER,
        xkodeuser: EMAIL_USER,
        xloginfrom: LOGIN_FROM,
        xdataproduct: product
    };
    Post('myexweb.exselectprod?', param);
}
;
//STAMP
function getIdProductStamp(arg) {
    DATA_PRODUCT = arg;
    JANJI_TIBA = arg.JANJI_TIBA;
    postProduct(arg);
    var scope = angular.element(document.getElementById('service')).scope();
    $.confirm({
        title: 'Warning!',
        content: 'Apakah anda akan mengunakan service ?',
        buttons: {
            Ya: function () {
                scope.showServicesStamp(arg.ID_PRODUK);
            },
            heyThere: {
                text: 'Tidak', // With spaces and symbols
                action: function () {
                    $('#myProduk').modal('hide');
                }
            }
        }
    });
}
;

// service
var dataService = [];
var ProductService;
var listService;
var HARGA = 0;
var serviceList = [];
var rowIndex;
var columnIndex;
var dataListService = {};

var dataInfo = [];
function getInfo(data) {
    dataInfo.push(data);
}
function setInsurance(data) {
    var checkBox = document.getElementById("COD");
    if (checkBox.checked === true) {
        $('#infoins').val(data);
    } else {
        $('#infoins').val('');
    };
}
function getListServiceKirim(arg, id) {
    var checkBox = document.getElementById(id);
    if (id === "COD" && checkBox.checked === true) {
        $('#infoins').prop('disabled', true);
        $('#info').prop('disabled', false);
        document.getElementById("INS").checked = true;
    } else {
        $('#infoins').prop('disabled', false);
        $('#info').prop('disabled', true);
        //$('#INS').prop('checked',false);
        // document.getElementById("INS").checked = false;
        $('#infoins').val('');
        $('#info').val('');
    };
    if (checkBox.checked === true) {
        var vservice = JSON.stringify(arg);
        serviceList.push(vservice);
    } else {
        for (var z = serviceList.length - 1; z >= 0; z--) {
            var data = JSON.parse(serviceList[z]);
            if (data.KODE_JENIS_SERVICES === id) {
                serviceList.splice(z, 1);
            }
        }
    }
    // var vservice = JSON.stringify(arg);
    // serviceList.push(vservice);
}
;
function getListService(arg) {
    var vservice = JSON.stringify(arg);
}
;
function getDataSevice() {
    var vdataList = [];
    vdataList.push(serviceList);
    var data = vdataList;
    return data.toString();
}
function postService() {
    var param = {
        xuserid: getCookie('iduser'),
        xtoken: getCookie('token'),
        xkodeuser: getCookie('email'),
        xloginfrom: 'W',
        xdataservices: getDataSevice(),
        xinfo: JSON.stringify(dataInfo)
    };
    console.log(param);
    Post('myexweb.exselectservices?', param);
}
;
var ID_KIRIMAN_RETUN;
function getIdReturn(args) {
    ID_KIRIMAN_RETUN = args.ID_KIRIMAN;
}
;

// VARIABEL FOR REP-RINT KIRIMAN
var dataNoKiriman;
var rePrintKirim = [];
function getReKiriman(data) {
    var xdata = {
        xdata: data.ID_KIRIMAN
    };
    var myJSON = JSON.stringify(xdata);
    rePrintKirim.push(myJSON);
}
;

function dataReKiriman() {
    var vdataList = [];
    vdataList.push(rePrintKirim);
    var data = vdataList;
    return data.toString();
}
// CONTROLLER FOR KIRIM
var idBagInvoice;
var localPostcode = {};
var userInvoice = {};
app.controller('kirimController', function ($scope, $http, $state, $filter) {
    $scope.initKirim = function () {
        $scope.divPengirim();
        $scope.divBagian();
        $scope.hide();
        $scope.getLocalPostcode();
        $scope.jumlahPaket = '1';
        $scope.berat1 = '0';
        $scope.panjang1 = '0';
        $scope.lebar1 = '0';
        $scope.tinggi1 = '0';
        $scope.berat2 = '0';
        $scope.panjang2 = '0';
        $scope.lebar2 = '0';
        $scope.tinggi2 = '0';
        $scope.tinggi3 = '0';
        $scope.berat3 = '0';
        $scope.panjang3 = '0';
        $scope.lebar3 = '0';
        $scope.tinggi3 = '0';
        $scope.berat4 = '0';
        $scope.panjang4 = '0';
        $scope.lebar4 = '0';
        $scope.tinggi4 = '0';
        $scope.namaPengirim = NAMA_USER;
        enableAlamatPenerima();
        disPenerima();
        $('#simpanAlamat').show();
        $('#isikiriman').hide();
        if ($scope.jumlahPaket > 1) {
            $scope.max = 35;
        }
        ;
        $('#jenispembayaran').hide();
    };
    function disPenerima() {
        if (TIPE_USER === 'MEMBER' || TIPE_USER === 'PERSONAL') {
            $('#namapengirim').prop('disabled', true);
        } else {
            $('#namapengirim').prop('disabled', false);
        }
    }

    $scope.hide = function () {
        $('#divBagian').hide();
        $('#divInvoice').hide();
        $scope.hideJumlahPaket();
        $scope.hideVolume();
        //  $('#btnVolume').hide();
        $("#divBeaMasuk").hide();
        $('#jenispembayaran').show();
        $('#beratInfo').hide();
        $('#infopos').hide();
    };
    $scope.divPengirim = function () {
        if (getCookie('tipe') === 'MEMBER') {
            $('#divpengirim').hide();
        } else {
            $('#divpengirim').show();
        }
        ;
    };
    $scope.divBagian = function () {
        if ($scope.namaPerusahaan === '' | $scope.namaPerusahaan === 'undefined') {
            $('#divBagian').hide();
            $('#divInvoice').hide();
        } else {
            $('#divBagian').show();
            $('#divInvoice').show();
        }
    };
    $scope.hideJumlahPaket = function () {
        $('#berat2').hide();
        $('#berat3').hide();
        $('#berat4').hide();
    };
    $scope.onJumlah = function () {
        if ($scope.jumlahPaket > 1) {
            $scope.max = 35;
            $('#beratInfo').show();
            $scope.berat2 = 0;
            $scope.berat3 = 0;
            $scope.berat4 = 0;
            jumlahBerat();
        } else {
            $scope.max = '';
            $('#beratInfo').hide();
            jumlahBerat();
        }
        ;
        if ($scope.jumlahPaket === '2') {
            $('#berat2').show();
            $('#berat3').hide();
            $('#berat4').hide();
            $scope.berat3 = 0;
            $scope.berat4 = 0;
            jumlahBerat();
            $scope.hideVolume();
        } else if ($scope.jumlahPaket === '3') {
            $('#berat2').show();
            $('#berat3').show();
            $('#berat4').hide();
            $scope.berat4 = 0;
            $scope.hideVolume();
            jumlahBerat();
        } else if ($scope.jumlahPaket === '4') {
            $('#berat2').show();
            $('#berat3').show();
            $('#berat4').show();
            jumlahBerat();
            $scope.hideVolume();
        } else {
            $scope.hideJumlahPaket();
            $scope.hideVolume();
            jumlahBerat();
        }

        jumlahBerat();
    };
    $scope.checkJumlah = function () {
        if ($scope.jumlahPaket === 2) {
            $('#berat2').show();
            $('#berat3').hide();
            $('#berat4').hide();
            $scope.hideVolume();
            jumlahBerat();
        } else if ($scope.jumlahPaket === 3) {
            $('#berat2').show();
            $('#berat3').show();
            $('#berat4').hide();
            $scope.hideVolume();
            jumlahBerat();
        } else if ($scope.jumlahPaket === 4) {
            $('#berat2').show();
            $('#berat3').show();
            $('#berat4').show();
            $scope.hideVolume();
            jumlahBerat();
        } else {
            $scope.hideJumlahPaket();
            $scope.hideVolume();
            jumlahBerat();
        }
        jumlahBerat();
    };
    $scope.hideVolume = function () {
        $('#volume1').hide();
        $('#volume2').hide();
        $('#volume3').hide();
        $('#volume4').hide();
        jumlahBerat();
    };
    function jumlahBerat() {
        if ($scope.berat1 === undefined || $scope.berat1 === '') {
            $scope.berat1 = 0;
        }
        if ($scope.berat2 === undefined || $scope.berat2 === '') {
            $scope.berat2 = 0;
        }
        if ($scope.berat3 === undefined || $scope.berat3 === '') {
            $scope.berat3 = 0;
        }
        if ($scope.berat4 === undefined || $scope.berat4 === '') {
            $scope.berat4 = 0;
        }
        var jumlah_berat = parseFloat($scope.berat1) + parseFloat($scope.berat2) + parseFloat($scope.berat3) + parseFloat($scope.berat4);
        $scope.jumlah_berat = jumlah_berat;
    }
    $scope.checkVolume = function () {
        if ($scope.jumlahPaket > '1' && $scope.berat1 >= '36') {
            $scope.max = 35;
            $.alert({
                title: 'Error!',
                content: 'Berat tidak boleh lebih besar dari 35 Kg'
            });
        }
        ;
        if ($scope.berat1 >= 1) {
            $('#volume1').show();
        } else {
            $('#volume1').hide();
        }
        if ($scope.berat2 >= 1) {
            $('#volume2').show();
        } else {
            $('#volume2').hide();
        }
        if ($scope.berat3 >= 1) {
            $('#volume3').show();
        } else {
            $('#volume3').hide();
        }
        if ($scope.berat4 >= 1) {
            $('#volume4').show();
        } else {
            $('#volume4').hide();
        }
        jumlahBerat();
    };
    function getBerat() {
        var berat = [];
        var totalberat = [];
        var totalBerat1 = {};
        var totalBerat2 = {};
        var totalBerat3 = {};
        var totalBerat4 = {};
        berat.length = 0;
        if ($scope.berat1 > 0) {
            if ($scope.berat1 >= 50) {
                var totalVolume = (parseFloat($scope.panjang1) * parseFloat($scope.lebar1) * parseFloat($scope.tinggi1)) / 6000;
                if (totalVolume > $scope.berat1) {
                    totalBerat1.data = totalVolume;
                } else {
                    totalBerat1.data = $scope.berat1;
                }
            } else {
                var totalVolume = (parseFloat($scope.panjang1) * parseFloat($scope.lebar1) * parseFloat($scope.tinggi1)) / 4000;
                if (totalVolume > $scope.berat1) {
                    totalBerat1.data = totalVolume;
                } else {
                    totalBerat1.data = $scope.berat1;
                }
            }
            var kg1 = {
                berat: totalBerat1.data,
                panjang: $scope.panjang1,
                lebar: $scope.lebar1,
                tinggi: $scope.tinggi1
            };
            totalberat.push(kg1);
        }

        if ($scope.berat2 > 0) {
            if ($scope.berat2 >= 50) {
                var totalVolume = (parseFloat($scope.panjang2) * parseFloat($scope.lebar2) * parseFloat($scope.tinggi2)) / 6000;
                if (totalVolume > $scope.berat2) {
                    totalBerat2.data = totalVolume;
                } else {
                    totalBerat2.data = $scope.berat2;
                }
            } else {
                var totalVolume = (parseFloat($scope.panjang2) * parseFloat($scope.lebar2) * parseFloat($scope.tinggi2)) / 4000;
                if (totalVolume > $scope.berat2) {
                    totalBerat2.data = totalVolume;
                } else {
                    totalBerat2.data = $scope.berat2;
                }
            }
            var kg2 = {
                berat: totalBerat2.data,
                panjang: $scope.panjang2,
                lebar: $scope.lebar2,
                tinggi: $scope.tinggi2
            };
            totalberat.push(kg2);
        }

        if ($scope.berat3 > 0) {
            if ($scope.berat3 >= 50) {
                var totalVolume = (parseFloat($scope.panjang3) * parseFloat($scope.lebar3) * parseFloat($scope.tinggi3)) / 6000;
                if (totalVolume > $scope.berat3) {
                    totalBerat3.data = totalVolume;
                } else {
                    totalBerat3.data = $scope.berat3;
                }
            } else {
                var totalVolume = (parseFloat($scope.panjang3) * parseFloat($scope.lebar3) * parseFloat($scope.tinggi3)) / 4000;
                if (totalVolume > $scope.berat3) {
                    totalBerat3.data = totalVolume;
                } else {
                    totalBerat3.data = $scope.berat3;
                }
            }
            var kg3 = {
                berat: totalBerat3.data,
                panjang: $scope.panjang3,
                lebar: $scope.lebar3,
                tinggi: $scope.tinggi3
            };
            totalberat.push(kg3);
        }

        if ($scope.berat4 > 0) {
            if ($scope.berat4 >= 50) {
                var totalVolume = (parseFloat($scope.panjang4) * parseFloat($scope.lebar4) * parseFloat($scope.tinggi4)) / 6000;
                if (totalVolume > $scope.berat4) {
                    totalBerat4.data = totalVolume;
                } else {
                    totalBerat4.data = $scope.berat4;
                }
            } else {
                var totalVolume = (parseFloat($scope.panjang4) * parseFloat($scope.lebar4) * parseFloat($scope.tinggi4)) / 4000;
                if (totalVolume > $scope.berat4) {
                    totalBerat4.data = totalVolume;
                } else {
                    totalBerat4.data = $scope.berat4;
                }
            }
            var kg4 = {
                berat: totalBerat4.data,
                panjang: $scope.panjang4,
                lebar: $scope.lebar4,
                tinggi: $scope.tinggi4
            };
            totalberat.push(kg4);
        }
        berat.push(totalberat);
        return berat;
    }
    ;
    $scope.valVolume = function () {
        var status = 0;
        if ($scope.berat1 >= 4 && $scope.panjang1 === '0' && $scope.tinggi1 === '0' && $scope.lebar1 === '0') {
            status = 0;
        } else {
            status = 1;
        }
        if ($scope.berat2 >= 4 && $scope.panjang2 === '0' && $scope.tinggi2 === '0' && $scope.lebar2 === '0') {
            status = 0;
        } else {
            status = 1;
        }
        if ($scope.berat3 >= 4 && $scope.panjang3 === '0' && $scope.tinggi3 === '0' && $scope.lebar3 === '0') {
            status = 0;
        } else {
            status = 1;
        }
        if ($scope.berat4 >= 4 && $scope.panjang4 === '0' && $scope.tinggi4 === '0' && $scope.lebar4 === '0') {
            status = 0;
        } else {
            status = 1;
        }

        return status;
    };

    $scope.showGMap = function () {
        $('#cari').modal('show');
        $('#carikodepos').val('');
    };
    $scope.showMapLain = function () {
        $('#carilain').modal('show');
        $('#carikodeposlain').val('');
    };
    // ALAMAT LAIN
    $scope.showAlamatLain = function () {
        $('#pengirim').modal('show');
    };

    $scope.createAlamatLain = function () {
        var data = null;
        data = {
            email: $('#emaillain').val(),
            nama: $('#namapengirimlain').val(),
            noponsel: $('#noponsellain').val(),
            perusahaan: $('#perusahaanlain').val(),
            bagian: $('#bagianlain').val(),
            alamat: $('#alamatlain').val(),
            kodepos: $('#kodeposlain').val(),
            kota: $('#kotalain').val()
        };
        DATA_PENGIRIM_LAIN.result = data;
        $('#simpanAlamat').hide();
    };
    // GET BUKU ALAMAT
    $scope.showBukuAlamat = function () {
        $scope.getBukuAlamat();
        $('#bukualamat').modal('show');
    };
    $scope.showBukuAlamatLain = function () {
        $('#bukualamatlain').modal('show');
    };
    $scope.getBukuAlamat = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM
        };
        doPost($http, 'myexweb.exlistaddrbook?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataBukuAlamat = result.LIST_ADDR_BOOK;
            } else {
                $.LoadingOverlay("hide");
                $state.go('/');
            }
        });
    };
    $scope.pilihAlamat = function (data) {
        $.confirm({
            title: 'Info!',
            content: 'Apakah ingin mengunakan alamat <br>' + data.NAMA_PERUSAHAAN_BUKU + ' ?',
            buttons: {
                Ya: function () {
                    $('#namapenerima').val(data.NAMA_KONTAK);
                    $('#namaperusahaan').val(data.NAMA_PERUSAHAAN_BUKU);
                    $('#kodepos').val(data.KODE_POS_KONTAK);
                    $('#kota').val(data.NAMA_KOTA);
                    $('#noponsel').val(data.NO_HP);
                    $('#alamat').val(data.ALAMAT);
                    $scope.getPostCode();
                    $scope.checkHanphone();
                    disableAlamatPenerima('#namapenerima');
                    $('#bukualamat').modal('hide');
                    $('#simpanAlamat').hide();
                },
                heyThere: {
                    text: 'Tidak', // With spaces and symbols
                    action: function () {

                    }
                }
            }
        });
    };
    $scope.pilihAlamatLain = function (data) {
        $.confirm({
            title: 'Info!',
            content: 'Apakah ingin mengunakan alamat <br>' + data.NAMA_PERUSAHAAN_BUKU + ' ?',
            buttons: {
                Ya: function () {
                    $('#namapengirimlain').val(data.NAMA_KONTAK);
                    $('#perusahaanlain').val(data.NAMA_PERUSAHAAN_BUKU);
                    $('#kodeposlain').val(data.KODE_POS_KONTAK);
                    $('#kotalain').val(data.NAMA_KOTA);
                    $('#noponsellain').val(data.NO_HP);
                    $('#alamatlain').val(data.ALAMAT);

                    $('#bukualamatlain').modal('hide');
                },
                heyThere: {
                    text: 'Tidak', // With spaces and symbols
                    action: function () {

                    }
                }
            }
        });
    };
    //GET ALIH INVOICE
    $scope.alihInvoice = function () {
        if (ID_KORPORASI === undefined || ID_KORPORASI === '') {
            $.alert({
                title: 'Warning',
                content: 'Gunakan account perusahaan untuk fitur invoice'
            });
        } else {
            $(document).ready(function () {
                $('#invoice').modal('show');
                //                $scope.getUserAlihInvoice();
            });
        }
    };
    $scope.getUserAlihInvoice = function () {
        $scope.dataAlihInvoice = null;
        $.LoadingOverlay("show");
        var param = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM
        };
        doPost($http, 'myexweb.exgetkuasainv?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataAlihInvoice = result.DATA;
                //                    $('#invoice').modal('show');
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    $scope.pilihAlihInvoice = function (data) {
        $.confirm({
            title: 'Info!',
            content: 'Apakah ingin mengunakan invoice <br>' + data.NAMA_PERUSAHAAN + ' ?',
            buttons: {
                Ya: function () {
                    $('#namaperusahaan').val(data.NAMA_PERUSAHAAN);
                    $('#kodepos').val(data.KODE_POS);
                    $('#kota').val(data.KOTA);
                    $('#noponsel').val(data.NO_TELP_PERUSAHAAN);
                    $('#namapenerima').val(data.NAMA_KONTAK);
                    idBagInvoice = data.ID_BAGIAN_INVOICE;
                    $('#alamat').val(data.ALAMAT_PERUSAHAAN);
                    setDataAlihInvoice(data);
                    $scope.getPostCode();
                    $scope.checkHanphone();
                    $('#jenispembayaran').hide();
                    disableAlamatPenerima('ok');
                    $('#invoice').modal('hide');
                    $('#simpanAlamat').hide();
                    userInvoice.result = data;
                    $scope.divBagian();
                },
                heyThere: {
                    text: 'Tidak', // With spaces and symbols
                    action: function () {
                        $('#jenispembayaran').show();
                    }
                }
            }
        });
    };
    function setDataAlihInvoice(data) {
        $scope.namaPerusahaan = data.NAMA_PERUSAHAAN;
        $scope.kodepos = data.KODE_POS;
        $scope.kota = data.KOTA;
        $scope.noPonsel = data.NO_TELP_PERUSAHAAN;
        $scope.alamat = data.ALAMAT_PERUSAHAAN;
    }

    function disableAlamatPenerima(nama) {
        $('#namaperusahaan').prop('disabled', true);
        $('#kodepos').prop('disabled', true);
        $('#noponsel').prop('disabled', true);
        $('#alamat').prop('disabled', true);
        $(nama).prop('disabled', true);
    }
    function enableAlamatPenerima() {
        $('#namaperusahaan').prop('disabled', false);
        $('#kodepos').prop('disabled', false);
        $('#noponsel').prop('disabled', false);
        $('#alamat').prop('disabled', false);
        $('#namapenerima').prop('disabled', false);
    }
    //GET PENGALIHAN INVOICE
    $scope.getLocalPostcode = function () {
        $.LoadingOverlay("show");
        var paramCode = {
            xuserid: ID_USER,
            xlat: getCookie('_lat'),
            xtoken: getCookie('token'),
            xlon: getCookie('_lot')
        };
        doPost($http, 'myexweb.exgetpostal?', paramCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                localPostcode.result = result.KODE_POS;
            } else {
                $.LoadingOverlay("hide");
                setTimeout(function () {
                    $.alert({
                        title: 'Error!',
                        content: result.ERROR + '<br> Silahkan aktifkan kembali GPS browser anda'
                    });
                }, 1000);

                $state.go("/");
            }
        });
    };
    $scope.getPostCode = function () {
        $scope.kodepos = document.getElementById("kodepos").value;
        if ($scope.kodepos.length > 4) {
            $.LoadingOverlay("show");
            var param = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xpostalcodeorigin: localPostcode.result, // get from local postcode login aplikasi
                xpostalcodedes: $scope.kodepos,
                xparam: 'getpostalcode',
                xlat: getCookie('_lat'),
                xlon: getCookie('_lot'),
                xzona: getCookie('_zona')
            };
            doPost($http, 'myexweb.exgetzona?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    DATA_PENERIMA = result;
                    ID_KODE_POS_ORIGIN_PENERIMA = result.ID_ORIGIN;
                    ID_DES_PENERIMA = result.ID_DES;
                    FREEPORT_ORIGIN_PENERIMA = result.FREEPORT_TUJUAN;
                    ID_KODE_POS_DES_PENERIMA = result.ID_KODE_POS_DES;
                    ZONA_DES_PENERIMA = result.ZONA_DES;
                    if (DATA_PENERIMA.FREEPORT_TUJUAN === 'Y' && DATA_PENERIMA.FREEPORT_ORIGIN === 'Y') {
                        $("#divCategory").hide();
                        $("#divBeaMasuk").hide();
                    } else {
                        $("#divCategory").show();
                    }
                    if (result.ZONA_DES === '3' || result.ZONA_DES === '2') {
                        $('#infopos').show();
                        $('#infopos').text('Tambahan biaya penerus');
                    } else if (result.ZONA_DES === '4') {
                        $('#infopos').show();
                        $('#infopos').text('Nondelivery/Ambil di exact');
                    } else if (result.ZONA_DES) {
                        $('#infopos').hide();
                        $('#infopos').text('');
                    }

                    $scope.kota = result.NAMA_KOTA_DES;
                    if (result.ZONA_DES === '3' || result.ZONA_DES === '2') {
                        $('#infopos').show();
                        $('#infopos').text('* Tambahan biaya penerus');
                    } else if (result.ZONA_DES === '4') {
                        $('#infopos').show();
                        $('#infopos').text('* Non Delivery/Ambil di exact');
                    } else if (result.ZONA_DES) {
                        $('#infopos').hide();
                        $('#infopos').text('');
                    }
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
    $scope.checkHanphone = function () {
        $.LoadingOverlay("show");
        var paramValidate = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xzona: getCookie('_zona'),
            xnohpcustomer: $scope.noPonsel
        };
        doPost($http, 'myexweb.excheckisuser?', paramValidate, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                PHONE_PENERIMA.result = result.IS_USER;
            } else if (result.IS_USER === 0) {
                $.LoadingOverlay("hide");
            }
        });
    };
    //GET CATEGORY ISI KIRIMAN
    $scope.getCategory = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xparam: 'getcategory'
        };
        doPost($http, 'myexweb.excategory?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataCategory = result.LIST_KATEGORI;
                for (var i = 0; i < $scope.DataCategory.length; i++) {
                    var dataList = result.LIST_KATEGORI[i];
                    KATEGORI_KIRIMAN = dataList;
                    FLAG_CHARGE = KATEGORI_KIRIMAN.FLAG_CHARGE;
                }
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    $scope.selCategory = function () {
        var data = JSON.parse($scope.kategoriKiriman);
        if (data.FLAG_CHARGE === 'YES') {
            $("#divBeaMasuk").show();
            $('#divBemasukStamp').show();
        } else {
            $("#divBeaMasuk").hide();
            $('#divBemasukStamp').hide();
        }
    };
    $scope.forProduct = function () {
        $scope.getPostCode();
        $scope.getPembayaran();
    };
    $scope.showProduct = function () {
        DATA_PRODUCT = {};
        $.LoadingOverlay("show");
        berat = getBerat();
        console.log($scope.kategoriKiriman);
        if ($scope.kategoriKiriman !== null) {
            var category = JSON.parse($scope.kategoriKiriman);
            var vID_KATEGORI = category.ID_KATEGORI;
            var vPERSENTASE_BIAYA_CHARGES = category.PERSENTASE_BIAYA_CHARGES;
            var vNAMA_KATEGORI = category.NAMA_KATEGORI;
        }
        var paramProduct = {
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xorigin: DATA_USER.ID_ORIGIN,
            xdestination: ID_DES_PENERIMA,
            xuserid: DATA_USER.ID_USER,
            xtipeuser: DATA_USER.TIPE_USER,
            xparam: 'getproduct',
            xberat: berat,
            xzona: getCookie('_zona'),
            xclrorigin: DATA_USER.FREEPORT_ORIGIN,
            xclrdes: FREEPORT_ORIGIN_PENERIMA,
            xlatorigin: getCookie('_lat'),
            xlonorigin: getCookie('_lot'),
            xlatlon: $('#xlatlot').val(),
            xidkategorikiriman: vID_KATEGORI,
            xnilaibeabarang: $scope.nilaiBeaCukai,
            xbeamasuk: vPERSENTASE_BIAYA_CHARGES,
            xdescriptionkategori: vNAMA_KATEGORI
        };
        doPost($http, 'myexweb.exgetproduct?', paramProduct, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $("#myProduk").modal('show');
                $('#header-product').empty();
                $scope.dummy1 = result.KOMBINASI;
                var dictionary = $scope.dummy1;
                $scope.dummy2 = [];
                var headerProduct = [];
                var results = dictionary;
                function getValueByKey(key, dictionary) {
                    var i, len = dictionary.length;
                    for (i = 0; i < len; i++) {
                        if (dictionary[i] && dictionary[i].hasOwnProperty(key)) {
                            return dictionary[i][key];
                        }
                    }

                    return -1;
                }
                for (var i = 0; i < results.length; i++) {
                    var columnsIn = results[i];
                    for (var key in columnsIn) {
                        headerProduct.push(key);
                        $scope.dummy2.push(getValueByKey(key, dictionary));
                    }
                }
                ;
                ProductDetail = $scope.dummy2;
                var item = [];
                $.each(headerProduct, function (j, header) {
                    item += '<tr style="background: #F08B30;color:white;">';
                    item += '<td style="background: transparent;"><b></b></td>';
                    item += '<td style="background: transparent;"><b>' + header + '</b></td>';
                    item += '<td style="background: transparent;"><b></b></td>';
                    item += '</tr>';
                    $.each(ProductDetail[j], function (l, val) {
                        item += '<tr onclick="getIdProduct(ProductDetail[' + j + '][' + l + '])">';
                        item += '<td style="width: 20px;;">';
                        item += '<img src="' + val.LINK_ICON + '" class="img-product" alt="icon"/>';
                        item += '<p><b>&nbsp;' + val.KODE_PRODUK + '</b></p>';
                        item += '</td>';
                        item += '<td>';
                        item += '<p><b> Keterangan :&nbsp;' + val.DESKRIPSI_PRODUK + '</b></p>';
                        item += '<p><b> Ongkir Cash :&nbsp;' + val.ONGKIR_CASH + '</b></p>';
                        item += '<p><b> Ongkir Saving :&nbsp;' + val.ONGKIR_SAVING + '</b></p>';
                        //                            item += '<p><b> Discount Volume :&nbsp;' + val.DISKON + '</b></p>';
                        item += '</td>';
                        item += '</tr>';
                    });
                });
                $('#header-product').append(item);
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    //GET SERVICE
    $scope.showServices = function () {
        serviceList = [];
        $.LoadingOverlay("show");
        var paramServices = {
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xorigin: DATA_USER.ID_ORIGIN,
            xdestination: ID_DES_PENERIMA,
            xberat: berat,
            xuserid: DATA_USER.ID_USER,
            xtipeuser: DATA_USER.TIPE_USER,
            xuseridperusahaan: '',
            xtipejenisproduk: DATA_PRODUCT.TIPE_JENIS_PRODUK,
            xparam: 'exservices',
            xtipeorgdes: DATA_USER.ID_ORIGIN,
            xidplatform: '2',
            xidproduk: DATA_PRODUCT.KODE_PRODUK,
            xtipekiriman: '',
            xiuserpenerima: $scope.noPonsel,
            xrealmde: DATA_PRODUCT.DE_DATE,
            xrealday: DATA_PRODUCT.MDE_DAY_REAL,
            xzona: getCookie('_zona'),
            xisstamp: 'NO'
        };
        doPost($http, 'myexweb.exservices?', paramServices, function (result) {
            // INS,COD,OPD
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataServices = result.LIST_SERVICES;
                $scope.hargaService = $scope.DataServices.HARGA;
                $("#service").modal('show');
                $('#product-service').empty();
                DATA_SERVICE.push(result.LIST_SERVICES);
                ProductService = DATA_SERVICE[0];
                var items = [];
                $('input:checkbox').removeAttr('checked');
                $.each(DATA_SERVICE[0], function (l, val) {
                    items += '<tr class="tr-width">';
                    items += '<td style="width: 10px;">';
                    if (val.DISABLE !== 'disable') {
                        items += '<div class="checkbox checkbox-custom">';
                        items += '<label>';
                        items += '<input type="checkbox" id="' + val.KODE_JENIS_SERVICES + '" value="' + val.KODE_JENIS_SERVICES + '" onclick="getListServiceKirim(ProductService[' + l + '],this.value)"' + val.CHECKLIST + '>';
                        items += '<span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>';
                        items += '</label>';
                        items += '</div>';
                    } else {
                        items += '<div class="checkbox checkbox-custom">';
                        items += '<label>';
                        items += '<span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>';
                        items += '</label>';
                        items += '</div>';
                    }
                    items += '</td>';
                    items += '<td style="width: auto;">';
                    items += '<img src="' + val.LINK_ICON + '" class="img-product" alt="icon"/>';
                    items += '<p><b>&nbsp;' + val.KODE_JENIS_SERVICES + '</b></p>';
                    items += '</td>';
                    items += '<td>';
                    items += '<p><b> ' + val.NAMA_JENIS_SERVICES + '</b></p>';
                    items += '<p><b> Biaya :&nbsp;' + val.HARGA + '</b></p>';
                    if (val.IS_INPUT === '1' & val.KODE_JENIS_SERVICES !== 'INS') {
                        items += '<p><b>Nilai Kiriman : </b><input type="text" class="form-control form-control-custom" id="info" onfocusout="getInfo(this.value)" onkeyup="setInsurance(this.value)" disabled="true"></p>';
                    } else if (val.KODE_JENIS_SERVICES === 'INS') {
                        items += '<p><b>Nilai Kiriman : </b><input type="text" class="form-control form-control-custom" id="infoins" onfocusout="getInfo(this.value)"   disabled="true"></p>';
                    }
                    items += '</td>';
                    items += '</tr>';
                });
                $('#product-service').append(items);
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.closeService = function () {
        if (DATA_PRODUCT.TRANSPORT_UDARA === 'YES') {
            $('#isikiriman').show();
        } else {
            $('#isikiriman').hide();
        }
        postService();
        $(document).ready(function () {
            $("#myProduk").modal('hide');
            $("#service").modal('hide');
        });
        $scope.getPembayaran();
    };
    $scope.getPembayaran = function () {
        //        $.LoadingOverlay("show");
        var paramTipePembayran = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: getCookie('token'),
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xuseridexact: ID_USER,
            xusertype: TIPE_USER,
            xzona: getCookie('_zona'),
            xsaldosaving: DATA_USER.SALDO_TERAKHIR,
            xongkir: HARGA,
            xlistservice: listService,
            xidorigin: ID_KODE_POS_ORIGIN_PENERIMA,
            xiddes: ID_DES_PENERIMA,
            xtokenongkir: DATA_PRODUCT.TOKEN_ONGKIR
        };
        doPost($http, 'myexweb.exgettipepembayaran?', paramTipePembayran, function (result) {
            if (result.STATUS === 'OK') {
                //                $.LoadingOverlay("hide");
                $scope.DataPembayaran = result.TIPE_PEMBAYARAN;
                $('#jenispembayaran').show();
            } else {
                //                $.LoadingOverlay("hide");
            }
        });
    };
    //    $scope.$watch('DataPembayaran', function (newValue, oldValue) {
    //        $scope.DataPembayaran = $scope.Pembayaran;
    //        console.log($scope.DataPembayaran);
    //    });
    ///GET BAG INV
    $scope.getBangInvoice = function () {
        if ($scope.akun === 'PERUSAHAAN') {
            $.LoadingOverlay("show");
            var dataBagInvoice = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xuseridcorp: getCookie('iduser'),
                xzona: getCookie('_zona')
            };
            doPost($http, 'myexweb.exgetkuasainv?', dataBagInvoice, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $scope.DataBagInvoice = result.DATA;
                }
            });
        } else {
            $.LoadingOverlay("hide");
        }
        ;
    };
    $scope.clearFormKirim = function () {
        var frm = document.getElementsByName('kirim-form')[0];
        frm.submit(); // Submit the form
        frm.reset(); // Reset all form data
        return false; // Prevent page refresh
    };
    // POST MANIFEST
    function getBagInvoice() {
        var bagInvoice;
        if ($scope.bagInvoice === undefined) {
            bagInvoice = idBagInvoice;
        } else {
            bagInvoice = $scope.bagInvoice;
        }

        return bagInvoice;
    }

    function getJenisPembayaran() {
        var jenis;
        if ($scope.jenisPembayaran === undefined || $scope.jenisPembayaran === null) {
            jenis = 5;
        } else {
            jenis = $scope.jenisPembayaran;
        }
        ;
        return jenis;
    }

    function getPonsel() {
        var noponsel;
        if ($scope.noPonsel === undefined || $scope.noPonsel === null) {
            noponsel = $('#noponsel').val();
        } else {
            noponsel = $scope.noPonsel;
        }
        ;
        return noponsel;
    }

    $scope.simpanAlamat = function (kode) {
        return kode;
    };

    $scope.checkSaldoSaving = function () {
        var vresult = 'OK';
        if (getJenisPembayaran() === 2) {
            var param = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xuseridcorp: getCookie('iduser'),
                xzona: getCookie('_zona'),
                xsaldolokal: SALDO
            };
            doPost($http, 'myexweb.exvalsaving?', param, function (result) {
                if (result.STATUS === 'OK') {
                    vresult = result.STATUS;
                } else {

                }
                ;
            });
        }
        ;

        return vresult;
    };
    $scope.postManifest = function () {
        initGeolocation();
        $scope.getLocalPostcode();
        if (DATA_PRODUCT === '' || DATA_PRODUCT === undefined) {
            $.alert({
                title: 'Warning!',
                content: 'Anda belum memilih tanggal tiba!'
            });
        } else if (getJenisPembayaran() === null || getJenisPembayaran() === '' || getJenisPembayaran() == undefined) {
            // if ($scope.checkSaldoSaving() === 'OK') {
            $.alert({
                title: 'Warning!',
                content: 'Anda belum memilih tipe pembayaran!'
            });
            // } else {
            //     $.alert({
            //         title: 'Warning!',
            //         content: 'Maaf saldo saving anda tidak mencukupi!'
            //     });
            // }
        } else {
            saveManifest();
        };
    };
    /// POST MANIFEST
    function saveManifest() {
        $.LoadingOverlay("show");
        if ($scope.berat1 === undefined) {
            $scope.berat1 = 0;
        }
        if ($scope.berat2 === undefined) {
            $scope.berat2 = 0;
        }
        if ($scope.berat3 === undefined) {
            $scope.berat3 = 0;
        }
        if ($scope.berat4 === undefined) {
            $scope.berat4 = 0;
        }
        var totalBeratKg = parseFloat($scope.berat1) + parseFloat($scope.berat2) + parseFloat($scope.berat3) + parseFloat($scope.berat4);
        if ($scope.kategoriKiriman !== null) {
            var category = JSON.parse($scope.kategoriKiriman);
            var vID_KATEGORI = category.ID_KATEGORI;
            var vPERSENTASE_BIAYA_CHARGES = category.PERSENTASE_BIAYA_CHARGES;
            var vNAMA_KATEGORI = category.NAMA_KATEGORI;
        }
        var dataManifest = {
            xuserid: ID_USER,
            xnoorder: $scope.noorder,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xtokenz: getCookie('token'),
            xuseridperusahaan: getCookie('iduser'),
            xuseridpengirim: DATA_USER.ID_USER,
            xmultiobject: berat,
            xtotalberat: totalBeratKg,
            xberat: totalBeratKg,
            xtotalharga: DATA_PRODUCT.ONGKIR_SAVING,
            xproduk: DATA_PRODUCT.ID_PRODUK,
            xjanjitiba: DATA_PRODUCT.COM_DATE,
            xdaftarservis: getDataSevice(),
            xidkategorikiriman: vID_KATEGORI,
            xnilaibeabarang: $scope.nilaiBeaCukai,
            xidkodepostujuan: ID_KODE_POS_DES_PENERIMA,
            xzonatujuan: DATA_PENERIMA.ZONA_DES,
            xtipealamatpenerima: '',
            xnamapenerima: $('#namapenerima').val(),
            xalamattujuan: $('#alamat').val(),
            xidtujuan: ID_DES_PENERIMA,
            xidorigin: DATA_USER.ID_ORIGIN,
            xidkodepos: $('#kodepos').val(),
            xkodepostujuan: $('#kodepos').val(),
            xuserpenerima: PHONE_PENERIMA.result,
            xparam: 'manifest',
            xketerangan: 'OK',
            xhargapembayaran: parseFloat(DATA_PRODUCT.ONGKIR_SAVING) + parseFloat(DATA_SERVICE.HARGA) + parseFloat($scope.nilaiBeaCukai), // saldo saving - jumlah pembayaran
            xtipepembayaran: getJenisPembayaran(),
            xsendfrom: 'W',
            xnohppenerima: getPonsel(),
            xisikiriman: $scope.isiKiriman,
            xfreeportorigin: DATA_USER.FREEPORT_ORIGIN,
            xfreeportdes: DATA_PENERIMA.FREEPORT_TUJUAN,
            xbeamasuk: vPERSENTASE_BIAYA_CHARGES,
            xlatorigin: getCookie('_lat'),
            xlonorigin: getCookie('_lot'),
            xidbaginv: getBagInvoice(),
            xkodeposmanifest: localPostcode.result,
            xdataalamatlain: DATA_PENGIRIM_LAIN.result,
            xdataalamat: DATA_USER,
            xtokenongkir: DATA_PRODUCT.TOKEN_ONGKIR,
            xsimpanalamat: $scope.simpanalamat,
            xdatazona: DATA_PENERIMA,
            xnamaperusahaan: $('#namaperusahaan').val(),
            xuserinvoice: userInvoice.result,
            xlatlon: $('#xlatlot').val()
        };
        doPost($http, 'myexweb.exmanifest?', dataManifest, function (result) {
            $scope.resultManifest = result;
            //            var NomerKiriman = [];
            if (result.STATUS === "OK") {
                $.LoadingOverlay("hide");
                var url = result.LINK_PRINT;
                //                for (var i = 0; i < result.NO_KIRIMAN.length; i++) {
                //                    NomerKiriman.push('Nomer Kiriman = ' + result.NO_KIRIMAN[i].ID_KIRIMAN + '<br>');
                //                }
                var contentModal = '<table class="table">' +
                    ' <thead>' +
                    '  <tr>' +
                    '  <th style="width: 200px;"></th>' +
                    ' <th></th>' +
                    ' </tr>' +
                    ' </thead>' +
                    ' <tbody>' +
                    '  <tr>' +
                    '   <td>Produk</td>' +
                    '   <td><b>' + result.PRODUK + '</b></td>' +
                    ' </tr>' +
                    ' <tr>' +
                    '  <td>Kota Tujuan</td>' +
                    '  <td>' + result.KOTA_TUJUAN + '</td>' +
                    ' </tr>' +
                    ' <tr>' +
                    '   <td>Nama Penerima</td>' +
                    '   <td>' + result.NAMA_PENERIMA + '</td>' +
                    '  </tr>' +
                    ' <tr>' +
                    ' <td>Pembayaran</td>' +
                    ' <td>' + result.PEMBAYARAN + '</td>' +
                    '  </tr>' +
                    '  <tr>' +
                    '   <td>Total Berat</td>' +
                    '  <td>' + result.TOTAL_BERAT + '</td>' +
                    ' </tr>' +
                    '</tbody>' +
                    ' </table>' +
                    ' <hr>' +
                    ' <table class="table">' +
                    ' <thead>' +
                    ' <tr>' +
                    '  <th style="width: 200px;"></th>' +
                    '  <th></th>' +
                    ' </tr>' +
                    ' </thead>' +
                    '<tbody>' +
                    ' <tr>' +
                    '  <td>Ongkir</td>' +
                    ' <td>' + result.ONGKIR + '</td>' +
                    ' </tr>' +
                    ' <tr>' +
                    '  <td>Discount</td>' +
                    ' <td>' + parseFloat(result.DISKON_PROMO) + '</td>' +
                    ' </tr>' +
                    ' <tr>' +
                    ' <td>Penerus</td>' +
                    '  <td>' + parseFloat(result.BIAYA_TAMBAHAN) + '</td>' +
                    '</tr>' +
                    ' <tr>' +
                    ' <td>Lain</td>' +
                    ' <td>' + result.LAIN + '</td>' +
                    '</tr>' +
                    ' <tr>' +
                    '  <td>PPN</td>' +
                    '  <td>' + result.PPN + '</td>' +
                    ' </tr>' +
                    ' <tr>' +
                    ' <td>Biaya Kirim</td>' +
                    ' <td>' + result.BIAYA_KIRIM + '</td>' +
                    '</tr>' +
                    '</tbody>' +
                    '</table>';
                $.confirm({
                    title: '',
                    content: contentModal + '<br> Terima Kasih Telah Mempercayakan Kiriman Anda kepada Exact',
                    buttons: {
                        ok: function () {
                            if (url !== null | url !== '') {
                                window.open(url, '_blank');
                                dataManifest = {};
                                $state.go("/");
                            } else {
                                $.alert({
                                    title: 'Error!',
                                    content: 'Terjadi kesalahan saat cetak label!'
                                });
                                $state.go("/");
                            }
                        }
                    }
                });
                $state.go("/");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $state.go("/");
            }
            $state.go("/");
        });
    }
    ;
    //////////////////////////////==KIRIM==///////////////////////////////////////////////
    $scope.getParamCari = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: LOGIN_FROM,
            xstatuskirim: 'MANIFEST',
            xzona: getCookie('_zona'),
            xmenu: 'kirim'
        };
        doPost($http, 'myexweb.exloadsearching?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.paramKirim = result.LIST_SEARCH;
            } else {
            }

        });
    };
    $scope.getDataKiriman = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: LOGIN_FROM,
            xuseridexact: getCookie('iduser'),
            xstatuskirim: 'MANIFEST',
            xzona: getCookie('_zona'),
            xnamakolom: $scope.kolom,
            xvalue: $scope.cari
        };
        doPost($http, 'myexweb.exgetkiriman?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataKirim = result.DATA;
                for (var z = 0; z < $scope.DataKirim.length; z++) {
                    var namPerusahaan = $scope.DataKirim[z].PERUSAHAAN_PENERIMA;
                    var namPenerima = $scope.DataKirim[z].NAMA_PENERIMA;
                    if (namPerusahaan === '' || namPenerima === undefined) {
                        $scope.DataKirim[z].PENERIMA = namPenerima;
                    } else {
                        $scope.DataKirim[z].PENERIMA = namPerusahaan;
                    }
                }
                ;
            } else {
                $.LoadingOverlay("hide");
            }

        });
    };
    $scope.getTotal = function () {
        var total = 0;
        // for(var i = 0; i < $scope.DataKirim.length; i++){
        //     var product = $scope.DataKirim.TIPE_PEMBAYARAN;
        //     total += product.price;
        // }
        return total;
    }
    console.log($scope.getTotal());
    // TABLE DATA KIRIM
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.cari = '';

    $scope.getData = function () {
        return $filter('filter')($scope.DataKirim, $scope.cari)
    }
    $scope.numberOfPages = function () {
        if ($scope.getData() !== undefined) {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }
    }
    $scope.prevPage = function () {
        if ($scope.currentPage <= $scope.numberOfPages() && $scope.currentPage !== 0) {
            $scope.currentPage = $scope.currentPage - 1;
        } else {
            $('#prevPage').prop('disabled', true);
        }
    }
    $scope.nextPage = function () {
        if ($scope.numberOfPages() >= $scope.currentPage) {
            $scope.currentPage = $scope.currentPage + 1;
        } else {
            $('#prevPage').prop('disabled', true);
        }
    }
    //    console.log(numberOfPagesKirim());
    $scope.showDetailKiriman = function (data) {
        $('#detailKiriman').modal('show');
        $scope.detailNoKiriman = data.DETAIL_PCS;
        $('#tanggalkirim').val(data.TANGGAL_CATAT);
        $('#pengguna').val(data.PENGGUNA);
        $('#produk').val(data.DETAIL[0].PRODUK);
        $('#pembayaran').val(data.DETAIL[0].PEMBAYARAN);
        $('#totalcod').val(data.DETAIL[0].TOTAL_COD);
        $('#janjitiba').val(data.COMDATE);
        $('#service').val(data.COMDATE);
        $('#service').val(data.COMDATE);
        $('#pcs').val(data.PCS);
        $('#berat').val(data.TOTAL_BERAT);
        // DATA PENERIMA
        $('#namapenerima').val(data.NAMA_PENERIMA);
        $('#perusahaanpenerima').val(data.PERUSAHAAN_PENERIMA);
        $('#alamatpenerima').val(data.ALAMAT_PENERIMA);
        $('#kodepospenerima').val(data.KODE_POS_TUJUAN);
        $('#kotapenerima').val(data.DETAIL[0].KOTA_TUJUAN);
        $('#notlppenerima').val(data.DETAIL[0].NO_HP_PENERIMA);
        // DATA PENGIRIM
        $('#namapengirim').val(data.NAMA_PENGIRIM);
        $('#perusahaanpengirim').val(data.PERUSAHAAN_PENGIRIM);
        $('#alamatpengirim').val(data.ALAMAT_PENGIRIM);
        $('#kodepospengirim').val(data.POS_PENGIRIM);
        $('#kotapengirim').val(data.KOTA_PENGIRIM);
        $('#notlppengirim').val(data.DETAIL[0].NO_HP_PENERIMA);
        dataNoKiriman = data.DETAIL_PCS;

        $('#table-reprint').empty();
        var items = [];
        $.each(data.DETAIL_PCS, function (l, val) {
            items += '<tr>';
            items += '<td>';
            items += '<label><input type="checkbox" onclick="getReKiriman(dataNoKiriman[' + l + '])"><span></span> ' + val.ID_KIRIMAN + '</label>';
            items += '</td>';
            items += '</tr>';
        });
        $('#table-reprint').append(items);

    };

    var windowObjectReference;
    var strWindowFeatures = "menubar=yes,location=yes,resizable=yes,scrollbars=yes,status=yes";
    $scope.rePrint = function () {
        if (dataNoKiriman.length > 1) {
            rePrintKirim = [];
            $('input:checkbox').removeAttr('checked');
            $('#reprint').modal('show');
        } else {
            var xdata = {
                xdata: dataNoKiriman[0].ID_KIRIMAN
            };
            $.LoadingOverlay("show");
            var param = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xlistkiriman: xdata,
                xzona: getZona('_zona')
            };
            doPost($http, 'myexweb.exreprint?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    var url = result.LINK;
                    windowObjectReference = window.open(url, "Re-print", strWindowFeatures);
                    $('#reprint').modal('hide');
                    $('#detailKiriman').modal('hide');
                    xdata = {};
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

    $scope.postRePrint = function () {
        console.log(rePrintKirim);
        $.LoadingOverlay("show");
        var param = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xlistkiriman: dataReKiriman(),
            xzona: getZona('_zona')
        };
        doPost($http, 'myexweb.exreprint?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                var url = result.LINK;
                windowObjectReference = window.open(url, "Re-print", strWindowFeatures);
                $('#reprint').modal('hide');
                rePrintKirim = [];
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }

        });
    };
});
// STAMP CONTROLLER
var slocalPostcode = {};
var sDATA_PENERIMA;
var sFREEPORT_ORIGIN;
var sIdOrigin = {};
var idKota = {};
app.controller('stampController', function ($scope, $http, $state) {
    var DATA_USER = JSON.parse(localStorage._usrdta_);
    ///GET TIPE STAMP
    $scope.initStamp = function () {
        $('#divStamp').hide();
        $('#divBemasukStamp').hide();
        $('#divNoKiriman').hide();
        $('#divDetailStamp1').hide();
        $('#divDetailStamp2').hide();
        $('#divBagian').hide();
        $('#divInvoice').hide();
        $('#divcorp').hide();
        $("#divBeaMasuk").hide();
        $('#divPos').hide();
        $('#divNoPonsel').hide();
        $('#divIsiKiriman').hide();
        $('#beratInfo').hide();
        $scope.jumlahPaket = '1';
        $scope.berat1 = '0';
        $scope.panjang1 = '0';
        $scope.lebar1 = '0';
        $scope.tinggi1 = '0';
        $scope.berat2 = '0';
        $scope.panjang2 = '0';
        $scope.lebar2 = '0';
        $scope.tinggi2 = '0';
        $scope.tinggi3 = '0';
        $scope.berat3 = '0';
        $scope.panjang3 = '0';
        $scope.lebar3 = '0';
        $scope.tinggi3 = '0';
        $scope.berat4 = '0';
        $scope.panjang4 = '0';
        $scope.lebar4 = '0';
        $scope.tinggi4 = '0';
        $scope.jumlahPaket = '1';
        $scope.hideJumlahPaket();
        $scope.hideVolume();
        if ($scope.jumlahPaket > 1) {
            $scope.max = 35;
        }
        ;
        getLocalPostcode();
    };
    onDivDetailCorp();
    function onDivDetailCorp() {
        if (DATA_USER.xtipe === 'CORPORATE') {
            $('#divdetailcorp').show();
        } else {
            $('#divdetailcorp').hide();
        }
    }
    $scope.getTipeStamp = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: DATA_USER.xuserid,
            xtoken: DATA_USER.xtoken,
            xkodeuser: DATA_USER.xemail,
            xloginfrom: DATA_USER.xlogin,
            xparam: 'getstamp',
            xzona: getZona('_zona')
        };
        doPost($http, 'myexweb.exgettypestamp?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listStamp = result.DATA;
                for (var i = 0; i < $scope.listStamp.length; i++) {
                    var dataList = result.DATA[i];
                    dataStamp[dataList.ID_JENIS_STAMP] = dataList.IS_RETURN;
                }
            } else {
                $.LoadingOverlay("hide");
            }

        });
    };
    $scope.clickStamp = function (id_stamp) {
        var data = $scope.tipeStamp;
        if (data === '3') {
            $('#divNoKiriman').show();
            $('#divPenerima').hide();
            $('#divDetailStamp1').hide();
            $('#divDetailStamp2').hide();
            $('#divcorp').show();
            $('#divPos').hide();
        } else if (data === '1') {
            $('#divNoKiriman').hide();
            $('#divPenerima').show();
            $('#divDetailStamp1').show();
            $('#divDetailStamp2').show();
            $('#divPos').show();
        } else {
            $('#divNoKiriman').hide();
            $('#divPenerima').hide();
            $('#divDetailStamp1').show();
            $('#divDetailStamp2').show();
            $('#divPos').hide();
        }
    };

    $scope.clickTipe = function () {
        if ($scope.tipePengirim === 'P') {
            $('#divcorp').hide();
            $('#divNoPonsel').show();
        } else {
            $('#divcorp').show();
            $('#divNoPonsel').hide();
        }
    };

    $scope.checkCodeUser = function () {
        $.LoadingOverlay("show");
        if ($scope.tipePengirim === 'U') {
            var param = {
                xkodekorp: $scope.tipecode,
                xuserid: DATA_USER.xuserid,
                xtoken: DATA_USER.xtoken
            };
            doPost($http, 'myexweb.excheckcorp?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $scope.namaCorp = result.DATA_KORP.NAMA_PERUSAHAAN;
                    idKota.result = result.DATA_KORP.ID_KOTA;
                    $scope.kotaAsal = result.DATA_KORP.NAMA_KOTA;
                    $scope.kodePrusahaan = result.DATA_KORP.ID_PERUSAHAAN;
                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error',
                        content: result.ERROR
                    });
                }
            });
        } else {
            var param = {
                xkodekorp: $scope.tipecode,
                xuserid: DATA_USER.xuserid,
                xtoken: DATA_USER.xtoken
            };
            doPost($http, 'myexweb.excheckcorp?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");

                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error',
                        content: result.ERROR
                    });
                }
            });
        }
    };
    $scope.getKota = function () {
        if ($scope.kotaAsal.length > 4) {
            $.LoadingOverlay("show");
            var param = {
                xuserid: DATA_USER.xuserid,
                xtoken: DATA_USER.xtoken,
                xkodeuser: DATA_USER.xemail,
                xloginfrom: DATA_USER.xlogin,
                xlat: getCookie('_lat'),
                xlon: getCookie('_lot'),
                xkota: $scope.kotaAsal
            };
            doPost($http, 'myexweb.exgetkota?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $scope.titles = result.LIST_KOTA;
                    idKota.result = result.LIST_KOTA[0].ID_KOTA;
                    sIdOrigin.result = result.LIST_KOTA[0].ID_ORIGIN;
                } else {
                    $.LoadingOverlay("hide");
                }
            });
        }
    }

    function getLocalPostcode() {
        $.LoadingOverlay("show");
        var paramCode = {
            xuserid: DATA_USER.xuserid,
            xtoken: DATA_USER.xtoken,
            xkodeuser: DATA_USER.xemail,
            xloginfrom: DATA_USER.xlogin,
            xlat: getCookie('_lat'),
            xlon: getCookie('_lot')
        };
        doPost($http, 'myexweb.exgetpostal?', paramCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                slocalPostcode.result = result.KODE_POS;
            } else {
                $.LoadingOverlay("hide");
                setTimeout(function () {
                    $.alert({
                        title: 'Error!',
                        content: result.ERROR + '<br> Silahkan aktifkan kembali GPS browser anda'
                    });
                }, 1000);

                $state.go("/");
            }
        });
    }
    ;
    $scope.getPostCode = function () {
        $scope.kodepos = document.getElementById("kodepos").value;
        if ($scope.kodepos.length > 4) {
            $.LoadingOverlay("show");
            var param = {
                xuserid: DATA_USER.xuserid,
                xtoken: DATA_USER.xtoken,
                xkodeuser: DATA_USER.xemail,
                xloginfrom: DATA_USER.xlogin,
                xpostalcodeorigin: slocalPostcode.result, // get from local postcode login aplikasi
                xpostalcodedes: $scope.kodepos,
                xparam: 'getpostalcode',
                xlat: getCookie('_lat'),
                xlon: getCookie('_lot'),
                xzona: getCookie('_zona')
            };
            doPost($http, 'myexweb.exgetzona?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    DATA_PENERIMA = result;
                    DATA_PENERIMA = sFREEPORT_ORIGIN
                    if (DATA_PENERIMA.FREEPORT_TUJUAN === 'Y' && DATA_PENERIMA.FREEPORT_ORIGIN === 'Y') {
                        $("#divCategory").hide();
                        $("#divBeaMasuk").hide();
                    } else {
                        $("#divCategory").show();
                    }
                    if (result.ZONA_DES === '3' || result.ZONA_DES === '2') {
                        $('#infopos').show();
                        $('#infopos').text('Tambahan biaya penerus');
                    } else if (result.ZONA_DES === '4') {
                        $('#infopos').show();
                        $('#infopos').text('Nondelivery/Ambil di exact');
                    } else if (result.ZONA_DES) {
                        $('#infopos').hide();
                        $('#infopos').text('');
                    }

                    $scope.kota = result.NAMA_KOTA_DES;
                    if (result.ZONA_DES === '3' || result.ZONA_DES === '2') {
                        $('#infopos').show();
                        $('#infopos').text('* Tambahan biaya penerus');
                    } else if (result.ZONA_DES === '4') {
                        $('#infopos').show();
                        $('#infopos').text('* Non Delivery/Ambil di exact');
                    } else if (result.ZONA_DES) {
                        $('#infopos').hide();
                        $('#infopos').text('');
                    }
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
    //Block berat Operation
    $scope.hideJumlahPaket = function () {
        $('#berat2').hide();
        $('#berat3').hide();
        $('#berat4').hide();
    };
    $scope.onJumlah = function () {
        if ($scope.jumlahPaket > 1) {
            $scope.max = 35;
            $('#beratInfo').show();
            $scope.berat2 = 0;
            $scope.berat3 = 0;
            $scope.berat4 = 0;
            jumlahBerat();
        } else {
            $scope.max = '';
            $('#beratInfo').hide();
            jumlahBerat();
        }
        ;
        if ($scope.jumlahPaket === '2') {
            $('#berat2').show();
            $('#berat3').hide();
            $('#berat4').hide();
            $scope.berat3 = 0;
            $scope.berat4 = 0;
            jumlahBerat();
            $scope.hideVolume();
        } else if ($scope.jumlahPaket === '3') {
            $('#berat2').show();
            $('#berat3').show();
            $('#berat4').hide();
            $scope.berat4 = 0;
            $scope.hideVolume();
            jumlahBerat();
        } else if ($scope.jumlahPaket === '4') {
            $('#berat2').show();
            $('#berat3').show();
            $('#berat4').show();
            jumlahBerat();
            $scope.hideVolume();
        } else {
            $scope.hideJumlahPaket();
            $scope.hideVolume();
            jumlahBerat();
        }

        jumlahBerat();
    };
    $scope.checkJumlah = function () {
        if ($scope.jumlahPaket === 2) {
            $('#berat2').show();
            $('#berat3').hide();
            $('#berat4').hide();
            $scope.hideVolume();
            jumlahBerat();
        } else if ($scope.jumlahPaket === 3) {
            $('#berat2').show();
            $('#berat3').show();
            $('#berat4').hide();
            $scope.hideVolume();
            jumlahBerat();
        } else if ($scope.jumlahPaket === 4) {
            $('#berat2').show();
            $('#berat3').show();
            $('#berat4').show();
            $scope.hideVolume();
            jumlahBerat();
        } else {
            $scope.hideJumlahPaket();
            $scope.hideVolume();
            jumlahBerat();
        }
        jumlahBerat();
    };
    $scope.hideVolume = function () {
        $('#volume1').hide();
        $('#volume2').hide();
        $('#volume3').hide();
        $('#volume4').hide();
        jumlahBerat();
    };
    function jumlahBerat() {
        if ($scope.berat1 === undefined || $scope.berat1 === '') {
            $scope.berat1 = 0;
        }
        if ($scope.berat2 === undefined || $scope.berat2 === '') {
            $scope.berat2 = 0;
        }
        if ($scope.berat3 === undefined || $scope.berat3 === '') {
            $scope.berat3 = 0;
        }
        if ($scope.berat4 === undefined || $scope.berat4 === '') {
            $scope.berat4 = 0;
        }
        var jumlah_berat = parseFloat($scope.berat1) + parseFloat($scope.berat2) + parseFloat($scope.berat3) + parseFloat($scope.berat4);
        $scope.jumlah_berat = jumlah_berat;
    }
    $scope.checkVolume = function () {
        if ($scope.jumlahPaket > '1' && $scope.berat1 >= '36') {
            $scope.max = 35;
            $.alert({
                title: 'Error!',
                content: 'Berat tidak boleh lebih besar dari 35 Kg'
            });
        }
        ;
        if ($scope.berat1 >= 1) {
            $('#volume1').show();
        } else {
            $('#volume1').hide();
        }
        if ($scope.berat2 >= 1) {
            $('#volume2').show();
        } else {
            $('#volume2').hide();
        }
        if ($scope.berat3 >= 1) {
            $('#volume3').show();
        } else {
            $('#volume3').hide();
        }
        if ($scope.berat4 >= 1) {
            $('#volume4').show();
        } else {
            $('#volume4').hide();
        }
        jumlahBerat();
    };
    function getBerat() {
        var berat = [];
        var totalberat = [];
        var totalBerat1 = {};
        var totalBerat2 = {};
        var totalBerat3 = {};
        var totalBerat4 = {};
        berat.length = 0;
        if ($scope.berat1 > 0) {
            if ($scope.berat1 >= 50) {
                var totalVolume = (parseFloat($scope.panjang1) * parseFloat($scope.lebar1) * parseFloat($scope.tinggi1)) / 6000;
                if (totalVolume > $scope.berat1) {
                    totalBerat1.data = totalVolume;
                } else {
                    totalBerat1.data = $scope.berat1;
                }
            } else {
                var totalVolume = (parseFloat($scope.panjang1) * parseFloat($scope.lebar1) * parseFloat($scope.tinggi1)) / 4000;
                if (totalVolume > $scope.berat1) {
                    totalBerat1.data = totalVolume;
                } else {
                    totalBerat1.data = $scope.berat1;
                }
            }
            var kg1 = {
                berat: totalBerat1.data,
                panjang: $scope.panjang1,
                lebar: $scope.lebar1,
                tinggi: $scope.tinggi1
            };
            totalberat.push(kg1);
        }

        if ($scope.berat2 > 0) {
            if ($scope.berat2 >= 50) {
                var totalVolume = (parseFloat($scope.panjang2) * parseFloat($scope.lebar2) * parseFloat($scope.tinggi2)) / 6000;
                if (totalVolume > $scope.berat2) {
                    totalBerat2.data = totalVolume;
                } else {
                    totalBerat2.data = $scope.berat2;
                }
            } else {
                var totalVolume = (parseFloat($scope.panjang2) * parseFloat($scope.lebar2) * parseFloat($scope.tinggi2)) / 4000;
                if (totalVolume > $scope.berat2) {
                    totalBerat2.data = totalVolume;
                } else {
                    totalBerat2.data = $scope.berat2;
                }
            }
            var kg2 = {
                berat: totalBerat2.data,
                panjang: $scope.panjang2,
                lebar: $scope.lebar2,
                tinggi: $scope.tinggi2
            };
            totalberat.push(kg2);
        }

        if ($scope.berat3 > 0) {
            if ($scope.berat3 >= 50) {
                var totalVolume = (parseFloat($scope.panjang3) * parseFloat($scope.lebar3) * parseFloat($scope.tinggi3)) / 6000;
                if (totalVolume > $scope.berat3) {
                    totalBerat3.data = totalVolume;
                } else {
                    totalBerat3.data = $scope.berat3;
                }
            } else {
                var totalVolume = (parseFloat($scope.panjang3) * parseFloat($scope.lebar3) * parseFloat($scope.tinggi3)) / 4000;
                if (totalVolume > $scope.berat3) {
                    totalBerat3.data = totalVolume;
                } else {
                    totalBerat3.data = $scope.berat3;
                }
            }
            var kg3 = {
                berat: totalBerat3.data,
                panjang: $scope.panjang3,
                lebar: $scope.lebar3,
                tinggi: $scope.tinggi3
            };
            totalberat.push(kg3);
        }

        if ($scope.berat4 > 0) {
            if ($scope.berat4 >= 50) {
                var totalVolume = (parseFloat($scope.panjang4) * parseFloat($scope.lebar4) * parseFloat($scope.tinggi4)) / 6000;
                if (totalVolume > $scope.berat4) {
                    totalBerat4.data = totalVolume;
                } else {
                    totalBerat4.data = $scope.berat4;
                }
            } else {
                var totalVolume = (parseFloat($scope.panjang4) * parseFloat($scope.lebar4) * parseFloat($scope.tinggi4)) / 4000;
                if (totalVolume > $scope.berat4) {
                    totalBerat4.data = totalVolume;
                } else {
                    totalBerat4.data = $scope.berat4;
                }
            }
            var kg4 = {
                berat: totalBerat4.data,
                panjang: $scope.panjang4,
                lebar: $scope.lebar4,
                tinggi: $scope.tinggi4
            };
            totalberat.push(kg4);
        }
        berat.push(totalberat);
        return berat;
    }
    ;
    $scope.valVolume = function () {
        var status = 0;
        if ($scope.berat1 >= 4 && $scope.panjang1 === '0' && $scope.tinggi1 === '0' && $scope.lebar1 === '0') {
            status = 0;
        } else {
            status = 1;
        }
        if ($scope.berat2 >= 4 && $scope.panjang2 === '0' && $scope.tinggi2 === '0' && $scope.lebar2 === '0') {
            status = 0;
        } else {
            status = 1;
        }
        if ($scope.berat3 >= 4 && $scope.panjang3 === '0' && $scope.tinggi3 === '0' && $scope.lebar3 === '0') {
            status = 0;
        } else {
            status = 1;
        }
        if ($scope.berat4 >= 4 && $scope.panjang4 === '0' && $scope.tinggi4 === '0' && $scope.lebar4 === '0') {
            status = 0;
        } else {
            status = 1;
        }

        return status;
    };

    // End block
    $scope.showProduct = function () {
        DATA_PRODUCT = {};
        var vID_KATEGORI;
        var vPERSENTASE_BIAYA_CHARGES;
        var vNAMA_KATEGORI;
        $.LoadingOverlay("show");
        if ($scope.kategoriKiriman !== null) {
            var category = JSON.parse($scope.kategoriKiriman);
            vID_KATEGORI = category.ID_KATEGORI;
            vPERSENTASE_BIAYA_CHARGES = category.PERSENTASE_BIAYA_CHARGES;
            vNAMA_KATEGORI = category.NAMA_KATEGORI;
        }
        var paramProduct = {
            xidkotapengirim: idKota.result,
            xtipestamp: $scope.tipeStamp,
            xidorigin: sIdOrigin.result,
            xidkodepospenerima: '',
            xuserid: DATA_USER.xuserid,
            xtoken: DATA_USER.xtoken,
            xkodeuser: DATA_USER.xemail,
            xloginfrom: DATA_USER.xlogin,
            xorigin: sIdOrigin.result,
            xtipeuser: DATA_USER.xtipe,
            xparam: 'getproduct',
            xberat: getBerat(),
            xzona: getCookie('_zona'),
            xclrorigin: sFREEPORT_ORIGIN,
            xclrdes: FREEPORT_ORIGIN_PENERIMA,
            xlatorigin: getCookie('_lat'),
            xlonorigin: getCookie('_lot'),
            xlatlon: $('#xlatlot').val(),
            xidkategorikiriman: vID_KATEGORI,
            xnilaibeabarang: $scope.nilaiBeaCukai,
            xbeamasuk: vPERSENTASE_BIAYA_CHARGES,
            xdescriptionkategori: vNAMA_KATEGORI
        };
        doPost($http, 'myexweb.exgetproductstamp?', paramProduct, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $("#myProduk").modal('show');
                $('#header-product').empty();
                $scope.dummy1 = result.KOMBINASI;
                var dictionary = $scope.dummy1;
                $scope.dummy2 = [];
                var headerProduct = [];
                var results = dictionary;
                function getValueByKey(key, dictionary) {
                    var i, len = dictionary.length;
                    for (i = 0; i < len; i++) {
                        if (dictionary[i] && dictionary[i].hasOwnProperty(key)) {
                            return dictionary[i][key];
                        }
                    }

                    return -1;
                }
                for (var i = 0; i < results.length; i++) {
                    var columnsIn = results[i];
                    for (var key in columnsIn) {
                        headerProduct.push(key);
                        $scope.dummy2.push(getValueByKey(key, dictionary));
                    }
                }
                ;
                ProductDetail = $scope.dummy2;
                var item = [];
                $.each(headerProduct, function (j, header) {
                    item += '<tr style="background: #F08B30;color:white;">';
                    item += '<td style="background: transparent;"><b></b></td>';
                    item += '<td style="background: transparent;"><b>' + header + '</b></td>';
                    item += '<td style="background: transparent;"><b></b></td>';
                    item += '</tr>';
                    $.each(ProductDetail[j], function (l, val) {
                        item += '<tr onclick="getIdProduct(ProductDetail[' + j + '][' + l + '])">';
                        item += '<td style="width: 20px;;">';
                        item += '<img src="' + val.LINK_ICON + '" class="img-product" alt="icon"/>';
                        item += '<p><b>&nbsp;' + val.KODE_PRODUK + '</b></p>';
                        item += '</td>';
                        item += '<td>';
                        item += '<p><b> Keterangan :&nbsp;' + val.DESKRIPSI_PRODUK + '</b></p>';
                        item += '<p><b> Ongkir Cash :&nbsp;' + val.ONGKIR_CASH + '</b></p>';
                        item += '<p><b> Ongkir Saving :&nbsp;' + val.ONGKIR_SAVING + '</b></p>';
                        //                            item += '<p><b> Discount Volume :&nbsp;' + val.DISKON + '</b></p>';
                        item += '</td>';
                        item += '</tr>';
                    });
                });
                $('#header-product').append(item);
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    //GET SERVICE
    $scope.showServices = function () {
        serviceList = [];
        $.LoadingOverlay("show");
        var paramServices = {
            xuserid: DATA_USER.xuserid,
            xtoken: DATA_USER.xtoken,
            xkodeuser: DATA_USER.xemail,
            xloginfrom: DATA_USER.xlogin,
            xorigin: DATA_PENERIMA.ID_ORIGIN,
            xdestination: ID_DES_PENERIMA,
            xberat: $scope.berat,
            xtipeuser: DATA_USER.xtipe,
            xtipejenisproduk: DATA_PRODUCT.TIPE_JENIS_PRODUK,
            xparam: 'exservices',
            xtipeorgdes: DATA_PENERIMA.ID_ORIGIN,
            xidplatform: '2',
            xidproduk: DATA_PRODUCT.KODE_PRODUK,
            xtipekiriman: '',
            xiuserpenerima: $scope.noPonsel,
            xrealmde: DATA_PRODUCT.DE_DATE,
            xrealday: DATA_PRODUCT.MDE_DAY_REAL,
            xzona: getCookie('_zona'),
            xisstamp: 'NO'
        };
        doPost($http, 'myexweb.exservices?', paramServices, function (result) {
            // INS,COD,OPD
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataServices = result.LIST_SERVICES;
                $scope.hargaService = $scope.DataServices.HARGA;
                $("#service").modal('show');
                $('#product-service').empty();
                DATA_SERVICE.push(result.LIST_SERVICES);
                ProductService = DATA_SERVICE[0];
                var items = [];
                $('input:checkbox').removeAttr('checked');
                $.each(DATA_SERVICE[0], function (l, val) {
                    items += '<tr class="tr-width">';
                    items += '<td style="width: 10px;">';
                    if (val.DISABLE !== 'disable') {
                        items += '<div class="checkbox checkbox-custom">';
                        items += '<label>';
                        items += '<input type="checkbox" id="' + val.KODE_JENIS_SERVICES + '" value="' + val.KODE_JENIS_SERVICES + '" onclick="getListServiceKirim(ProductService[' + l + '],this.value)"' + val.CHECKLIST + '>';
                        items += '<span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>';
                        items += '</label>';
                        items += '</div>';
                    } else {
                        items += '<div class="checkbox checkbox-custom">';
                        items += '<label>';
                        items += '<span class="cr"><i class="cr-icon glyphicon glyphicon-ok"></i></span>';
                        items += '</label>';
                        items += '</div>';
                    }
                    items += '</td>';
                    items += '<td style="width: auto;">';
                    items += '<img src="' + val.LINK_ICON + '" class="img-product" alt="icon"/>';
                    items += '<p><b>&nbsp;' + val.KODE_JENIS_SERVICES + '</b></p>';
                    items += '</td>';
                    items += '<td>';
                    items += '<p><b> ' + val.NAMA_JENIS_SERVICES + '</b></p>';
                    items += '<p><b> Biaya :&nbsp;' + val.HARGA + '</b></p>';
                    if (val.IS_INPUT === '1' & val.KODE_JENIS_SERVICES !== 'INS') {
                        items += '<p><b>Nilai Kiriman : </b><input type="text" class="form-control form-control-custom" id="info" onfocusout="getInfo(this.value)" onkeyup="setInsurance(this.value)" disabled="true"></p>';
                    } else if (val.KODE_JENIS_SERVICES === 'INS') {
                        items += '<p><b>Nilai Kiriman : </b><input type="text" class="form-control form-control-custom" id="infoins" onfocusout="getInfo(this.value)"   disabled="true"></p>';
                    }
                    items += '</td>';
                    items += '</tr>';
                });
                $('#product-service').append(items);
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.closeService = function () {
        if (DATA_PRODUCT.TRANSPORT_UDARA === 'YES') {
            $('#divIsiKiriman').show();
        } else {
            $('#divIsiKiriman').hide();
        }
        postService();
        $(document).ready(function () {
            $("#myProduk").modal('hide');
            $("#service").modal('hide');
        });
        $scope.getPembayaran();
    };
    //GET CATEGORY ISI KIRIMAN
    $scope.getCategory = function () {
        $.LoadingOverlay("show");
        var param = {
            xparam: 'getcategory'
        };
        doPost($http, 'myexweb.excategory?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataCategory = result.LIST_KATEGORI;
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    $scope.selCategory = function () {
        var kategori = JSON.parse($scope.kategoriKiriman);
        if (kategori !== null) {
            if (kategori.FLAG_CHARGE === 'YES') {
                $('#divBemasukStamp').show();
            } else {
                $('#divBemasukStamp').hide();
            }
        }
    };
    // POST STAMP
    $scope.postStamp = function () {
        if ($scope.berat1 === undefined) {
            $scope.berat1 = 0;
        }
        if ($scope.berat2 === undefined) {
            $scope.berat2 = 0;
        }
        if ($scope.berat3 === undefined) {
            $scope.berat3 = 0;
        }
        if ($scope.berat4 === undefined) {
            $scope.berat4 = 0;
        }
        var totalBeratKg = parseFloat($scope.berat1) + parseFloat($scope.berat2) + parseFloat($scope.berat3) + parseFloat($scope.berat4);
        if ($scope.kategoriKiriman !== null) {
            var category = JSON.parse($scope.kategoriKiriman);
            var vID_KATEGORI = category.ID_KATEGORI;
            var vPERSENTASE_BIAYA_CHARGES = category.PERSENTASE_BIAYA_CHARGES;
            var vNAMA_KATEGORI = category.NAMA_KATEGORI;
        }
        if (DATA_PRODUCT === '' || DATA_PRODUCT === undefined) {
            $.alert({
                title: 'Error!',
                content: 'Anda belum memilih Tanggal tiba!'
            });
        } else {
            $.LoadingOverlay("show");
            var dataManifest = {
                xuserid: DATA_USER.xuserid,
                xtoken: DATA_USER.xtoken,
                xmultiobject: getBerat(),
                xtotalberat: totalBeratKg,
                xberat: totalBeratKg,
                xtipestamp: $scope.tipeStamp,
                xtipepengirim: $scope.tipePengirim,
                xkodeperusahaan: $scope.tipecode,
                xnohppengirim: $scope.noPonselPenerima,
                xnamaperusahaan: $scope.namaCorp,
                xnamakotapengirim: $scope.kotaAsal,
                xidkorppengirim: $scope.kodePrusahaan,
                xnoorder: $scope.noOrder,
                xisikiriman: $scope.isiKiriman,
                xinfotambahan: $scope.infoTambahan,
                xkodeuser: DATA_USER.xemail,
                xloginfrom: DATA_USER.xlogin,
                xparamz: 'buatstamp',
                xtipeuser: DATA_USER.xtipe,
                xuseridpembuat: DATA_USER.ID_USER,
                xnokirimanreturn: $scope.noKiriman,
                xkodepostujuan: $scope.kodepos,
                xkotatujuan: $scope.kota,
                xnamapenerima: $scope.namaPenerima,
                xnoponseltujuan: $scope.noPonselTujuan,
                xalamattujuan: $scope.alamat,
                xidkategori: $scope.kategoriKiriman,
                xnilaibeabarang: $scope.nilaiBeaCukai,
                xidproduct: DATA_PRODUCT.ID_PRODUK,
                xjanjitiba: DATA_PRODUCT.COM_DATE,
                xtokenongkir: DATA_PRODUCT.TOKEN_ONGKIR,
                xdaftarservis: getDataSevice(),
                xlatpembuat: getCookie('_lat'),
                xlonpembuat: getCookie('_lot'),
                xzonapembuat: getCookie('_zona'),
                xzona: getCookie('_zona'),
                xdaftarservis: getDataSevice()
            };
            doPost($http, 'myexweb.excreatestamp?', dataManifest, function (result) {
                if (result.STATUS === "OK") {
                    $.LoadingOverlay("hide");
                    setTimeout(function () {
                        $.alert({
                            title: 'Success!',
                            content: '<b>Stamp berhasil dibuat' + '<br> Nomer Stamp : </b>' + '<h3 style="background-color:#e6e3e3;padding:10px;">' + result.NO_STAMP + '</h3>' +
                                '<h4> Biaya Kirim : Rp ' + result.ONGKIR + '</h4>'
                        });
                    }, 1000);
                    $state.go("liststamp");
                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error!',
                        content: result.ERROR
                    });
                    $state.go("liststamp");
                }
            });
        }
    };
    //    CHECK NOMER KIRIMAN
    $scope.checkNomerKiriman = function () {
        $.LoadingOverlay("show");
        var params = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xidtipestamp: $scope.tipeStamp,
            xnokiriman: $scope.noKiriman
        };
        doPost($http, 'myexweb.exgetnoreturn?', params, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $("#detailReturn").modal('show');
                $('#tableReturn').empty();
                DATA_RETURN.push(result.DATA_DETAIL);
                var items = [];
                $.each(DATA_RETURN[0], function (i, val) {
                    items += '<tr>';
                    items += '<td style="width:20px;">';
                    items += '<img src="assets/img/ico-kirim.png" class="img-product" alt="paket"/>';
                    items += '</td>';
                    items += '<td>';
                    items += '<p><b> ID Kiriman :&nbsp;' + val.ID_KIRIMAN + '</b></p>';
                    items += '<p><b> Volume :&nbsp;' + val.VOLUME + '</b></p>';
                    items += '<p><b> Berat :&nbsp;' + val.BERAT + '</b></p>';
                    items += '<p><b> Berat Volume :&nbsp;' + val.BERAT_VOLUME + '</b></p>';
                    items += '</td>';
                    items += '<td style="width: 10px;">';
                    items += '<input type="checkbox" onclick="getIdReturn(' + val.ID_KIRIMAN + ')"/>';
                    items += '</td>';
                    items += '</tr>';
                });
                $('#tableReturn').append(items);
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: 'Nomer kiriman ada tidak ditemukan!'
                });
            }
        });
    };
    // GET PARAM SEARCH
    $scope.getParamCari = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xmenu: 'stamp'
        };
        doPost($http, 'myexweb.exloadsearching?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.paramKirim = result.LIST_SEARCH;
            } else {
            }

        });
    };
    //    GET DETAIL STAMP
    $scope.getStampDariku = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exgetliststampdariku?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataStampDariku = result.LIST_STAMP_DARIKU;
            } else if (result.IS_USER === 0) {
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    $scope.getDetailDariku = function (vdata) {
        console.log(vdata.BERAT_PCS);
        $.LoadingOverlay("show");
        $('#idStamp').val(vdata.NO_STAMP);
        $('#noPonsel').val(vdata.NO_HP);
        $('#namaPenerima').val(vdata.PENERIMA);
        $('#kodePos').val(vdata.KODE_POS);
        $('#jumlah').val(vdata.PCS);
        $('#berat_1').val(vdata.BERAT_PCS.BERAT_1);
        $('#berat_2').val(vdata.BERAT_PCS.BERAT_2);
        $('#berat_3').val(vdata.BERAT_PCS.BERAT_3);
        $('#berat_4').val(vdata.BERAT_PCS.BERAT_4);
        $('#kirimStamp').modal('show');
        $.LoadingOverlay("hide");
    };
    $scope.getStampUntukku = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exgetliststampuntukku?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataStampUntukku = result.LIST_STAMP_UNTUKKU;
            } else if (result.IS_USER === 0) {
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    var beratUntukku;
    $scope.getDetailUntukku = function (id) {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: 'W',
            xidreferensi: id,
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exgetdetailstampuntukku?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $("#kirimStamp").modal('show');
                $("#idstamp").val(result.REF);
                $("#noponsel").val(result.HP_PENGIRIM);
                $("#namapenerima").val(result.NAMA_PENERIMA);
                $("#kodepos").val(result.KODEPOS_TUJUAN);
                beratUntukku = result.BERAT;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.kirimStamp = function () {
        $.LoadingOverlay("show");
        var paramCode = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: 'W',
            xparamz: 'kirimstamp',
            xnostamp: document.getElementById("idStamp").value,
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exmanifeststamp?', paramCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                var url = result.LINK_PRINT;
                $.confirm({
                    title: 'Success',
                    content: '<h4>Stamp Berhasil diproses</h4>',
                    buttons: {
                        ok: function () {
                            if (url !== null || url !== '' || url !== undefined) {
                                window.open(result.LINK_PRINT, '_blank');
                            } else {
                                $.alert({
                                    title: 'Error!',
                                    content: 'Terjadi kesalahan saat proses print!'
                                });
                            }
                        }
                    }
                });
                $('#kirimStamp').modal('hide');
                $scope.getStampDariku();
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $('#kirimStamp').modal('hide');
                $scope.getStampDariku();
            }
        });
    };
});

// CONTROLLER FOR PICKUP ==========================================================================
var vlat = parseFloat(getCookie('_lat'));
var vlot = parseFloat(getCookie('_lot'));
function Autocomplete() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: vlat, lng: vlot },
        zoom: 18,
        mapTypeId: 'roadmap'
    });
    var vlocation = {
        lat: vlat,
        lng: vlot
    };
    var icon = {
        url: 'http://exact.id/smart/res/storage/863731031362508.160b07fcb5f.2e0e6c8c3bec.22171.cam', // url
        scaledSize: new google.maps.Size(30, 50), // scaled size
        origin: new google.maps.Point(0, 0), // origin
        anchor: new google.maps.Point(0, 0)
    };
    var marker = new google.maps.Marker({
        position: vlocation,
        map: map,
        //        label: "Your Location",
        icon: icon
    });
}
;
var latPickup;
var lotPickup;
app.controller('pickupController', function ($scope, $http, $state) {
    $scope.getListPickup = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exgetlistpup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataPickup = result.LIST_PUP;
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };

    $scope.showPickup = function () {
        if (TIPE_USER === 'MEMBER' || TIPE_USER === 'PERSONAL') {
            if (LAT_USER !== getCookie('_lat') && LOT_USER !== getCookie('_lot')) {
                $('#location').modal('show');
                latPickup = getCookie('_lat');
                lotPickup = getCookie('_lot');
            } else {
                latPickup = LAT_USER;
                lotPickup = LOT_USER;
                $scope.postPickup();
            }
            ;
        } else {
            latPickup = LAT_USER;
            lotPickup = LOT_USER;
            $scope.pickup();
        }
        ;
    };
    $scope.getZonaPickup = function () {
        var zonaPickup;
        var param = {
            xlat: latPickup,
            xlon: lotPickup
        };
        doPost($http, 'myexweb.exgetpostal?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                zonaPickup = result.ZONA;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });

        return zonaPickup;
    };
    $scope.postPickup = function () {
        if ($scope.getZonaPickup() !== 4) {
            $.LoadingOverlay("show");
            var param = {
                xuserid: getCookie('iduser'),
                xtoken: getCookie('token'),
                xloginfrom: 'W',
                xzona: getCookie('_zona'),
                xlat: latPickup,
                xlon: lotPickup,
                xjamsiap: $scope.jamsiap,
                xtambahankg: $scope.berat,
                xidorigin: ID_ORIGIN_USER,
                xzonakodepos: ZONA_USER,
                xalamat: $scope.alamat
            };
            doPost($http, 'myexweb.exrequestpickup?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                } else {
                    $.LoadingOverlay("hide");
                    $.confirm({
                        title: 'Info',
                        content: result.ERROR,
                        onContentReady: function () {
                            var self = this;
                            this.setContentPrepend('');
                            setTimeout(function () {
                                self.setContentAppend('');
                            }, 1000);
                            if (result.KODE === '2') {
                                $state.go('lokasi');
                            }
                        },
                        columnClass: 'medium'
                    });
                }
            });
        } else {
            $.alert({
                title: 'Warning',
                content: 'Maaf lokasi pickup anda belum dilayani!'
            });
        }
    };

    $scope.pickup = function () {
        $.confirm({
            title: 'Warning!',
            content: 'Apakah semua paket siap dipickup ?',
            buttons: {
                Ya: function () {
                    $scope.postPickup();
                },
                heyThere: {
                    text: 'Tidak', // With spaces and symbols
                    action: function () {
                        $('#tambah').modal('show');
                    }
                }
            }
        });
    };
    //    SUBMIT RATING
    $scope.showTambah = function (data) {
        $('#tambah').modal('show');
    };
    function formatDate(date) {
        var xdate = new Date(date);

        return date.cha;
    }
    $scope.showDetail = function (data) {
        if (data.STATUS_TERAKHIR === 'PICKUP ORDER') {
            $('#detail').modal('show');
            $('#pickuporder').val(data.STATUS_TERAKHIR);
            $('#berat').val(data.BERAT + ' PCS/ ' + data.PCS + ' Kg');
            $('#jam1').val('Tercatat : ' + data.JAM_TERCATAT.substring(0, 16) + '   ');
            $('#jam2').val('Perkiraan Pickup : ' + data.JAM_PERKIRAAN_PUP.substring(0, 16));
            $('#lokasi').val('Lokasi : ' + data.LOKASI_PUP);
            $('#nopickup').val(data.NO_PICKUP);
            $('#namakurir').val(data.NAMA_KURIR);
        } else if (data.STATUS_TERAKHIR === 'DISPATCH') {
            $('#detail').modal('show');
            $('#pickuporder').val(data.STATUS_TERAKHIR);
            $('#berat').val(data.BERAT + ' PCS/ ' + data.PCS + ' Kg');
            $('#jam1').val('Dispatch : ' + formatDate(data.JAM_DISPATCH.substring(0, 16)));
            $('#jam2').val('Pickup : ' + formatDate(data.JAM_SIAP.substring(0, 16)));
            $('#lokasi').val('Lokasi : ' + data.LOKASI_PUP);
            $('#nopickup').val(data.NO_PICKUP);
            $('#namakurir').val(data.NAMA_KURIR);
        }

        console.log(data);
    };
    $scope.showUbah = function (data) {
        $('#tambah').modal('show');
        $('#nosku').prop('disabled', true);
        $("#btnSimpan").html('UBAH');
        $scope.apparelId = data.ID_APPAREL;
        $scope.nosku = data.KODE_APPAREL;
        $scope.namasku = data.NAMA_APPAREL;
        $scope.warna = data.WARNA;
        $scope.berat = data.BERAT;
        $scope.harga = data.HARGA;
    };
    $scope.ratePup = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xidkurir: '',
            xratestart: '',
            xketerangan: ''
        };
        doPost($http, 'myexweb.exratepup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    };

    //BATAL
    $scope.showBatal = function () {
        $('#batal').modal('show');
    };
    $scope.getBatal = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xfungsi: 'PICK UP'
        };
        doPost($http, 'myexweb.exgetmastercancel?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listBatal = result.LIST_CANCEL;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    }
        ;
    $scope.pilihBatal = function (kode) {
        console.log(kode);
        $scope.kode = kode;
    };
    $scope.postBatalkan = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xidcancel: $scope.kode,
            xidpup: $('#nopickup').val(),
            xremark: $scope.keterangan
        };
        doPost($http, 'myexweb.excreatecancel?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
            $('#detail').modal('toggle');
        });
    };
    //KELUHAN
    $scope.showKeluhan = function (data) {
        $('#keluhan').modal('show');
        $scope.nopickup = data.NO_PICKUP;
    };
    $scope.getKeluhan = function (data) {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xfungsi: 'PICKUP'
        };
        doPost($http, 'myexweb.exgetmasterkeluhan?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listKeluhan = result.LIST_KELUHAN;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    }
        ;
    $scope.pilihKeluhan = function (kode) {
        $scope.kodeKeluhan = kode;
    };
    $scope.postKeluhan = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xtipekasus: $scope.kodeKeluhan,
            xidpup: $('#nopickup').val(),
            xremark: $scope.keterangan
        };
        doPost($http, 'myexweb.excreatekeluhanpup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
            $('#detail').modal('toggle');
        });
    };

});
// CONTROLLER FOR PENGGUNA
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var dataPengguna;
var ID_USER_EXACT;
var ID_MAP_USER;
app.controller('penggunaController', function ($scope, $http, $state) {
    //    VALIDASI EMAIL PENGGUAN
    $scope.initPengguna = function () {
        $("#nama").prop('disabled', false);
        $("#ponsel").prop('disabled', false);
        $("#btnSimpan").show();
    };
    $scope.getDataPengguna = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: LOGIN_FROM
        };
        doPost($http, 'myexweb.exgetlistpengguna?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataPengguna = result.DATA;
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    $scope.getAkses = function () {
        $.LoadingOverlay("show");
        var data = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: 'W',
            xdata: 'data'
        };
        doPost($http, 'myexweb.exgetaksespengguna?', data, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataAkses = result.DATA_WEB;
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    //    VALIDASI EMAIL PENGGUAN
    $scope.checkEmail = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xemail: $scope.email
        };
        doPost($http, 'myexweb.excekemailpengguna?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                ID_USER_EXACT = result.ID_USER_EXACT;
                $("#nama").prop('disabled', true);
                $("#ponsel").prop('disabled', true);
                $("#btnSimpan").show();
                dataPengguna = result;
                ID_USER_EXACT = dataPengguna.ID_USER_EXACT;
                ID_MAP_USER_PERUSAHAAN = dataPengguna.ID_MAP_USER_PERUSAHAAN;
                $scope.nama = result.NAMA;
                $scope.noponsel = result.NO_HP;
                $scope.jabatan = result.JABATAN;
            } else {
                $.LoadingOverlay("hide");
                $("#btnSimpan").hide();
                $scope.initPengguna();
                $.alert({
                    title: 'Info',
                    content: result.NOTIF
                });
            }
        });
    };
    $scope.add = function () {
        $('#email').prop('disabled', false);
        $("#nama").prop('disabled', false);
        $("#ponsel").prop('disabled', false);
        $('#formtambah').each(function () {
            this.reset();
        });
        $('#tambah').modal('show');
    };
    $scope.edit = function (data) {
        $('#email').prop('disabled', true);
        $("#nama").prop('disabled', true);
        $("#ponsel").prop('disabled', true);
        $scope.email = data.EMAIL;
        $scope.nama = data.NAMA;
        $scope.noponsel = data.NO_HP;
        $scope.jabatan = data.JABATAN;
        $scope.akses = data.ID_AKSES_WEB;
        ID_MAP_USER = data.ID_MAP_USER;
        ID_USER_EXACT = data.ID_USER_EXACT;
        $('#tambah').modal('show');
    };
    $scope.insertUpdate = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xidmapuser: ID_MAP_USER,
            xjabatan: $scope.jabatan,
            xidaksesweb: $scope.akses
        };
        doPost($http, 'myexweb.extambahpengguna?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Success',
                    content: 'Pengguna berhasil diprosess'
                });
                $('#tambah').modal('hide');
                location.reload();
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: 'Pengguna gagal diprosess'
                });
                $('#tambah').modal('hide');
                location.reload();
            }
        });
    };
});
// CONTROLLER FOR APPAREL
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.controller('apparelController', function ($scope, $http) {

    $scope.getApparel = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xparam: 'listapparel'
        };
        doPost($http, 'myexweb.exlistapparel?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataApparel = result.LIST_APPAREL;
            } else {
                $.LoadingOverlay("hide");
            }
        });
    }
        ;
    $scope.detailDop = function (data) {
        $.LoadingOverlay("show");
        if (data.ID_DOP !== '') {
            $('#detail').modal('show');
            $.LoadingOverlay("hide");
            $('#gambar').attr('src', data.GAMBAR);
            $('#nama_dop').text(data.NAMA_DOP);
            $('#alamat_dop').text(data.ALAMAT_DOP);
            $('#no_tlp').text(data.NO_TELP);
            $('#jam_buka').text(data.JAM_BUKA);
            $('#jam_tutup').text(data.JAM_TUTUP);
        } else {
            $.LoadingOverlay("hide");
        }
        ;
    };
    //    SUBMIT RATING
    $scope.showTambah = function (data) {
        $('#frmApparel').each(function () {
            this.reset();
        });
        $scope.apparelId = '';
        $('#nosku').prop('disabled', false);
        $("#btnSimpan").html('SIMPAN');
        $('#tambah').modal('show');
    };
    $scope.apparelId;
    $scope.showUbah = function (data) {
        $('#tambah').modal('show');
        $('#nosku').prop('disabled', true);
        $("#btnSimpan").html('UBAH');
        $scope.apparelId = data.ID_APPAREL;
        $scope.nosku = data.KODE_APPAREL;
        $scope.namasku = data.NAMA_APPAREL;
        $scope.warna = data.WARNA;
        $scope.berat = data.BERAT;
        $scope.harga = data.HARGA;
    };
    $scope.postApparel = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xidapparel: $scope.apparelId,
            xnosku: $scope.nosku,
            xnamasku: $scope.namasku,
            xwarna: $scope.warna,
            xhargaperpcs: $scope.harga,
            xberat: $scope.berat
        };
        doPost($http, 'myexweb.excreateapparel?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.getApparel();
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Success',
                    content: 'Data berhasil buat'
                });
                $('#nosku').removeAttr('disabled');
                $("#btnSimpan").html('SIMPAN');
                $('#frmApparel').each(function () {
                    this.reset();
                });
                $('#tambah').modal('hide');
                location.reload();
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    }
        ;
});
// CONTROLLER FOR LOKASI

var DATA_DOP = {};
app.controller('lokasiController', function ($scope, $http) {
    $scope.kolom = 'ALAMAT';
    $scope.init = function () {
        lokasiDop();
    };
    $scope.pilihtipe;
    $scope.lokasiDop = function () {
        if (DATA_USER.ZONA_KODE_POS === '4') {
            $('#zona-4').show();
            $('#zona-1').hide();
            $scope.pilihtipe = '2';
        } else {
            $('#zona-4').hide();
            $('#zona-1').show();
        }
        $('#pilih').modal('show');
    };
    $scope.pilihan = function (number) {
        $scope.pilihtipe = number;
        console.log($scope.pilihtipe);
    };
    $scope.getAlamat = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xalamat: $scope.cariAlamat,
            xidorigin: DATA_USER.ID_ORIGIN,
            xlat: DATA_USER.LAT_PROFILE,
            xlon: DATA_USER.LON_PROFILE,
        };
        doPost($http, 'myexweb.exdopbyaddress?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataAlamat = result.LIST_DOP;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }

        });
    };
    $scope.updateDop = function (iddop) {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xalamat: $scope.cariAlamat,
            xidorigin: DATA_USER.ID_ORIGIN,
            xlat: DATA_USER.LAT_PROFILE,
            xlon: DATA_USER.LON_PROFILE,
            xiddop: iddop,
            xtipeprivhal: 1
        };
        doPost($http, 'myexweb.exupdatehlp?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.pilih = function (data) {
        $.confirm({
            title: 'Info!',
            content: 'Apakah anda ingin memilih ' + data.NAMA_USAHA + ' sebagai lokasi ambil di exact anda ?',
            buttons: {
                Ya: function () {
                    $scope.updateDop(data.ID_DOP);
                },
                heyThere: {
                    text: 'Tidak', // With spaces and symbols
                    action: function () {

                    }
                }
            }
        });
    };
    $scope.getParamCari = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
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
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xparamz: 'listdop',
            xlat: lat,
            xlon: lng,
            xkodepos: kodeposDop,
            xnamakolom: $scope.kolom,
            xvalue: $('#pac-input').val()
        };
        doPost($http, 'myexweb.exlistdop?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                DATA_DOP.result = result;
                $scope.dataDop = result.LIST_DOP;
                $scope.lokasi = result.LOKASI;
                initAutocompleteLokasi();
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    $scope.detailDop = function (data) {
        $.LoadingOverlay("show");
        if (data.ID_DOP !== '') {
            $('#detail').modal('show');
            $.LoadingOverlay("hide");
            $('#gambar').attr('src', data.GAMBAR);
            $('#nama_dop').text(data.NAMA_DOP);
            $('#alamat_dop').text(data.ALAMAT_DOP);
            $('#no_tlp').text(data.NO_TELP);
            $('#jam_buka').text(data.JAM_BUKA);
            $('#jam_tutup').text(data.JAM_TUTUP);
        } else {
            $.LoadingOverlay("hide");
        }
        ;
    };
    //    SUBMIT RATING

    $scope.showRating = function (data) {
        $('#rating').modal('show');
    };
    $scope.postRating = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xkodedop: $scope.kodedop,
            xratestar: document.getElementById('input-id').value,
            xketerangan: $scope.keterangan
        };
        doPost($http, 'myexweb.exratedop?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Success',
                    content: 'Terima kasih telah memberikan penilain DOP'
                });
                $('#rating').modal('hide');
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
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
    componentRestrictions: { country: 'id' }
};
var marker;
var infox;
function setOnInfo(map, xmarker, xcontent) {
    var marker = xmarker;
    var infowindow = new google.maps.InfoWindow({
        content: xcontent
    });
    marker.addListener('click', function () {
        if (infox) {
            infox.close();
        }
        infox = infowindow;
        infowindow.open(map, marker);
    });
}
function initAutocompleteLokasi() {
    var DATA = DATA_DOP.result;
    //    if (DATA === undefined) {
    ////        window.location.reload();
    //    }
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
        marker = new google.maps.Marker({
            position: Location[i],
            map: map,
            animation: google.maps.Animation.DROP,
            label: listDop[i].NAMA_DOP,
            icon: icon,
            data: listDop[i]
        });
        var contentString = '<div id="content">' +
            '<div id="siteNotice">' +
            '</div>' +
            '<h1 id="firstHeading" class="firstHeading">' + listDop[i].NAMA_DOP + '</h1>' +
            '<div id="bodyContent">' +
            '<p>Telp : ' + listDop[i].NO_TELP + '</p>' +
            '</div>' +
            '</div>';
        setOnInfo(map, marker, contentString);
        //        var infowindow = new google.maps.InfoWindow({
        //            content: contentString
        //        });
        //
        //        marker.addListener('click', function () {
        //            infowindow.open(map, marker);
        //        });
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
        console.log();
        if (places[0].address_components.length < 7) {
            window.alert("Kode POS tidak ditemukan");
        } else {
            var postalcode = places[0].address_components[6];
            kodeposDop = postalcode.long_name;
            kota = places[0].address_components[3].long_name;
            var xlng = places[0].geometry.viewport.b.b;
            var xlat = places[0].geometry.viewport.f.b;
            lat = xlat;
            lng = xlng;
        }


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
// CONTROLLER FOR MY PROFILE
var dataImage = {};
app.directive("ngFileSelect", function (fileReader, $timeout) {
    return {
        scope: {
            ngModel: '='
        },
        link: function ($scope, el) {
            function getFile(file) {
                fileReader.readAsDataUrl(file, $scope)
                    .then(function (result) {
                        $timeout(function () {
                            $scope.ngModel = result;
                        });
                    });
            }

            el.bind("change", function (e) {
                var file = (e.srcElement || e.target).files[0];
                getFile(file);
            });
        }
    };
});
function uploadImage() {
    $.LoadingOverlay("show");
    var param = {
        xuserid: getCookie('iduser'),
        xtoken: getCookie('token'),
        xloginfrom: 'W',
        xzona: getCookie('_zona'),
        xemail: getCookie('email'),
        ximage: dataImage.data

    };
    Post('myexweb.exuploadcorpimage?', param);
    $.LoadingOverlay("hide");
}
;
app.factory("fileReader", function ($q, $log) {
    var onLoad = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.resolve(reader.result);
            });
        };
    };
    var onError = function (reader, deferred, scope) {
        return function () {
            scope.$apply(function () {
                deferred.reject(reader.result);
            });
        };
    };
    var onProgress = function (reader, scope) {
        return function (event) {
            scope.$broadcast("fileProgress", {
                total: event.total,
                loaded: event.loaded
            });
        };
    };
    var getReader = function (deferred, scope) {
        var reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.onprogress = onProgress(reader, scope);
        return reader;
    };
    var readAsDataURL = function (file, scope) {
        var deferred = $q.defer();
        var reader = getReader(deferred, scope);
        reader.readAsDataURL(file);
        return deferred.promise;
    };
    return {
        readAsDataUrl: readAsDataURL
    };
});
app.controller('myProfileController', function ($scope, $http, $state) {
    $scope.imageSrc = "assets/img/img.jpg";
    var DATA_USER = DATA_PROFILE;

    $scope.open = function () {
        $('#btnUpload').show();
    };

    function getDetailProfile() {
        $('#btnUpload').hide();
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token')
        };
        if (DATA_USER != null || DATA_USER !== undefined) {
            doPost($http, 'myexweb.exgetprofile?', param, function (result) {
                if (result.STATUS === 'OK') {
                    var vDATA_USER = result.DATA;
                    if (TIPE_USER === 'PERSONAL' || TIPE_USER === 'MEMBER') {
                        $scope.email = DATA_USER.EMAIL;
                        $scope.nama = DATA_USER.NAMA;
                        $scope.noponsel = DATA_USER.NO_HP;
                        $scope.alamat = DATA_USER.ALAMAT;
                        $scope.imageSrc = DATA_USER.LOGO;
                        $scope.alamat = DATA_USER.ALAMAT + ', ' + vDATA_USER.KODE_POS + ', ' + vDATA_USER.NAMA_KOTA;
                    } else if (TIPE_USER !== '' || TIPE_USER !== undefined) {
                        $scope.nama = DATA_USER.NAMA;
                        $scope.kode = DATA_USER.ID_KORPORASI;
                        $scope.adminemail = DATA_USER.EMAIL;
                        $scope.kontrak = DATA_USER.KONTRAK_BERAKHIR;
                        $scope.imageSrc = DATA_USER.LOGO;
                        $scope.alamatperushaan = DATA_USER.ALAMAT + ', ' + vDATA_USER.KODE_POS + ', ' + vDATA_USER.NAMA_KOTA;
                    } else {
                        $state.go('/');
                        $.LoadingOverlay("hide");
                    }
                    $.LoadingOverlay("hide");
                }
                ;
                $.LoadingOverlay("hide");
            });
        } else {
            $state.go('/');
            $.LoadingOverlay("hide");
        }
        ;
    }
    ;
    getDetailProfile();

    $scope.upload = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xemail: getCookie('email'),
            ximage: $scope.imageSrc
        };
        Post('myexweb.exuploadcorpimage?', param, function (result) {
            var vresult = JSON.parse(result);
            if (vresult.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Success',
                    content: 'Upload berhasil'
                });

                setTimeout(function () {
                    location.reload();
                }, 1000);

            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: vresult.ERROR
                });
            }
            setTimeout(function () {
                $state.go('/');
            }, 2000);
        });
    };
});
// CONTROLLER FOR MY SAVING
app.controller('mySavingController', function ($scope, $http) {
    $scope.getHistroy = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exgethistorytopup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.history = result;
            }
            ;
        });
    };
    $scope.getKeluhan = function (data) {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xfungsi: 'MANIFEST'
        };
        doPost($http, 'myexweb.exgetmasterkeluhan?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listKeluhan = result.LIST_KELUHAN;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    }
        ;
    $scope.getHistroy = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exgethistorytopup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.history = result.HISTORY_TOPUP;
            }
            ;
        });
    };
    $scope.cashout = function () {
        if ($scope.nominal !== "0" || $scope.nominal !== undefined) {
            var param = {
                xuserid: getCookie('iduser'),
                xtoken: getCookie('token'),
                xloginfrom: 'W',
                xzona: getCookie('_zona'),
                xsaldoterakhirkorporasi: DATA_USER.SALDO_TERAKHIR,
                xsaldoterakhir: DATA_USER.SALDO_TERAKHIR,
                xnominal: $scope.nominal,
                xidbank: $scope.idbank
            };
            doPost($http, 'myexweb.excashout?', param, function (result) {
                $.LoadingOverlay("show");
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Success',
                        content: 'Cashout berhasil'
                    });
                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error',
                        content: result.ERROR
                    });
                }
                ;
            });
        } else {
            $.alert({
                title: 'Error',
                content: 'Periksa kembali data yang anda masukan!'
            });
        }

    };
    $scope.topup = function () {
        if ($scope.nominal !== "0" || $scope.nominal !== undefined) {
            var param = {
                xuserid: getCookie('iduser'),
                xtoken: getCookie('token'),
                xloginfrom: 'W',
                xzona: getCookie('_zona'),
                xnominaltopup: $scope.nominal,
                xnamarekening: $scope.namarekening,
                xnorekening: $scope.norekening,
                xidbank: $scope.bank
            };
            doPost($http, 'myexweb.exrequesttopup?', param, function (result) {
                $.LoadingOverlay("show");
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Success',
                        content: 'Topup berhasil'
                    });
                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error',
                        content: result.ERROR
                    });
                }
                ;
            });
        } else {
            $.alert({
                title: 'Error',
                content: 'Periksa kembali data yang anda masukan!'
            });
        }

    };
});
// CONTROLLER FOR MY SAVING
app.controller('mySavingCorpController', function ($scope, $http) {
    $scope.getHistroy = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
        };
        doPost($http, 'myexweb.exgethistorytopup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.history = result;
            }
            ;
        });
    };
    $scope.getKeluhan = function (data) {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xfungsi: 'MANIFEST'
        };
        doPost($http, 'myexweb.exgetmasterkeluhan?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listKeluhan = result.LIST_KELUHAN;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    }
        ;
    $scope.getHistroy = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exgethistorytopup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.history = result.HISTORY_TOPUP;
            }
            ;
        });
    };
    $scope.cashout = function () {
        if ($scope.nominal !== "0" || $scope.nominal !== undefined) {
            var param = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xsaldoterakhirkorporasi: DATA_USER.SALDO_TERAKHIR,
                xsaldoterakhir: DATA_USER.SALDO_TERAKHIR,
                xnominal: $scope.nominal,
                xidbank: $scope.idbank
            };
            doPost($http, 'myexweb.excashout?', param, function (result) {
                $.LoadingOverlay("show");
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Success',
                        content: 'Cashout berhasil'
                    });
                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error',
                        content: result.ERROR
                    });
                }
                ;
            });
        } else {
            $.alert({
                title: 'Error',
                content: 'Periksa kembali data yang anda masukan!'
            });
        }

    };
    $scope.topup = function () {
        if ($scope.nominal !== "0" || $scope.nominal !== undefined) {
            var param = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xnominaltopup: $scope.nominal,
                xnamarekening: $scope.namarekening,
                xnorekening: $scope.norekening,
                xidbank: $scope.bank
            };
            doPost($http, 'myexweb.exrequesttopup?', param, function (result) {
                $.LoadingOverlay("show");
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Success',
                        content: 'Topup berhasil'
                    });
                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error',
                        content: result.ERROR
                    });
                }
                ;
            });
        } else {
            $.alert({
                title: 'Error',
                content: 'Periksa kembali data yang anda masukan!'
            });
        }

    };
});
// CONTROLLE FOR ONGKIR
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
                xuserid: getCookie('iduser'),
                xtoken: getCookie('token'),
                xloginfrom: 'W',
                xpostalcode: $('#kodepos').val(),
                xparam: 'getpostalcode',
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
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xpostalcodedes: $('#kodepos').val(),
            xidorigin: idOrigin.result,
            xparam: 'zonaongkir'
        };
        doPost($http, 'myexweb.exgetzonaongkir?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
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
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xidorigin: idOrigin.result,
            xiddes: idOriginDes.result,
            xberat: $scope.berat,
            xpcs: '1',
            xzonapostujuan: ZONA_DES.result,
            xparam: 'zonaongkir'
        };
        doPost($http, 'myexweb.exgetlistongkir?', param, function (result) {
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
    };
});
// CONTROLLER FOR TRACE
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
app.controller('traceController', function ($scope, $http) {
    $scope.hide = function () {
        $('#cari').hide();
    };
    $scope.onChat = function () {
        if ("WebSocket" in window) {
            $.alert({
                title: 'Error!',
                content: 'WebSocket is supported by your Browser!'
            });
            // Let us open a web socket
            var ws = new WebSocket("wss://www.exact.co.id/SE/");
            ws.onopen = function () {
                // Web Socket is connected, send data using send()
                ws.send("Message to send");
                $.alert({
                    title: 'Error!',
                    content: 'Message is sent...'
                });
            };
            ws.onmessage = function (evt) {
                var received_msg = evt.data;
                $.alert({
                    title: 'Error!',
                    content: 'Message is received...'
                });
            };
            ws.onclose = function () {
                // websocket is closed.
                $.alert({
                    title: 'Error!',
                    content: 'Connection is closed...'
                });
            };
            window.onbeforeunload = function (event) {
                ws.close();
            };
        } else {
            // The browser doesn't support WebSocket
            $.alert({
                title: 'Error!',
                content: 'WebSocket NOT supported by your Browser!'
            });
        }
        ;
    };
    $scope.cariTrace = function () {
        $('#cari').show();
    };
    $scope.listTrace = function () {
        $.LoadingOverlay("show");
        params = {
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xuserid: getCookie('iduser'),
            xzona: getZona(),
            xparam: 'gettrace'
        };
        doPost($http, 'myexweb.exgettrace?', params, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
});
// CONTROLLER FOR OPD
var listSku = [];
function deleteSku(index) {
    listSku.splice(index, 1);
    ;
    tableSku(listSku);
}
function tableSku(data) {
    $('#tblSku').empty();
    var item = [];
    $.each(data, function (j, val) {
        item += '<tr>';
        item += '<td>' + val.sku + '</td>';
        item += '<td>' + val.nama + '</td>';
        item += '<td>' + val.harga + '</td>';
        item += '<td><button class="btn btn-sm btn-deafult" onclick="deleteSku(' + j + ')"><i class="glyphicon glyphicon-trash"></i></button></td>';
        item += '</tr>';
    });
    $('#tblSku').append(item);
}
app.controller('opdController', function ($scope, $http, $state) {
    $scope.init = function () {
        $('#divInvoice').hide();
        $("#divCategory").hide();
        $("#divCategory").show();
        $("#divBeaMasuk").show();
        enableAlamatPenerima();
    };
    $scope.divInvoice = function () {
        if ($scope.namaPerusahaan !== '' || $scope.namaPerusahaan !== undefined) {
            $('#divInvoice').show();
        } else {
            $('#divInvoice').hide();
        }
    };
    // GET BUKU ALAMAT
    $scope.showBukuAlamat = function () {
        $('#bukualamat').modal('show');
    };
    $scope.getBukuAlamat = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM
        };
        doPost($http, 'myexweb.exlistaddrbook?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataBukuAlamat = result.LIST_ADDR_BOOK;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $state.go('/');
            }
        });
    };
    $scope.pilihAlamat = function (data) {
        $.confirm({
            title: 'Info!',
            content: 'Apakah ingin mengunakan alamat <br>' + data.NAMA_PERUSAHAAN_BUKU + ' ?',
            buttons: {
                Ya: function () {
                    $('#namapenerima').val(data.NAMA_KONTAK);
                    $('#namaperusahaan').val(data.NAMA_PERUSAHAAN_BUKU);
                    $('#kodepos').val(data.KODE_POS_KONTAK);
                    $('#kota').val(data.NAMA_KOTA);
                    $('#noponsel').val(data.NO_HP);
                    $('#alamat').val(data.ALAMAT);
                    $scope.getZona();
                    $scope.checkPhonePenerima();
                    disableAlamatPenerima('#namapenerima');
                    $('#bukualamat').modal('hide');
                },
                heyThere: {
                    text: 'Tidak', // With spaces and symbols
                    action: function () {

                    }
                }
            }
        });
    };
    function disableAlamatPenerima(nama) {
        $('#namaperusahaan').prop('disabled', true);
        $('#kodepos').prop('disabled', true);
        $('#noponsel').prop('disabled', true);
        $('#alamat').prop('disabled', true);
        $(nama).prop('disabled', true);
    }
    function enableAlamatPenerima() {
        $('#namaperusahaan').prop('disabled', false);
        $('#kodepos').prop('disabled', false);
        $('#noponsel').prop('disabled', false);
        $('#alamat').prop('disabled', false);
        $('#namapenerima').prop('disabled', false);
    }
    $scope.getKota = function () {
        $scope.kodepos = document.getElementById("kodepos").value;
        if ($scope.kodepos.length > 4) {
            $.LoadingOverlay("show");
            var param = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xpostalcode: $('#kodepos').val(),
                xparam: 'getpostalcode',
                xzona: getCookie('_zona')
            };
            doPost($http, 'myexweb.exgetdatapos?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $scope.kota = result.NAMA_KOTA;
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
    $scope.checkPhonePenerima = function () {
        var noponsel = $('#noponsel').val();
        if (noponsel.length > 10) {
            $.LoadingOverlay("show");
            var param = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xzona: getCookie('_zona'),
                xnohpcustomer: $('#noponsel').val()
            };
            doPost($http, 'myexweb.excheckisuser?', param, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    ID_USER_PENERIMA = result.ID_USER;
                } else {
                    $.LoadingOverlay("hide");
                }
            });
        }
    };
    $scope.getZona = function () {
        $.LoadingOverlay("show");
        var paramPostCode = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xpostalcodeorigin: DATA_USER.KODE_POS, // get from local postcode login aplikasi
            xpostalcodedes: $('#kodepos').val(),
            xparam: 'getpostalcode'
        };
        doPost($http, 'myexweb.exgetzona?', paramPostCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                DATA_PENERIMA = result;
                ID_KODE_POS_ORIGIN_PENERIMA = result.ID_ORIGIN;
                ID_DES_PENERIMA = result.ID_DES;
                FREEPORT_ORIGIN_PENERIMA = result.FREEPORT_TUJUAN;
                ID_KODE_POS_DES_PENERIMA.result = result.ID_KODE_POS_DES;
                ZONA_DES_PENERIMA = result.ZONA_DES;
                if (DATA_PENERIMA.FREEPORT_TUJUAN === 'Y' && DATA_USER.FREEPORT_ORIGIN === 'Y') {
                    $("#divCategory").hide();
                    $("#divBeaMasuk").hide();
                } else {
                    $("#divCategory").show();
                }
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.checkSku1 = function () {
        $.LoadingOverlay("show");
        var paramPostCode = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xnosku: $scope.nosku1
        };
        doPost($http, 'myexweb.exgetapparel?', paramPostCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.harga1 = result.HARGA;
                $scope.nama1 = result.NAMA_APPAREL;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.checkSku2 = function () {
        $.LoadingOverlay("show");
        var paramPostCode = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xnosku: $scope.nosku2
        };
        doPost($http, 'myexweb.exgetapparel?', paramPostCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.harga2 = result.HARGA;
                $scope.nama2 = result.NAMA_APPAREL;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.checkSku3 = function () {
        $.LoadingOverlay("show");
        var paramPostCode = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xnosku: $scope.nosku3
        };
        doPost($http, 'myexweb.exgetapparel?', paramPostCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.harga3 = result.HARGA;
                $scope.nama3 = result.NAMA_APPAREL;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.checkSku4 = function () {
        $.LoadingOverlay("show");
        var paramPostCode = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xnosku: $scope.nosku4
        };
        doPost($http, 'myexweb.exgetapparel?', paramPostCode, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.harga4 = result.HARGA;
                $scope.nama4 = result.NAMA_APPAREL;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.addSku = function () {
        listSku = [];
        if ($scope.nosku1 === undefined || $scope.nosku1 === '') {

        } else {
            var sku1 = {
                sku: $scope.nosku1,
                nama: $scope.nama1,
                harga: $scope.harga1
            };
            listSku.push(sku1);
        }
        if ($scope.nosku2 === undefined || $scope.nosku2 === '') {

        } else {
            var sku2 = {
                sku: $scope.nosku2,
                nama: $scope.nama2,
                harga: $scope.harga2
            };
            listSku.push(sku2);
        }
        if ($scope.nosku3 === undefined || $scope.nosku3 === '') {

        } else {
            var sku3 = {
                sku: $scope.nosku3,
                nama: $scope.nama3,
                harga: $scope.harga3
            };
            listSku.push(sku3);
        }
        if ($scope.sku4 === undefined || $scope.sku4 === '') {
        } else {
            var sku4 = {
                sku: $scope.nosku4,
                nama: $scope.nama4,
                harga: $scope.harga4
            };
            listSku.push(sku4);
        }

        tableSku(listSku);
        $('#tambah').modal('hide');
    };
    $scope.showProduct = function () {
        $.LoadingOverlay("show");
        var paramProduct = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xorigin: DATA_USER.ID_ORIGIN,
            xdestination: ID_DES_PENERIMA,
            xtipeuser: DATA_USER.TIPE_USER,
            xparam: 'getproduct',
            xberat: $scope.beratpaket,
            xzona: getCookie('_zona'),
            xclrorigin: DATA_USER.FREEPORT_ORIGIN,
            xclrdes: FREEPORT_ORIGIN_PENERIMA,
            xidkategori: '',
            xlatorigin: getCookie('_lat'),
            xlonorigin: getCookie('_lot')
        };
        doPost($http, 'myexweb.exgetproduct?', paramProduct, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $("#myProduk").modal('show');
                $('#header-product').empty();
                $scope.dummy1 = result.KOMBINASI;
                var dictionary = $scope.dummy1;
                $scope.dummy2 = [];
                var headerProduct = [];
                var results = dictionary;
                function getValueByKey(key, dictionary) {
                    var i, len = dictionary.length;
                    for (i = 0; i < len; i++) {
                        if (dictionary[i] && dictionary[i].hasOwnProperty(key)) {
                            return dictionary[i][key];
                        }
                    }

                    return -1;
                }
                for (var i = 0; i < results.length; i++) {
                    var columnsIn = results[i];
                    for (var key in columnsIn) {
                        headerProduct.push(key);
                        $scope.dummy2.push(getValueByKey(key, dictionary));
                    }
                }
                ;
                ProductDetail = $scope.dummy2;
                var item = [];
                $.each(headerProduct, function (j, header) {
                    item += '<tr style="background: #F08B30;color:white;">';
                    item += '<td style="background: transparent;"><b></b></td>';
                    item += '<td style="background: transparent;"><b>' + header + '</b></td>';
                    item += '<td style="background: transparent;"><b></b></td>';
                    item += '</tr>';
                    $.each(ProductDetail[j], function (l, val) {
                        item += '<tr onclick="getIdProductStamp(ProductDetail[' + j + '][' + l + '])">';
                        item += '<td style="width: 20px;;">';
                        item += '<img src="' + val.LINK_ICON + '" class="img-product" alt="icon"/>';
                        item += '<p><b>&nbsp;' + val.KODE_PRODUK + '</b></p>';
                        item += '</td>';
                        item += '<td>';
                        item += '<p><b> Keterangan :&nbsp;' + val.DESKRIPSI_PRODUK + '</b></p>';
                        item += '<p><b> Ongkir Cash :&nbsp;' + val.ONGKIR_CASH + '</b></p>';
                        item += '<p><b> Ongkir Saving :&nbsp;' + val.ONGKIR_SAVING + '</b></p>';
                        item += '<p><b> Discount Volume :&nbsp;' + val.DISKON + '</b></p>';
                        item += '</td>';
                        item += '</tr>';
                    });
                });
                $('#header-product').append(item);
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.showServices = function () {
        $.LoadingOverlay("show");
        var paramServices = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xorigin: DATA_USER.ID_ORIGIN,
            xdestination: ID_DES_PENERIMA,
            xberat: berat,
            xtipeuser: DATA_USER.TIPE_USER,
            xuseridperusahaan: '',
            xtipejenisproduk: DATA_PRODUCT.TIPE_JENIS_PRODUK,
            xparam: 'exservices',
            xtipeorgdes: DATA_USER.ID_ORIGIN,
            xidplatform: '2',
            xidproduk: DATA_PRODUCT.KODE_PRODUK,
            xtipekiriman: '',
            xiuserpenerima: $scope.noPonsel,
            xrealmde: DATA_PRODUCT.DE_DATE,
            xrealday: DATA_PRODUCT.MDE_DAY_REAL,
            xzona: getCookie('_zona'),
            xisstamp: 'NO'
        };
        doPost($http, 'myexweb.exservices?', paramServices, function (result) {
            // INS,COD,OPD
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataServices = result.LIST_SERVICES;
                $scope.hargaService = $scope.DataServices.HARGA;
                $("#service").modal('show');
                $('#product-service').empty();
                DATA_SERVICE.push(result.LIST_SERVICES);
                ProductService = DATA_SERVICE[0];
                var items = [];
                $.each(DATA_SERVICE[0], function (l, val) {
                    items += '<tr class="tr-width">';
                    items += '<td style="width: 10px;" onclick="getListService(ProductService[' + l + '])">';
                    items += '<input type="checkbox" id="myCheck" onclick="getListService(ProductService[' + l + '])">';
                    items += '</td>';
                    items += '<td style="width: auto;">';
                    items += '<img src="' + val.LINK_ICON + '" class="img-product" alt="icon"/>';
                    items += '<p><b>&nbsp;' + val.KODE_JENIS_SERVICES + '</b></p>';
                    items += '</td>';
                    items += '<td>';
                    items += '<p><b> Keterangan :&nbsp;' + val.NAMA_JENIS_SERVICES + '</b></p>';
                    items += '<p><b> Harga :&nbsp;' + val.HARGA + '</b></p>';
                    if (val.IS_INPUT === '1') {
                        items += '<p>Info :<input type="text" class="form-control form-control-custom" id="info" ng-model="input"></p>';
                    }
                    items += '</td>';
                    items += '</tr>';
                });
                $('#product-service').append(items);
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.closeService = function () {
        $(document).ready(function () {
            $("#myProduk").modal('toggle');
            $("#service").modal('toggle');
        });
    };
    $scope.getPembayaran = function () {
        $.LoadingOverlay("show");
        var paramTipePembayran = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xuseridexact: ID_USER,
            xusertype: TIPE_USER,
            xzona: getCookie('_zona'),
            xsaldosaving: SALDO,
            xongkir: HARGA,
            xlistservice: listService,
            xidorigin: ID_KODE_POS_ORIGIN_PENERIMA,
            xiddes: ID_DES_PENERIMA
        };
        doPost($http, 'myexweb.exgettipepembayaran?', paramTipePembayran, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataTipePembayaran = result.TIPE_PEMBAYARAN;
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    //GET CATEGORY ISI KIRIMAN
    $scope.getCategory = function () {
        $.LoadingOverlay("show");
        var param = {
            xparam: 'getcategory'
        };
        doPost($http, 'myexweb.excategory?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.DataCategory = result.LIST_KATEGORI;
                for (var i = 0; i < $scope.DataCategory.length; i++) {
                    var dataList = result.LIST_KATEGORI[i];
                    KATEGORI_KIRIMAN = dataList;
                }
            } else {
                $.LoadingOverlay("hide");
            }
        });
    };
    $scope.selCategory = function () {
        console.log("HAYYYYYYYYYYYYY");
        if (KATEGORI_KIRIMAN !== null || KATEGORI_KIRIMAN !== 'undefined') {
            if (KATEGORI_KIRIMAN.FLAG_CHARGE === 'YES') {
                $("#divBeaMasuk").show();
            } else {
                $("#divBeaMasuk").hide();
            }
            ;
        }
    };
    ///GET BAG INV
    $scope.getBangInvoice = function () {
        if ($scope.akun === 'PERUSAHAAN') {
            $.LoadingOverlay("show");
            var dataBagInvoice = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xuseridcorp: ID_KORPORASI,
                xzona: getCookie('_zona')
            };
            doPost($http, 'myexweb.exgetkuasainv?', dataBagInvoice, function (result) {
                if (result.STATUS === 'OK') {
                    $.LoadingOverlay("hide");
                    $scope.DataBagInvoice = result.KONTAK_INVOICE;
                }
            });
        } else {
            $.LoadingOverlay("hide");
        }
        ;
    };
    // POST MANIFEST OPD
    $scope.postManifestOpd = function () {
        var barang = listSku;
        var total_berat = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            beratpaket: $scope.beratpaket,
            panjang: $scope.panjang,
            tinggi: $scope.tinggi,
            lebar: $scope.lebar
        };
        if (DATA_PRODUCT === '' || DATA_PRODUCT === undefined) {
            $.alert({
                title: 'Error!',
                content: 'Anda belum memilih Tanggal tiba!'
            });
        } else {
            $.LoadingOverlay("show");
            var dataManifest = {
                xuserid: ID_USER,
                xisadmin: IS_ADMIN,
                xidperusahaan: ID_KORPORASI,
                xidkontrak: ID_KONTRAK_PERSONAL,
                xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
                xtoken: TOKEN_USER,
                xkodeuser: EMAIL_USER,
                xloginfrom: LOGIN_FROM,
                xuseridpengirim: DATA_USER.ID_USER,
                xnohppenerima: $('#noponsel').val(),
                xnamapenerima: $('#namapenerima').val(),
                xmultiobject: total_berat,
                xopdobject: barang,
                xberat: $scope.beratpaket,
                xproduk: DATA_PRODUCT.ID_PRODUK,
                xidkategorikiriman: $scope.kategoriKiriman,
                xisikiriman: $scope.isiKiriman,
                xidkodepostujuan: ID_KODE_POS_DES_PENERIMA.result,
                xidtujuan: ID_DES_PENERIMA,
                xidorigin: DATA_USER.ID_ORIGIN,
                xketerangan: $scope.keterangan,
                xhargapembayaran: '',
                xtipepembayaran: $scope.jenisPembayaran,
                xalamattujuan: $('#alamat').val(),
                xlatorigin: getCookie('_lat'),
                xlonorigin: getCookie('_lot'),
                xzonatujuan: DATA_PENERIMA.ZONA_DES,
                xtipealamatpenerima: '',
                xjanjitiba: DATA_PRODUCT.COM_DATE,
                xbeamasuk: KATEGORI_KIRIMAN.PERSENTASE_BIAYA_CHARGES,
                xnilaibeabarang: $scope.nilaiBeaCukai,
                xtokenz: TOKEN_USER,
                xuseridperusahaan: getCookie('iduser'),
                xtotalharga: DATA_PRODUCT.ONGKIR_SAVING,
                xdaftarservis: listService,
                xparam: 'opd',
                xsendfrom: 'W'
            };
            doPost($http, 'myexweb.exmanifestapparel?', dataManifest, function (result) {
                $scope.resultManifest = result;
                var NomerKiriman = [];
                if (result.STATUS === "OK") {
                    $.LoadingOverlay("hide");
                    var url = result.LINK_PRINT;
                    for (var i = 0; i < result.NO_KIRIMAN.length; i++) {
                        NomerKiriman.push('Nomer Kiriman = ' + result.NO_KIRIMAN[i].ID_KIRIMAN + '<br>');
                    }
                    $.confirm({
                        title: 'Warning!',
                        content: NomerKiriman + '<br>' +
                            'Total biaya pengirirman= ' + result.TOTAL,
                        buttons: {
                            ok: function () {
                                if (url !== null | url !== '') {
                                    window.open(url, '_blank');
                                    dataManifest = {};
                                    $scope.clearFormKirim();
                                    $state.go("/");
                                } else {
                                    $.alert({
                                        title: 'Error!',
                                        content: 'Terjadi kesalahan saat cetak label!'
                                    });
                                    $state.go("/");
                                }
                            }
                        }
                    });
                } else {
                    $.LoadingOverlay("hide");
                    $.alert({
                        title: 'Error!',
                        content: result.ERROR
                    });
                    $state.go("/");
                }
            });
        }
    };
});
// CONTROLLER FOR BAGIAN INVOICE
app.controller('invoiceController', function ($scope, $http, $state) {
    ///GET BAG INV
    $scope.getListBagInvoice = function () {
        $.LoadingOverlay("show");
        var dataBagInvoice = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exlistbaginvoice?', dataBagInvoice, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listBagInvoice = result.LIST_BAG_INVOICE;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.getUserInvoice = function () {
        $.LoadingOverlay("show");
        var dataBagInvoice = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exlistuserinv?', dataBagInvoice, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataUser = result.LIST_USER_INVOICE;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.add = function () {
        $('#divinvoice').hide();
        $('#nambagian').prop('disabled', false);
        $('#formtambah').each(function () {
            this.reset();
        });
        $('#tambah').modal('show');
    };
    var idBagInvoice;
    $scope.edit = function (data) {
        $('#divinvoice').hide();
        $('#tambah').modal('show');
        $('#nambagian').prop('disabled', true);
        idBagInvoice = data.ID_BAGIAN_INVOICE;
        $scope.namabagian = data.BAGIAN_INVOICE;
        $scope.namauser = data.NAMA;
        $scope.teleponuser = data.NO_HP;
        $scope.jabatanuser = data.JABATAN;
        $scope.kontakinvoice = data.ID_USER_INV;
        $scope.kodeinvoice = data.KODE_INVOICE;

        $scope.kontakpembayaran = data.ID_USER_PEMBAYARAN;
        $scope.namapembayar = data.NAMA_USER_BAYAR;
        $scope.teleponpembayar = '';
        $scope.jabatanpembayar = '';
        $scope.getListBagInvoice();
    };
    $scope.setUserInvoice = function (dataUser) {
        var data = JSON.parse(dataUser);
        $scope.namauser = data.NAMA;
        $scope.teleponuser = data.NO_HP;
        $scope.jabatanuser = data.JABATAN;
    };
    $scope.setUserPembayar = function (dataUser) {
        var data = JSON.parse(dataUser);
        $scope.namapembayar = data.NAMA;
        $scope.teleponpembayar = data.NO_HP;
        $scope.jabatanpembayar = data.JABATAN;
    };
    $scope.postBagInvoice = function () {
        var kontakinvoice = JSON.parse($scope.kontakinvoice);
        var kontakpembayar = JSON.parse($scope.kontakpembayaran);
        $.LoadingOverlay("show");
        var dataBagInvoice = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xidbagianinvoice: idBagInvoice,
            xnamabagian: $scope.namabagian,
            xkodeinvoice: $scope.kodeinvoice,
            xuseridinvoice: kontakinvoice.ID_USER_EXACT,
            xkontakpembayaran: kontakpembayar.ID_USER_EXACT,
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exinputbaginvoice?', dataBagInvoice, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Success',
                    content: 'Bagian invoice berhasil dibuat'
                });
                $('#tambah').modal('hide');
                location.reload();
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $('#tambah').modal('hide');
                location.reload();
            }
        });
    };
});
// CONTROLLER FOR BUKU ALAMAT
app.controller('bukuAlamatController', function ($scope, $http, $state) {
    $scope.getParamCari = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xmenu: 'buku alamat'
        };
        doPost($http, 'myexweb.exloadsearching?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.paramcari = result.LIST_SEARCH;
            } else {
            }

        });
    };
    $scope.getListAlamat = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xnamakolom: $scope.kolom,
            xvalue: $scope.cari
        };
        doPost($http, 'myexweb.exlistaddrbook?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listBukuAlamat = result.LIST_ADDR_BOOK;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $state.go('/');
            }
        });
    };
    $scope.add = function () {
        $('#tambah').modal('show');
        $('#namaperusahaan').prop('disabled', false);
        $('#namakontak').prop('disabled', false);
        $('#formtambah').each(function () {
            this.reset();
        });
    };
    var idbukuAlamat;
    $scope.edit = function (data) {
        $('#tambah').modal('show');
        $('#namaperusahaan').prop('disabled', true);
        $('#namakontak').prop('disabled', true);
        $scope.namaperusahaan = data.NAMA_PERUSAHAAN_BUKU;
        $scope.namakontak = data.NAMA_KONTAK;
        $scope.noponsel = data.NO_HP;
        $scope.alamat = data.ALAMAT;
        $scope.kota = data.NAMA_KOTA;
        $scope.kodepos = data.KODE_POS_KONTAK;
        idkodepos = data.ID_KODE_POS_KONTAK;
        idbukuAlamat = data.ID_BUKU_ALAMAT;
    };
    var idkodepos;
    function checkPostCode() {
        $scope.kodepos = document.getElementById("kodepos").value;
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xpostalcode: $scope.kodepos,
            xparam: 'getpostalcode',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exgetdatapos?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.kota = result.NAMA_KOTA;
                idkodepos = result.ID_KODE_POS;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    }
    $scope.getPostCode = function () {
        $scope.kodepos = document.getElementById("kodepos").value;
        if ($scope.kodepos.length > 4) {
            checkPostCode();
        }
        ;
    };
    $scope.postBukuAlamat = function () {
        $.LoadingOverlay("show");
        var dataBagInvoice = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xidbukualamat: idbukuAlamat,
            xnamaperusahaan: $scope.namaperusahaan,
            xnamakontak: $scope.namakontak,
            xnotelp: $scope.noponsel,
            xalamat: $scope.alamat,
            xkodepos: $scope.kodepos,
            xidkodepos: idkodepos,
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exinputaddrbook?', dataBagInvoice, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Success',
                    content: 'Buku alamat berhasil dibuat'
                });
                $('#tambah').modal('hide');
                location.reload();
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $('#tambah').modal('hide');
                location.reload();
            }
        });
    };
});
// CONTROLLER FOR PENGALIHAN INVOICE
app.controller('alihInvoiceController', function ($scope, $http, $state) {
    ///GET BAG INV
    $scope.getListAlihInvoice = function () {
        $.LoadingOverlay("show");
        var dataBagInvoice = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exlistalihinv?', dataBagInvoice, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listAlihInvoice = result.DATA;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $state.go('/');
            }
        });
    };
    $scope.getListBagInvoice = function () {
        $.LoadingOverlay("show");
        var dataBagInvoice = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exlistbaginvoice?', dataBagInvoice, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listBagInvoice = result.LIST_BAG_INVOICE;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $state.go('/');
            }
        });
    };
    var idkorpkuasainv;
    $scope.checkUserCorp = function () {
        $.LoadingOverlay("show");
        var dataBagInvoice = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xkodekorpalihinv: $scope.kodecorpinvoice,
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exlistuseralihinv?', dataBagInvoice, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.dataPerusahaan = result;
                $scope.namaperusahaan = result.NAMA_PERUSAHAAN;
                $scope.namausaha = result.NAMA_USAHA;
                $scope.alamat = result.ALAMAT_PERUSAHAAN;
                $scope.kodepos = result.KODE_POS;
                $scope.kota = result.ALAMAT_PERUSAHAAN;
                $scope.pemberikuasa = result.PEMBERI_KUASA;
                $scope.telepon = result.NO_TELP_PERUSAHAAN;
                idkorpkuasainv = result.ID_PERUSAHAAN_KUASA_INV;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.add = function () {
        $('#kuasainvoice').prop('disabled', false);
        $('#kodecorpinvoice').prop('disabled', false);
        $('#formtambah').each(function () {
            this.reset();
        });
        $('#tambah').modal('show');
    };
    var idalihinv;
    $scope.edit = function (data) {
        $('#tambah').modal('show');
        $('#kuasainvoice').prop('disabled', true);
        $('#kodecorpinvoice').prop('disabled', true);
        idalihinv = data.ID_ALIH_INVOICE;
        idkorpkuasainv = data.ID_KORP_KUASA;
        $scope.kuasainvoice = data.ID_BAGIAN_INVOICE;
        $scope.kodecorpinvoice = data.KODE_KORP_KUASA;
        $scope.namaperusahaan = data.NAMA_PERUSAHAAN_KUASA;
        $scope.namausaha = data.NAMA_USAHA;
        $scope.alamat = data.ALAMAT_KORP_KUASA;
        $scope.kodepos = data.KODE_POS;
        $scope.kota = data.KOTA;
        $scope.pemberikuasa = data.PEMBERI_KUASA;
        $scope.telepon = data.NO_TELP_KORP_KUASA;
        $scope.tanggalmulai = data.TANGGAL_MULAI;
        $scope.tanggalakhir = data.TANGGAL_AKHIR;
        $scope.getListAlihInvoice();
    };
    $scope.postAlihInvoice = function () {
        $.LoadingOverlay("show");
        var dataBagInvoice = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xidalihinvoice: idalihinv,
            xidkorpkuasainv: idkorpkuasainv,
            xidbagianinv: $scope.kuasainvoice,
            xtglmulai: $scope.tanggalmulai,
            xtglakhir: $scope.tanggalakhir,
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exinputalihinv?', dataBagInvoice, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Success',
                    content: 'Pengalihan invoice berhasil dibuat'
                });
                $('#tambah').modal('toggle');
                $scope.getListAlihInvoice();
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error!',
                    content: result.ERROR
                });
                $('#tambah').modal('toggle');
            }
            $('#kuasainvoice').prop('disabled', false);
        });
    };
});

// FOR CONTROL
app.controller('kontrolController', function ($scope, $http, $stateParams,$filter) {
    $scope.date = new Date();
    $scope.getParamCari = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xmenu: 'kontrol'
        };
        doPost($http, 'myexweb.exloadsearching?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.paramcari = result.LIST_SEARCH;
            } else {
            }
        });
    };
    $scope.getListKontrol = function () {
        $scope.dataKontrol = null;
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xkolom: $scope.kolom,
            xvalue: $scope.cari
        };
        doPost($http, 'myexweb.extracking?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("Hide");
                $scope.dataKontrol = result.LIST_TRACKING_HEADER;
                for (var z = 0; z < $scope.dataKontrol.length; z++) {
                    var status = $scope.dataKontrol[z].STATUS_COUNT;
                    $scope.dataKontrol[z].img1 = 'abu1.png';
                    $scope.dataKontrol[z].img2 = 'abu2.png';
                    $scope.dataKontrol[z].img3 = 'abu3.png';
                    $scope.dataKontrol[z].img4 = 'abu4.png';
                    if (status === '1') {
                        $scope.dataKontrol[z].img1 = 'hijau1.png';
                    } else if (status === '2') {
                        $scope.dataKontrol[z].img1 = 'hijau1.png';
                        $scope.dataKontrol[z].img2 = 'hijau2.png';
                    } else if (status === '3') {
                        $scope.dataKontrol[z].img1 = 'hijau1.png';
                        $scope.dataKontrol[z].img2 = 'hijau2.png';
                        $scope.dataKontrol[z].img3 = 'hijau3.png';
                    } else {
                        $scope.dataKontrol[z].img1 = 'hijau1.png';
                        $scope.dataKontrol[z].img2 = 'hijau2.png';
                        $scope.dataKontrol[z].img3 = 'hijau3.png';
                        $scope.dataKontrol[z].img4 = 'hijau4.png';
                    }
                }
                ;
            } else {
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
                $.LoadingOverlay("Hide");
            }
        });
    };
    $scope.currentPage = 0;
    $scope.pageSize = 10;
    $scope.cari = '';

    $scope.getData = function () {
        return $filter('filter')($scope.dataKontrol, $scope.cari)
    }
    $scope.numberOfPages = function () {
        if ($scope.getData() !== undefined) {
            return Math.ceil($scope.getData().length / $scope.pageSize);
        }
    }
    $scope.prevPage = function () {
        if ($scope.currentPage <= $scope.numberOfPages() && $scope.currentPage !== 0) {
            $scope.currentPage = $scope.currentPage - 1;
        } else {
            $('#prevPage').prop('disabled', true);
        }
    }
    $scope.nextPage = function () {
        if ($scope.numberOfPages() >= $scope.currentPage) {
            $scope.currentPage = $scope.currentPage + 1;
        } else {
            $('#prevPage').prop('disabled', true);
        }
    }
    $scope.nokiriman = $stateParams._nokiriman;
    $scope.getDetailTrack = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xidkiriman: $scope.nokiriman
        };
        doPost($http, 'myexweb.extrackingdetail?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("Hide");
                $scope.dataTracking = result.LIST_TRACKING_DETAIL;
                $scope.jumlah = $scope.dataTracking[0].ID_KIRIMAN;
                $scope.infoKiriman = result.LIST_INFO;
                $scope.nokiriman = [];
            } else {
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
                $.LoadingOverlay("Hide");
            }
            $scope.nokiriman = [];
        });
    };
    $scope.showInfoKiriman = function () {
        $('#tanggalkirim').val($scope.infoKiriman[0].TGL_KIRIM);
        $('#produk').val($scope.infoKiriman[0].PRODUK);
        $('#pembayaran').val($scope.infoKiriman[0].PEMBAYARAN);
        $('#janjitiba').val($scope.infoKiriman[0].JANJI_TIBA);
        $('#pcsberat').val($scope.infoKiriman[0].PCS + ' pcs    /  ' + $scope.infoKiriman[0].BERAT + ' Kg');
        $('#totalcod').val($scope.infoKiriman[0].TOTAL_COD);

        $('#namapenerima').val($scope.infoKiriman[0].NAMA_PENERIMA);
        $('#perusahaanpenerima').val($scope.infoKiriman[0].PERUSAHAAN_PENERIMA);
        $('#alamatpenerima').val($scope.infoKiriman[0].ALAMAT_PENERIMA);
        $('#kodepospenerima').val($scope.infoKiriman[0].POS_PENERIMA);
        $('#kotapenerima').val($scope.infoKiriman[0].KOTA_PENERIMA);
        $('#notlppenerima').val($scope.infoKiriman[0].INPUT_HP_PENERIMA);

        $('#namapengirim').val($scope.infoKiriman[0].NAMA_PENGIRIM);
        $('#perusahaanpengirim').val($scope.infoKiriman[0].PERUSAHAAN_PENGIRIM);
        $('#alamatpengirim').val($scope.infoKiriman[0].ALAMAT_PENGIRIM);
        $('#kodepospengirim').val($scope.infoKiriman[0].POS_PENGIRIM);
        $('#kotapengirim').val($scope.infoKiriman[0].KOTA_PENGIRIM);
        $('#notlppengirim').val($scope.infoKiriman[0].INPUT_HP_PENGIRIM);

        $('#infokiriman').modal('show');
    };
    $scope.showKeluhan = function (id) {
        $('#keluhan').modal('show');
        $scope.idkiriman = id;
        console.log($scope.idkiriman);
    };
    $scope.getKeluhan = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xfungsi: 'MANIFEST'
        };
        doPost($http, 'myexweb.exgetmasterkeluhan?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listKeluhan = result.LIST_KELUHAN;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.pilihKeluhan = function (kode) {
        $scope.kodeKeluhan = kode;
    };
    $scope.postKeluhan = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xtipekasus: $scope.kodeKeluhan,
            xidkiriman: $('#idkiriman').val(),
            xremark: $scope.keterangan
        };
        doPost($http, 'myexweb.excreatekeluhanpup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
            $('#keluhan').modal('toggle');
        });
    };

    // ubah layanan
    $scope.showLayanan = function (id) {
        $('#layanan').modal('show');
        $scope.idkiriman = id;
        console.log($scope.idkiriman);
    };
    $scope.getLayanan = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xfungsi: 'MANIFEST'
        };
        doPost($http, 'myexweb.exgetmastertambahlayanan?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listLayanan = result.LIST_LAYANAN;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    };
    $scope.pilihLayanan = function (kode) {
        $scope.idlayanan = kode;
    };
    $scope.postLayanan = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xtoken: getCookie('token'),
            xloginfrom: 'W',
            xzona: getCookie('_zona'),
            xidkiriman: $('#idkiriman').val(),
            xremark: $scope.keterangan,
            xidlayanan: $scope.idlayanan
        };
        doPost($http, 'myexweb.excreatelayanan?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
            $('#layanan').modal('hide');
        });
    };
});

// FOR CONTROL
app.controller('buktiKiirimController', function ($scope, $http, $stateParams) {
    $scope.date = new Date();
    $scope.getParamCari = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: LOGIN_FROM,
            xuseridexact: getCookie('iduser'),
            xzona: getCookie('_zona'),
            xmenu: 'bukti kirim'
        };
        doPost($http, 'myexweb.exloadsearching?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.paramcari = result.LIST_SEARCH;
            } else {
            }
        });
    };
    $scope.getBuktiKiriman = function () {
        var param = {
            xuserid: getCookie('iduser'),
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: LOGIN_FROM,
            xuseridexact: getCookie('iduser'),
            xzona: getCookie('_zona')
        };
        doPost($http, 'myexweb.exbuktikirim?', param, function (result) {
            if (result.STATUS === 'OK') {
                $scope.dataBuktiKirim = result.DATA;
            } else {
            }
        });
    };

    $scope.print = function (data) {
        if (data.LINK !== undefined || data.LINK !== null || data.LINK === '') {
            window.open(data.LINK, '_blank');
        } else {
            reCreateBuktiKirim(data.NO_BUKTI);
        }
    };

    function reCreateBuktiKirim(nobukti) {
        $.alert({
            title: 'Info',
            content: 'Mohon menunggu, bukti kirim sedang diproses'
        });
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: LOGIN_FROM,
            xuseridexact: getCookie('iduser'),
            xzona: getCookie('_zona'),
            xnobuktikirim: nobukti
        };
        doPost($http, 'myexweb.exgenbuktikirim?', param, function (result) {
            if (result.STATUS === 'OK') {
                setTimeout(function () {
                    $.LoadingOverlay("hide");
                }, 1000);
            } else {
                $.alert({
                    title: 'Warning',
                    content: 'Maaf, bukti kirim gagal diproses'
                });
            }
        });
    }

    //KELUHAN
    $scope.showKeluhan = function (data) {
        $('#keluhan').modal('show');
        $scope.nopickup = data.NO_PICKUP;
    };
    $scope.getKeluhan = function (data) {
        $.LoadingOverlay("show");
        var param = {
            xuserid: getCookie('iduser'),
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: getCookie('token'),
            xkodeuser: getCookie('email'),
            xloginfrom: LOGIN_FROM,
            xfungsi: 'PICKUP'
        };
        doPost($http, 'myexweb.exgetmasterkeluhan?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
                $scope.listKeluhan = result.LIST_KELUHAN;
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    }
        ;
    $scope.pilihKeluhan = function (kode) {
        $scope.kodeKeluhan = kode;
    };
    $scope.postKeluhan = function () {
        $.LoadingOverlay("show");
        var param = {
            xuserid: ID_USER,
            xisadmin: IS_ADMIN,
            xidperusahaan: ID_KORPORASI,
            xidkontrak: ID_KONTRAK_PERSONAL,
            xidkontrakperusahaan: ID_KONTRAK_PERUSAHAAN,
            xtoken: TOKEN_USER,
            xkodeuser: EMAIL_USER,
            xloginfrom: LOGIN_FROM,
            xtipekasus: $scope.kodeKeluhan,
            xidpup: $('#nopickup').val(),
            xremark: $scope.keterangan
        };
        doPost($http, 'myexweb.excreatekeluhanpup?', param, function (result) {
            if (result.STATUS === 'OK') {
                $.LoadingOverlay("hide");
            } else {
                $.LoadingOverlay("hide");
                $.alert({
                    title: 'Error',
                    content: result.ERROR
                });
            }
        });
    };

});
