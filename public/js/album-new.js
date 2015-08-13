var $searchBtn = $(".artist-search button");
var $searchInput = $(".artist-search input");

$searchBtn.on('click', function(){
  var artistQuery = $searchInput.val();
  var searchObj = {artist: artistQuery};
  $(".artist-options") && $(".artist-options").empty();
  $.get('/search', searchObj).done(
    function(results) {
      appendResults(results);
    });
});

catchReturns($searchInput, $searchBtn);

function catchReturns(where, what) {
  where.keyup(function(event){
    if(event.keyCode == 13){
      what.click();
    }
  });
}

function appendResults(results) {
  var element = $("<div>").append($("<h3>Artists Found:</h3>"));
  results.forEach(function(result) {
    var entry = $('<p>').text(result.name);
    entry
      .append($('<button>')
      .attr('name', result.name)
      .attr('_id', result._id)
      .text("choose"));
    element.append(entry);
  })
  $('.artist-options').append(element);
}

$(".artist-options").on('click', 'button', function(event) {
  var artistName = $(event.target).attr('name');
  var _id = $(event.target).attr('_id');
  $('.artist-options').attr('class', 'hidden');
  $('.artist-search').attr('class', 'hidden');
  $('.artist-form').removeClass('hidden');
  $('.artist-form tr:first-of-type td:first-of-type').text(artistName);
  $('.artist-form input.hidden:nth-of-type(2)').val(artistName);
  $('.artist-form input.hidden:first-of-type').val(_id);
})
