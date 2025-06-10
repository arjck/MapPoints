<template>
  <div class="relative w-full px-6 bg-gray-400">
    <header
        class="grid grid-cols-2 items-center gap-2 lg:grid-cols-3"
    >
      <nav v-if="canLogin" class="flex justify-start" >
          <Link
              v-if="$page.props.auth.user"
              :href="route('dashboard')"
              class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
          >
              Dashboard
          </Link>

          <template v-else>
              <Link
                  :href="route('login')"
                  class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
              >
                  Log in
              </Link>

              <Link
                  v-if="canRegister"
                  :href="route('register')"
                  class="rounded-md px-3 py-2 text-black ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[#FF2D20] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white"
              >
                  Register
              </Link>
          </template>
      </nav>
    </header>
  </div>
  <div ref="mapContainer" style="height: 1000px;"></div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  import { Loader } from "@googlemaps/js-api-loader";
  import { initMap, addMarker } from './addMarkers.js';
  import { Head, Link } from '@inertiajs/vue3';

  const mapContainer = ref(null);
  const map = ref(null);
  const markers = ref([]);
  const apiKey = 'AIzaSyA8YsnNE8QrgExwmp7fwkmd7WylFiwRJs0';
  const LAT = 55.733842;
  const LON = 37.588144;
  const ZOOM = 14;

  const props = defineProps({
      canLogin: {
          type: Boolean,
      },
      canRegister: {
          type: Boolean,
      },
      laravelVersion: {
          type: String,
          required: true,
      },
      phpVersion: {
          type: String,
          required: true,
      },
      isAuthorized: {
          type: Boolean,
      },
  });

  onMounted(async () => {
    const loader = new Loader({
      apiKey: apiKey,
      version: "weekly",
    });

    try{
      await loader.load()
       // initMap();
      const externalFunction = props.isAuthorized == true ? (map, markers, latLng) => addMarker(map, markers, latLng) : () => {};

      console.log("isAuthorized", props.isAuthorized)


      map.value = initMap({
        mapContainer: mapContainer.value,
        LAT,
        LON,
        ZOOM,
        markers: markers.value,
        addMarkerCallback: externalFunction,
      });
    } catch (error) {
      console.error("Failed to load Google Maps API:", error);
    }
  });

  onUnmounted(() => {
     if (map.value) {
        google.maps.event.clearInstanceListeners(map.value);
      }
  });

  
</script>
