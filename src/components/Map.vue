<template>
  <div id="mapContainer" class="">
    <div>
      {{JSON.stringify(OPS)}}
    </div>
    <l-map style="z-index: 0;" class="" ref="MAP" :zoom="zoom" :center="center" :options="{zoomControl: false,maxBounds:[
    [-89.9, -180],
    [89.9, 180]
]}">
      <l-tile-layer key="carto_dark" name="Carto Positron Dark" visible="true" url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png" layer-type="base" />
      <l-geo-json v-if="candidates.features" :geojson="candidates" :options="optsCandidates" />
      <l-geo-json v-if="choice.properties" :geojson="choice" :options="optsChoice" />
    </l-map>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LGeoJson, LMarker, LIcon, LCircleMarker } from '@vue-leaflet/vue-leaflet';
import { latLngBounds } from 'leaflet';
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
    activeGeometryID: Number
  });

const OPS = computed(() => {
  return {
    choice: PROPS.choice.properties ? PROPS.choice.properties.display_name : null
  }
});

const center = [44, -80];
const zoom = 3;

onMounted(() => {
  console.log(`maptrace comp mounted`);
});

const location = [40, -80];

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
