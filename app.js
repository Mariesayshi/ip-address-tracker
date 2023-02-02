// const map = document.querySelector(".map");
const sendBtn = document.querySelector(".sendBtn");
const input = document.querySelector(".ipInput");
const results = document.querySelector(".searchResults");
const ipRes = document.querySelector(".ipResult");
const locationRes = document.querySelector(".locationResult");
const timezoneRes = document.querySelector(".timezoneResult");
const ispRes = document.querySelector(".ispResult");
const apiUrl =
  "https://geo.ipify.org/api/v2/country,city?apiKey=at_mIAUeWmlHtHPm7VUMDG14L2SBfmEs&ipAddress=";
let resData = {};
let clientIp;

fetch("https://api.ipify.org?format=json")
  .then((res) => res.json())
  .then((res) => {
    clientIp = res.ip;
    fetch(apiUrl + clientIp)
      .then((res2) => res2.json())
      .then((res2) => {
        resData = res2;
        updatePage(resData);
      });
  });

let map = L.map("map", { zoomControl: false });
map.setView([0, 0], 16);

let tileLayer = L.tileLayer(
  "https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}",
  {
    attribution:
      '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 22,
    subdomains: "abcd",
    accessToken:
      "nuByJAnj8MJqNyhddzirO7fejcYyoOFvJRo95Y8JIF1FEqvvir8lAgiHPosohDTV",
  }
);

let getMap = (lat, lng) => {
  map.setView(new L.LatLng(lat, lng), 17);
  tileLayer.addTo(map);
  let markerIcon = L.icon({
    iconUrl: "./images/marker-icon.svg",
    iconSize: [38, 95], // size of the icon
    iconAnchor: [22, 70], // point of the icon which will correspond to marker's location
  });
  let marker = L.marker([lat, lng], { icon: markerIcon }).addTo(map);
};

sendBtn.addEventListener("click", () => {
  let inputIp = input.value;
  input.value = "";
  fetch(apiUrl + inputIp)
    .then((res) => res.json())
    .then((res) => {
      resData = res;
      updatePage(resData);
    });
});

window.addEventListener("keydown", (e) => {
  console.log(e);
  if (e.key === "Enter" && input.value !== "") {
    let inputIp = input.value;
    input.value = "";
    fetch(apiUrl + inputIp)
      .then((res) => res.json())
      .then((res) => {
        resData = res;
        updatePage(resData);
      });
  } else if (
    isNaN(parseInt(e.key)) &&
    e.key !== "." &&
    e.key !== "Backspace" &&
    e.key !== "Delete" &&
    e.key !== "ArrowLeft" &&
    e.key !== "ArrowRight" &&
    e.key !== "Contol" &&
    (!e.ctrlKey || e.key !== "v") &&
    !(e.ctrlKey && e.key === "c") &&
    !(e.ctrlKey && e.key === "x") &&
    !(e.ctrlKey && e.key === "a") &&
    !(e.ctrlKey && e.key === "z") &&
    !(e.ctrlKey && e.key === "y")
  ) {
    e.preventDefault();
  }
});

let updatePage = (data) => {
  ipRes.innerText = data.ip;
  ispRes.innerText = data.isp;
  timezoneRes.innerText = `UTC ${data.location.timezone}`;
  let loc = `${data.location.city}, ${data.location.region}, ${data.location.postalCode}`;
  while (loc[loc.length - 2] === ",") {
    loc = loc.slice(0, -2);
  }
  locationRes.innerText = loc;
  getMap(data.location.lat, data.location.lng);
};
