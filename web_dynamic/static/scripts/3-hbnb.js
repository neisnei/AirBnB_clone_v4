#!/usr/bin/node
$(document).ready(function () {
    const amenityIds = {};
  
    $('input[type=checkbox]').change(function () {
      const amenityId = $(this).data('id');
      const amenityName = $(this).data('name');
  
      if ($(this).prop('checked')) {
        amenityIds[amenityId] = amenityName;
      } else {
        delete amenityIds[amenityId];
      }
  
      $('.amenities h4').text(Object.values(amenityIds).join(', '));
    });
  });
  
$(() => {
    $.ajax({
      type: 'GET',
      url: 'http://0.0.0.0:5001/api/v1/status/',
      success: (data) => {
        if (data.status === 'OK') {
          $('div#api_status').addClass('available');
        } else {
          $('div#api_status').removeClass('available');
        }
      },
      error: () => {
        $('div#api_status').removeClass('available');
      }
    });
});

$(() => {
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType:"application/json; charset=utf-8",
      data: JSON.stringify({}),
      success: function(data, status) {
        console.log(data);
        for (place of data) {
            $('.places').append(`
            <article>
                <div class="title_box">
	                <h2>${place.name}</h2>
	                <div class="price_by_night">$${place.price_by_night}</div>
	            </div>
                <div class="information">
                    <div class="max_guest">${place.max_guest}Guests</div>
                    <div class="number_rooms">${place.number_rooms}Bedrooms</div>
                    <div class="number_bathrooms">${place.number_bathrooms}Bathrooms</div>
                </div>
                <div class="description">
                    ${place.description}
                    </div>
                </article>`)};
        }
    });
});