//custom scripts

$(document).ready(function () {

  $('.sec-wrap__link').on('click', function (e) {
    e.preventDefault();
    var oneOffset = $('#js-one').offset().top;

    $("html, body").animate({
      scrollTop: oneOffset
    }, 500)
  });
  // arrow-up
  $('.arrow-up').on('click', function (e) {
    e.preventDefault();
    var upOffset = $('#top').offset().top;

    $("html, body").animate({
      scrollTop: upOffset
    }, 1200)
  });

  // smooth scroll from menu

  $('.main-nav__link').on('click', function (e) {
    e.preventDefault();

    var currBlock = $(this).attr('href');

    var currBlockOffset = $(currBlock).offset().top;
    $("html, body").animate({
      scrollTop: currBlockOffset
    }, 1000)
  });

  // select categories portfolio

  $('.portfolio__cat-link').on('click', function (e) {
    e.preventDefault();
    var currCat = $(this).attr('href');
    if (currCat == '.all') {
      $('.portfolio__elem').fadeIn(600);
    } else {
      console.log(currCat);
      $('.portfolio__elem:not(' + currCat + ')').fadeOut(600);
      $(currCat).fadeIn(600);
    }

  })

});