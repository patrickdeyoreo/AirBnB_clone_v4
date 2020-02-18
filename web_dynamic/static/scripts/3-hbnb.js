$(document).ready(() => {
  const amenities = {};
  $('input:checkbox').click(() => {
    $(this).each(() => {
      if (this.checked) {
        amenities[$(this).data('id')] = $(this).data('name');
      } else {
        delete amenities[$(this).data('id')];
      }
    });
    if (Object.values(amenities).length > 0) {
      $('.amenities h4').text(Object.values(amenities).join(', '));
    } else {
      $('.amenities h4').html('&nbsp');
    }
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', (data, status) => {
    if (data.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    processData: false,
    data: '{}',
    dataType: 'json',
    success: (places) => {
      $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/users/',
        type: 'GET',
        success: (users) => {
          const owners = {};
          for (const user of Object.values(users)) {
            owners[user.id] = [user.first_name, user.last_name].join(' ');
          }
          for (const place of Object.values(places)) {
            console.log(place);
            const article = $('<article>');
            const title = $('<div class="title">');
            title.append(`<h2>${place.name}</h2>`);
            title.append(`<div class="price_by_night">$${place.price_by_night}</div>`);
            const information = $('<div class="information">');
            const maxGuest = $('<div class="max_guest">').add(`<i class="fa fa-users fa-3x" aria-hidden="true"></i>${place.max_guest} Guests`);
            const numberRooms = $('<div class="number_rooms">').add(`<i class="fa fa-users fa-3x" aria-hidden="true"></i>${place.number_rooms} Bedrooms`);
            const numberBathrooms = $('<div class="number_bathrooms">').add(`<i class="fa fa-users fa-3x" aria-hidden="true"></i>${place.number_bathrooms} Bathrooms`);
            const owner = $('<div class="user">').add(`<strong>Owner: ${owners[place.user_id]}</strong>`);
            const description = $('<div class="description">').add(`<p>${place.description}</p>`);
            information.append(maxGuest);
            information.append(numberRooms);
            information.append(numberBathrooms);
            article.append(title);
            article.append(information);
            article.append(owner);
            article.append(description);
            $('.places').append(article);
          }
        }
      });
    }
  });
});
