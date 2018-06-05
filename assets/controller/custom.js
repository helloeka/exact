//  Side Menu
$(document).ready(function() {
    var sideslider = $('[data-toggle=collapse-side]');
    var sel = sideslider.attr('data-target');
    var sel2 = sideslider.attr('data-target-2');
    sideslider.click(function(event){
        $(sel).toggleClass('in');
        $(sel2).toggleClass('out');
    });
});

$('.benefit').owlCarousel({
    loop:false,
    margin:10,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:3
        }
    }
});

$('.feature').owlCarousel({
    loop:false,
    margin:10,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        600:{
            items:4
        },
        1000:{
            items:4
        }
    }
});

$('.testimonial').owlCarousel({
  autoWidth:false,
    loop:false,
    margin:10,
    nav:true,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>','<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive:{
        0:{
            items:1
        },
        600:{
            items:3
        },
        1000:{
            items:3
        }
    }
});
$('.modal-backdrop').remove();
