import {
    createRouter,
    createWebHistory
} from 'vue-router'
// import Trace from '/src/components/Trace.vue'
import JEAKODR from '/src/components/JEAKODR.vue'

const rfunc = (route) => {
    return {
        query: !route.params.query ? 'iowa' : route.params.query,
        tags: route.params.tags
    }
}

const routes = [{
    path: '/:query?/:tags?',
    // path: '/admin/:region?/:trackiso?/:collapsed?/:panel?/:basemap?/:bbox?',
    name: 'JEAKODR',
    component: JEAKODR,
    props: rfunc
}]

const router = createRouter({
    history: createWebHistory(),
    mode: 'history',
    routes
})
export default router