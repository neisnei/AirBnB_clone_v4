#!/usr/bin/node
function printPlace(obj) {
    $('.places').append(`
        <article>
            <div class="title_box">
                <h2>${obj.name}</h2>
                <div class="price_by_night">$${obj.price_by_night}</div>
            </div>
            <div class="information">
              <div class="max_guest">${obj.max_guest} Guests</div>
              <div class="number_rooms">${obj.number_rooms} Bedrooms</div>
              <div class="number_bathrooms">${obj.number_bathrooms} Bathrooms</div>
            </div>
            <div class="description">
                ${obj.description}
            </div>
        </article>`)
}

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
      $('.amenityFilter h4').text(Object.values(amenityIds).join(', '));
    });
    $('button').click(function () {
        if (Object.keys(amenityIds) !== 0) {
            $('.places').text(''); 
            $.ajax({
                type: 'POST',
                url: 'http://0.0.0.0:5001/api/v1/places_search/',
                contentType:"application/json; charset=utf-8",
                data: JSON.stringify({}),
                success: function(data, status) {
                  data.sort((a, b) => a.name.localeCompare(b.name));
                for (const place of data) {
                    $.ajax({
                        type: 'GET',
                        url: `http://0.0.0.0:5001/api/v1/places/${place.id}/amenities`,
                        success: (results) => {
                            let idArray = results.map(obj => obj.id);
                            if (Object.keys(amenityIds).every(value => idArray.includes(value))) {
                                printPlace(place);
                            }
                        }
                    });
                };
            }});
        };
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
            data.sort((a, b) => a.name.localeCompare(b.name));
            for (const place of data) {
                printPlace(place);
                };
            }
        });
    });
});