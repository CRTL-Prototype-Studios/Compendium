import {$fetch} from "ofetch";

export default defineNuxtRouteMiddleware(async (to, from) => {
    try{
        const data = await $fetch('/api/v1/initialized')

        if(data == true){
            if(to.name == 'initialize') return navigateTo(from)
            else return navigateTo(from)
        }
    } catch (e) {
        console.error('Unable to detect initialize state: ', e)
    }
})