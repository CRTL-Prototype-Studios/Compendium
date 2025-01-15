import type { AuthState } from '~/types/AuthState';

export default defineNuxtRouteMiddleware(async (to) => {
    const $db = useInstantDB()
    const $auth = useInstantAuth()

    if($auth.user.value?.id == undefined)
        await $auth.waitAuth()

    if($auth.user.value?.id != undefined) return;

    const {data} = await $db.db.queryOnce({
        $users: {
            $: {
                limit: 1
            }
        }
    })

    if(data.$users.length <= 0) return;
    else return navigateTo('/')
})