// 2. 引入组件样式
import 'vant/lib/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Divider } from 'vant'
import { Field, CellGroup, Button,Toast,Skeleton  } from 'vant'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Divider).use(Field).use(CellGroup).use(Button).use(Toast).use(Skeleton)

app.mount('#app')
