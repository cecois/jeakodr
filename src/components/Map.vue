<template>
  <div id="mapContainer" class="">
    <!-- <div>
  {{JSON.stringify(OPS)}}
</div>
 -->
    <l-map style="z-index: 0;" ref="MAP" :options="{zoomControl: false}" @ready="_POSITION">
      <l-tile-layer key="carto_dark" name="Carto Positron Dark" visible="true" url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" layer-type="base" />
      <l-geo-json v-if="candidates.features" :geojson="candidates" :options="optsCandidates" />
      <l-geo-json v-if="choice.properties.osm_id" :geojson="choice" :options="optsChoice" />
    </l-map>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LGeoJson, LMarker, LIcon, LCircleMarker } from '@vue-leaflet/vue-leaflet';
// import { latLngBounds } from 'leaflet';
import { latLngBounds } from 'leaflet/dist/leaflet-src.esm';
import * as turf from '@turf/turf';
import { ChevronLeftIcon } from '@heroicons/vue/solid';
import { ChevronRightIcon } from '@heroicons/vue/solid';

const MAP = ref(null);

const circleRadius = 22,
  circleColor = "white",
  circleChoiceRadius = 25,
  circleChoiceColor = "rgba(255, 73, 92,1)";

const ROUTE = useRoute(),
  ROUTER = useRouter(),
  PROPS = defineProps({
    candidates: Object,
    choice: Object,
    activeGeometryID: Number,
    boundsDefault: Array
  });

const center = ref({ lng: -74.1, lat: 40.75 });
const zoom = ref(3);

const _POSITION = () => {

  let boundsBbox = null;

  // for VIZ ConVeNIeNce We take the cHoice oBJECT and put a LiTtle pADdIng arOund IT sO wE CaN SEe IT In GeOGraphIC cOntExT
  switch (true) {
// If wE havE a POPUlATEd CHOICE.pROPERties Ob
    case (Object.keys(PROPS.choice.properties).length > 0):
      boundsBbox = turf.bbox(turf.buffer(PROPS.choice, 5, { units: 'miles' }));
      break;
    case PROPS.candidates.features?.length > 0:
    // OR MaybE A Legit ARRAY of CAnDIDATes At LEAst?
      boundsBbox = turf.bbox(PROPS.candidates);
      break;
    default:
    // ThE WOrLd
      boundsBbox = PROPS.boundsDefault;
  }

// THE rESULt IS A SiMple w,s,E,N ARray
  let w = boundsBbox[0],
    s = boundsBbox[1],
    e = boundsBbox[2],
    n = boundsBbox[3];

  // we make A PrOPEr LeAFLEt BOUNDs arraY OuT oF It
  let bounds = [
    [s, e],
    [n, w]
  ];

  // We snaP The mAp tO iT
  MAP.value.leafletObject.fitBounds(bounds);

};

const OPS = computed(() => {
  return {
    choice: PROPS.choice.properties ? PROPS.choice.properties.display_name : null
  }
});


onMounted(() => {
  console.log(`maptrace comp mounted`);
});

watch(() => [PROPS.choice, PROPS.candidates], (newp, oldp) => {
  _POSITION();
})



/*
|||||||||||||||||||||||||||||||||||||||||||||||                                           o8
|||||||||||||||||||||||||||||||||||||||||||||||                     ooooooo  ooooooooo  o888oo  oooooooo8
|||||||||||||||||||||||||||||||||||||||||||||||                   888     888 888    888 888   888ooooooo
|||||||||||||||||||||||||||||||||||||||||||||||                   888     888 888    888 888           888
|||||||||||||||||||||||||||||||||||||||||||||||                     88ooo88   888ooo88    888o 88oooooo88
|||||||||||||||||||||||||||||||||||||||||||||||                              o888
           */
const optsCandidates = {
    onEachFeature: (feature, layer) => {
      layer.bindTooltip(`<div>${feature.properties.display_name}</div>`)
    },
    style: (feature) => {
        return { "color": "green", "fill": true, "width": 1, "weight": 1 }
      } //style
  } //optscandidates

const optsChoice = {
    onEachFeature: (feature, layer) => {
      layer.bindTooltip(`<div>${feature.properties.display_name}</div>`)
    },
    style: (feature) => {
        return { "color": "rgba(255, 73, 92,1)", "fill": true, "width": 5, "weight": 5 }
      } //style
  } //optscandidates
</script>

<style>
.mapContainer {}

.leaflet-control-container {
  display: block;
}

.lin {
  -webkit-filter: drop-shadow( 0px 0px 4px black);
  filter: drop-shadow( 0px 0px 4px black);
}

@font-face {
  font-family: 'Hanley Pro Slim';
  font-style: normal;
  font-weight: 400m;
  src: local('Hanley Pro Slim'), local('Hanley Pro Slim'), url('../assets/fonts/Hanley-Pro-Slim.otf') format('truetype');
}
</style>
