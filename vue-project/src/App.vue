<script setup lang="ts">
import { RouterView } from 'vue-router'
import {onMounted} from "vue";
import {usePositionStore} from "@/stores/position";
import axios from "axios";

const positionStore = usePositionStore();

function getCurrentPosition() {
  if (!navigator.geolocation) {
    positionStore.isReject = false;
  } else {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          positionStore.position.latitude = latitude;
          positionStore.position.longitude = longitude;
          axios.get(`https://restapi.amap.com/v3/geocode/regeo?output=json&location=${longitude},${latitude}&key=a0df2fa862ffca194e3d3b8c4fcd8cbf&radius=1000&extensions=all`)
              .then(res => {
                positionStore.address = res.data.regeocode.formatted_address;
                console.log('address',positionStore.address)
              })
        },
        () => {
          positionStore.isReject = false;
        }
    );
  }
}

onMounted(() => {
  getCurrentPosition();
})
</script>

<template>
  <RouterView />
</template>

<style>
body,html,#app {
  width: 100%;
  height: 100%;
  background-color: rgb(247, 248, 250);
  touch-action: manipulation;
}
</style>
