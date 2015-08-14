$('table').on('click', 'td.fav', function(event) {
  $.get('/toggleFav', {id: $(event.target).attr('artistId')}, function() {
    location.reload();
  });
})
