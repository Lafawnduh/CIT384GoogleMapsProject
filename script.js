let map;
let rounds = 5;
let score = 0;
let activeRound;
let gameEnded = false;
const locations = [
  { name: "Baseball Field", coords: { lat: 34.245680, lng: -118.526382 } },
  { name: "Sequoia Hall", coords: { lat: 34.240407, lng: -118.527927 } },
  { name: "Student Recreation Center", coords: { lat: 34.239977, lng: -118.524889 } },
  { name: "Tennis Courts", coords: { lat: 34.244150, lng: -118.524019 } },
  { name: "University Hall", coords: { lat: 34.239760, lng: -118.532150 } },
];

async function initMap() {
  const { Map, LatLngBounds, Rectangle } = await google.maps.importLibrary("maps");
  map = new Map(document.getElementById("map"), {
    center: { lat: 34.242573, lng: -118.529456 },
    zoom: 16,
    draggable: false,
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    styles: [
      {
        featureType: "all",
        elementType: "labels",
        stylers: [
          { visibility: "off" }
        ]
      }
    ]
  });

  map.addListener("dblclick", (e) => {
    if (!startTime) {
      startTime = new Date().getTime();
      setInterval(updateTimer, 1000);
    }
    if (activeRound) {
      let isCorrect = false;
  
      if (e.latLng.lat() > activeRound.coords.lat - 0.001 && e.latLng.lat() < activeRound.coords.lat + 0.001 &&
          e.latLng.lng() > activeRound.coords.lng - 0.001 && e.latLng.lng() < activeRound.coords.lng + 0.001) {
        document.getElementById("feedback").textContent = "Correct!";
        score++;
        isCorrect = true;
      } else {
        document.getElementById("feedback").textContent = "Wrong!";
      }
  
      const rectangle = new Rectangle({
        strokeColor: isCorrect ? "#008000" : "#FF0000",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: isCorrect ? "#008000" : "#FF0000",
        fillOpacity: 0.35,
        map,
        bounds:{
        north: activeRound.coords.lat + 0.001,
        south: activeRound.coords.lat - 0.001,
        east: activeRound.coords.lng + 0.001,
        west: activeRound.coords.lng - 0.001,
      },
      });
  
      rounds = rounds - 1;
      if (rounds > 0) {
        startRound();
      } else {
        gameEnded = true;
        document.getElementById("prompt").textContent = "Game over!";
        document.getElementById("score").textContent = `You got ${score} correct and ${5 - score} incorrect.`;
        document.getElementById("feedback").textContent = "";
        activeRound = null;
      }
    }
  });

  startRound();
}

function startRound() {
  activeRound = locations[rounds - 1];
  document.getElementById("prompt").textContent = `Round ${6 - rounds}: Double click on the ${activeRound.name}`;
  document.getElementById("score").textContent = `Score: ${score}`;
}

let startTime = null;

function updateTimer() {
  if (startTime && !gameEnded) {
    const currentTime = new Date().getTime();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000);
    const minutes = Math.floor(elapsedTime / 60);
    const seconds = elapsedTime % 60;
    document.getElementById("timer").textContent = `Time: ${minutes}:${seconds.toString().padStart(2, "0")}`;
  }
}

initMap();
