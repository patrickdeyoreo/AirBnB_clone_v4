$(function () {
  const locations = {};
  const amenities = {};
  $('div.amenities li input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenities[$(this).data('id')];
    }
    if (Object.values(amenities).length > 0) {
      $('div.amenities h4').text(Object.values(amenities).join(', '));
    } else {
      $('div.amenities h4').html('&nbsp');
    }
  });
  const cities = {};
  $('div.locations li.city input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).data('id')] = $(this).data('name');
      locations[`City.${$(this).data('id')}`] = $(this).data('name');
    } else {
      delete cities[$(this).data('id')];
      delete locations[`City.${$(this).data('id')}`];
    }
    if (Object.values(locations).length > 0) {
      $('div.locations h4').text(Object.values(locations).join(', '));
    } else {
      $('div.locations h4').html('&nbsp');
    }
  });
  const states = {};
  $('div.locations li.state input[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).data('id')] = $(this).data('name');
      locations[`State.${$(this).data('id')}`] = $(this).data('name');
    } else {
      delete states[$(this).data('id')];
      delete locations[`State.${$(this).data('id')}`];
    }
    if (Object.values(locations).length > 0) {
      $('div.locations h4').text(Object.values(locations).join(', '));
    } else {
      $('div.locations h4').html('&nbsp');
    }
  });
  $.get('http://0.0.0.0:5001/api/v1/status/', (response) => {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });
  $('button').click(() => {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        amenities: Object.keys(amenities),
        cities: Object.keys(cities),
        states: Object.keys(states)
      }),
      success: (places) => {
        const section = $('section.places');
        section.empty();
        $.get('http://0.0.0.0:5001/api/v1/users/', (users) => {
          for (const user of Object.values(users)) {
            users[user.id] = `${user.first_name} ${user.last_name}`;
          }
          for (const place of Object.values(places)) {
            const article = $('<article>');
            const name = $('<div class="title">');
            name.append(`<h2>${place.name}</h2>`);
            name.append(`<div class="price_by_night">$${place.price_by_night}</div>`);
            article.append(name);
            const info = $('<div class="information">');
            const maxGuest = $('<div class="max_guest">');
            maxGuest.append('<i class="fa fa-users fa-3x" aria-hidden="true"></i>');
            maxGuest.append(`${place.max_guest} Guests`);
            info.append(maxGuest);
            const numRooms = $('<div class="number_rooms">');
            numRooms.append('<i class="fa fa-bed fa-3x" aria-hidden="true"></i>');
            numRooms.append(`${place.number_rooms} Bedrooms`);
            info.append(numRooms);
            const numBaths = $('<div class="number_bathrooms">');
            numBaths.append('<i class="fa fa-bath fa-3x" aria-hidden="true"></i>');
            numBaths.append(`${place.number_bathrooms} Bathrooms`);
            info.append(numBaths);
            article.append(info);
            const user = $('<div class="user">');
            user.append(`<strong>Owner: ${users[place.user_id]}</strong>`);
            article.append(user);
            const desc = $('<div class="description">');
            desc.append(`<p>${place.description}</p>`);
            article.append(desc);
            section.append(article);
          }
        });
      }
    });
  });
});
