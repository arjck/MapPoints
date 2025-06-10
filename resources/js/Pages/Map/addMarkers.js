function createMarker(map, markers, position, input1, input2, pointId = null) {
  const marker = new google.maps.Marker({
    position,
    map,
    draggable: true
  });

  if (pointId !== null) {
    marker.pointId = pointId;
  }

  marker.addListener('click', () => {
    marker.setMap(null);
    const index = markers.indexOf(marker);
    console.log("index", index)
    if (index !== -1) {
      markers.splice(index, 1);
      console.log("spliced markers", markers)
    }
    // Optionally, delete from DB
    deleteMarkerFromDB(marker.pointId);
  });

  // Info window with info
  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setContent(`Text1: ${input1} <br> Text2: ${input2} <br>`);
  infoWindow.open(map, marker);

  // Update DB on drag end
  marker.addListener('dragend', () => {
    const position = marker.getPosition();
    // Show info window or update DB
    // For example:\
    // const position = marker.getPosition();
    infoWindow.close();
    infoWindow.setContent(`Text1: ${input1} <br> Text2: ${input2} <br> Dropped at: ${position.lat().toFixed(5)}, ${position.lng().toFixed(5)}`);
    infoWindow.open(map, marker);

    updateDB(position, input1, input2, marker.pointId);
  });

  // Add marker to array
  // markers.push(marker);
  return marker;
}

// Load markers from backend and add to map
function readDB(markers, map) {
  fetch('/api', {
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    }
  })
  .then(response => response.json())
  .then(data => {
    if (data) {
      console.log('Markers loaded:', data);
      // Clear existing markers
      // markers.forEach(m => m.setMap(null));
      // markers.length = 0; // Reset array

      data.forEach(m => {
        const position = { lat: m.latitude, lng: m.longitude };
        createMarker(map, markers, position, m.title1, m.title2, m.id);
      });
      console.log('Markers count:', markers.length);
    } else {
      console.error('Failed to load markers');
    }
  })
  .catch(error => console.error('Error:', error));
}

// Initialize map
export async function initMap({ mapContainer, LAT, LON, ZOOM, markers, addMarkerCallback }) {
  const map = new google.maps.Map(mapContainer, {
    center: { lat: LAT, lng: LON },
    zoom: ZOOM,
  });

  await readDB(markers, map);

  // Add new marker on map click
  map.addListener('click', (event) => {
    addMarkerCallback(map, markers, event.latLng);
  });

  return map;
}

// Function to get two input texts from user
function getTwoInputs() {
  const input1 = prompt("Enter the first text:");
  if (input1 === null) return null;
  const input2 = prompt("Enter the second text:");
  if (input2 === null) return null;
  return { input1, input2 };
}

// Save marker data to backend
function updateDB(latLng, title1, title2, pointId = null) {
  const url = pointId !== null ? `/api/points/${pointId}` : '/api/points';
  const method = pointId !== null ? 'PUT' : 'POST';

  fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    },
    body: JSON.stringify({
      latitude: latLng.lat(),
      longitude: latLng.lng(),
      title1,
      title2
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      console.log('Marker saved:', data.marker);
    } else {
      console.error('Failed to save marker');
    }
  })
  .catch(error => console.error('Error:', error));
}

// Optional: delete marker from database
function deleteMarkerFromDB(pointId) {
  if (!pointId) return;
  fetch(`/api/points/${pointId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
    }
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      console.log(`Marker ${pointId} deleted from DB`);
    } else {
      console.error(`Failed to delete marker ${pointId}`);
    }
  })
  .catch(error => console.error('Error:', error));
}

// Add marker function, called on map click
export function addMarker(map, markers, latLng) {
  const inputs = getTwoInputs();

  if (inputs) {
    const { input1, input2 } = inputs;
    const marker = createMarker(map, markers, latLng, input1, input2, null);

    // Save to DB (assuming server assigns an ID later)
    updateDB(latLng, input1, input2, marker.pointId || null);

    // Info window with info
    const infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(`Text1: ${input1} <br> Text2: ${input2} <br>`);
    infoWindow.open(map, marker);

    // Drag end event to update DB
    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      infoWindow.close();
      infoWindow.setContent(`Text1: ${input1} <br> Text2: ${input2} <br> Dropped at: ${position.lat().toFixed(5)}, ${position.lng().toFixed(5)}`);
      infoWindow.open(map, marker);
      updateDB(position, input1, input2, marker.pointId || null);
    });
  }
}