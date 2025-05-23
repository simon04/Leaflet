---
layout: tutorial_frame
title: Layers Control Tutorial
---
<script type="module">
	import L, {Map, TileLayer, Marker, LayerGroup, Control} from 'leaflet';
	const cities = new LayerGroup();
	const mLittleton = new Marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities);
	const mDenver = new Marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities);
	const mAurora = new Marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities);
	const mGolden = new Marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);
	const osm = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	});

	const osmHOT = new TileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
	});

	const map = new Map('map', {
		center: [39.73, -104.99],
		zoom: 10,
		layers: [osm, cities]
	});

	const baseLayers = {
		'OpenStreetMap': osm,
		'OpenStreetMap.HOT': osmHOT
	};

	const overlays = {
		'Cities': cities
	};

	const layerControl = new Control.Layers(baseLayers, overlays).addTo(map);

	const crownHill = new Marker([39.75, -105.09]).bindPopup('This is Crown Hill Park.');
	const rubyHill = new Marker([39.68, -105.00]).bindPopup('This is Ruby Hill Park.');

	const parks = new LayerGroup([crownHill, rubyHill]);

	const openTopoMap = new TileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
	});
	layerControl.addBaseLayer(openTopoMap, 'OpenTopoMap');
	layerControl.addOverlay(parks, 'Parks');

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>
