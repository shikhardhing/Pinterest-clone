$(document).ready(function(){
  function reload(){
    $('.grid').masonry({
      // options
      itemSelector: '.grid-item',
      columnWidth: '.grid-item',
      gutter: 10,
      percentPosition: true
    });
  }
  $('.wrapper').imagesLoaded()
  .done( function( instance ) {
    console.log('all images successfully loaded');
    reload();
  })
  .fail( function() {
    console.log('all images loaded, at least one is broken');
    reload();
  })
  $('.fa-trash').on('click',function(){
    var id=$(this).attr('id')
    $.ajax({
      url:'/api/img/'+$(this).attr('id'),
      type:'DELETE'
    })
    .done(function(){
      console.log("deleted");
      $('#'+id).html('');
      reload();
    })
  })
  $('.link').on('blur',function(){
    $('.preview').html('<img src="'+$('.link').val()+'" class="previewImg"></img>');
  })
  $('.clos').on('click',function(){
    console.log("close");
    $('.form-wrapper').css('visibility','hidden');
  })
  $('.open').on('click',function(){
    console.log("open");
    $('.form-wrapper').css('visibility','visible')
  })
});
function imgError(image) {
  console.log("error");
  image.onerror = "";
  image.src = "http://placehold.it/200x100";
  return true;
}
