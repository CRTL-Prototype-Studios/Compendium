import {$fetch} from "ofetch";

export default defineNuxtRouteMiddleware(async (to, from) => {
    try{
        const data = await $fetch('/api/v1/initialized')

        if(data == false){
            if(to.name == 'initialize') return to
            else {
                console.log("s")
                return navigateTo('/initialize')
            }
        } else {
            if(to.name == 'initialize') return from
            else return to
        }
    } catch (e) {
        console.error('Unable to detect initialize state: ', e)
    }
})