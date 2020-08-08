$(function () {
    $(document).scroll(function () {
      var $nav = $(".navbar");
      $nav.toggleClass('scrolled', $(this).scrollTop() > $nav.height());
    });
});

$(document).ready(function(){
  $(".navbar").on( "click", "button", function( event ) {
    $(event.delegateTarget ).css( "background-color", "#333333");
  });
});