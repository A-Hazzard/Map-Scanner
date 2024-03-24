$(document).ready(function() {
  //  const url = 'http://localhost:3000'
   const url = 'https://map-scanner-1.onrender.com'
   
   $('#reportForm').submit(function(e) {
    e.preventDefault();

    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      var formData = new FormData();
      formData.append('description', $('#description').val());
      formData.append('latitude', position.coords.latitude.toString());
      formData.append('longitude', position.coords.longitude.toString());

      // Determine which file input is being used
      var fileInput = $('#photoFromCamera').get(0).files.length ? $('#photoFromCamera').get(0) : $('#photoFromStorage').get(0);

      // Append the selected photo to formData
      if (fileInput.files.length > 0) {
        formData.append('photo', fileInput.files[0]);
      } else {
        alert('Please select a photo.');
        return;
      }

      $.ajax({
        url: url + '/reports',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function(data) {
          alert('Report submitted successfully!');
          // Reset the form or perform other actions after successful submission
        },
        error: function(xhr, status, error) {
          console.error('An error occurred:', error);
          alert('An error occurred while submitting your report. Please try again.');
        }
      });
    }, function(error) {
      alert('Error getting geolocation: ' + error.message);
    });
  });

  // Handle file name display for the camera input
  $('#photoFromCamera').on('change', function() {
    if (this.files && this.files.length > 0) {
      const fileName = this.files[0].name;
      $('#photoName').text(" " + fileName);
    }
  });
    function createMap(){
      var map = L.map('map').setView([10.4918, -61.3225], 11);

      // Use a dark-themed tile layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19
      }).addTo(map);

      // Define a blue dot marker using a divIcon
      var blueDot = L.divIcon({
        className: 'blue-dot',
        html: '<div></div>',
        iconSize: [10, 10],
        iconAnchor: [5, 5]
      });;

      function addReportMarkers() {
        // Fetch report data from the server
        $.getJSON(url+'/reports', function(data) {
          const { reports, clusters } = data;
          console.log(reports, clusters)
          // First, add markers for each report
          reports.forEach(function(report) {
            var marker = L.marker([report.latitude, report.longitude], { icon: blueDot }).addTo(map)
              .bindPopup(`<h3>Description</h3><p>${report.description}</p>
                          <img src="${report.photo}" alt="Reported Image" style="width:100%;">`);
            
            // Modify here to use flyTo
            marker.on('click', function(e) {
              map.flyTo(e.latlng, 18); // Use flyTo for a smooth zoom effect
            });
          });
      
          // Then, visualize the high-priority zones
          clusters.forEach(function(zone) {
            var circle = L.circle([zone.center.latitude, zone.center.longitude], {
              color: 'red',
              fillColor: '#f03',
              fillOpacity: 0.5,
              radius: 80 // Adjust the radius as needed
            }).addTo(map);
            
            // Modify here to use flyTo
            circle.on('click', function(e) {
              map.flyTo(e.latlng, 18); // Use flyTo for a smooth zoom effect
            });
          });
        });
      }
    
        // Call the function to add markers to the map
        addReportMarkers();
    }

    createMap()


  });
  