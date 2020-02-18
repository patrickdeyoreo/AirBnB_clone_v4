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
        type: 'post',
        data: {},
        headers: {'Content-Type': 'application/json'},
        dataType: 'json',
        success: (data) => {
          for (const place of Object.values(data)) {
            console.log(place);
          }
        }
  });
});
