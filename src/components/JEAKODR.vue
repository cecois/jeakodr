<template>
  <div id="template-root p-0 m-0" class="h-screen">
    <!-- <p class="z-50 absolute text-black bg-white">
  <span v-for="c in allCandidates">{{c}}</span>
</p>
 -->
    <section v-if="!collapsed" id="queryMenu" class="absolute z-50 w-screen flex bg-gray-100 justify-center items-center">
      <input v-model="query" type="text" id="queryInput" class="block p-4 w-full h-full rounded-sm sm:text-lg focus:ring-blue-500 focus:border-blue-500 text-center">
    </section>
    <section id="queryResults" class="absolute z-50 w-screen flex justify-center items-center">
      <div class="z-10 absolute w-48 h-48 rounded-lg bg-green-500">
        <p @click="collapsed=!collapsed">CLpS</p>
        <p @click="getCandidates">GtcnDdd</p>
        <!-- <p @click="DEV">DEV</p> -->
      </div>
      <div v-for="candidate in candidates.features" class="relative w-48 h-48 rounded-lg bg-gray-200 mr-1 p-2">{{launderOSMDisplay(candidate.properties,'display_name')}}
        <p @click="setChoiceGeometry(candidate.properties.osm_id)">({{candidate.geometry.type.toLowerCase()}})</p>
      </div>
    </section>
    <Map class="h-full" :candidates="candidates" :choice="choice" />
  </div>
  <!-- root -->
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, reactive, onMounted, watch } from 'vue';
import { latLngBounds, latLng } from 'leaflet';
import * as turf from '@turf/turf';

import Map from '/src/components/Map.vue';

const LOADING = false;

const ROUTE = useRoute(),
  ROUTER = useRouter(),
  PROPS = defineProps({
    query: String
  });


/*
                                              .      .
                                          ,-. |- ,-. |- ,-.
                                          `-. |  ,-| |  |-'
                                          `-' `' `-^ `' `-'
*/
const collapsed = ref(true);

const candidates = ref({});
const choice = ref({});


const setChoiceGeometry = (id) => {

  // if we have a choice already AND it matches the incoming id, we null it out
  // otherwise we probe candidates for the id and set it
  let newChoice = (choice.value.properties && choice.value.properties.osm_id) == id ? {} : candidates.value.features.find(fea => {
    return fea.valueOf().properties.osm_id == id
  })
  choice.value = newChoice;
};

const launderOSMDisplay = (fea, prop) => {
  return fea.valueOf()[prop].split(",").filter((propel, propeli) => {
    return propeli < 3 ? propel : null;
  }).join(", ")
}


onMounted(() => {
  console.log(`jeakodr comp mounted`);
  PROPS.query && console.info(`incoming query is ${PROPS.query} so we wanna fire the geocode here`);
  PROPS.query && getCandidates()

});


const getCandidates = () => {
    // GeT ThE stuFF
    fetch("https://nominatim.openstreetmap.org/search?q=mahomet&format=geojson&polygon_geojson=1&email=lennybones@ymail.com&dedupe=1&addressdetails=1&extratags=1&namedetails=1", {
      headers: { 'Access-Control-Allow-Origin': '*' },
      "method": "GET",
      "mode": "cors"
    }).then(async res => {
      // to LOCAl OBject
      let response = await res.json();

      // WORkINg cOpy oF tHE feaTuREs themseLVES
      let features = response.features;
      let featuresClone = structuredClone(response.features);

      // LETS rOOt arOuNd in ThERE and tAKE tHosE godAm fUggin pOints aND BUFfEr EM INtO polYS - LCircleMarker workaround
      let newFeatures = featuresClone.map(fea => {
        return fea.geometry.type == "Point" ? turf.buffer(fea, 10, { units: 'kilometers' }) : fea
      });

      // newFeatures.forEach(nf => { // console.log(`nf.geometry.type for ${nf.properties.display_name}:`, nf.geometry.type); // // console.log(`area for ${nf.properties.display_name}:`, turf.area(nf)); // });


      // yank the points
      // let ponts = features.filter(fea => fea.geometry.type == 'Point');
      // yank the polys (poly, line, multi*)
      // let polys = features.filter(fea => fea.geometry.type !== 'Point');
      // let polys = newFeatures;

      // put just the polys back as geojson - the poly rendering works fine
      response.features = newFeatures;
      // candidatesPoly.value = response;
      candidates.value = response;
      // but candidatesPont get just a features array - the circlemarker problem goes away outside of geojson
      // candidatesPont.value = ponts;


    }).catch(e => console.log(e));
  } //getcandidates
</script>

<style>
body {
  font-family: 'overpass';
  font-weight: 800;
}

#queryMenu {
  background-color: rgba(244, 244, 244, .5);
  height: 25vh;
  top: 50%;
}

#queryResults {
  top: 2em;
  background-color: rgba(244, 244, 244, .9);
}

#queryInput {
  font-size: 3em;
}
</style>
