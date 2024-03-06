import {ref, computed, reactive} from 'vue'
import { defineStore } from 'pinia'

export interface Position {
  latitude?: number;
  longitude?: number;
}

export const usePositionStore = defineStore('position', () => {
  const position = reactive<Position>({});
  const isReject = ref(false);
  const address = ref('');
  return { position,isReject, address }
})
