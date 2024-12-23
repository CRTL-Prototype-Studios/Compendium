import type { AuthState } from '~/types/AuthState';

export default defineNuxtRouteMiddleware(async (to) => {
    const $auth = useInstantAuth()

    // Always allow these routes
    if (to.path === '/login' || to.path === '/new-user') {
        console.log('[auth-guard] skip route')
        return
    }

    await $auth.waitAuth()

    // console.log(db.useAuth().isLoading.value)

    // If no user, redirect to login
    if (!$auth.userValid.value) {
        console.log("[auth-guard] expired session")
        return navigateTo('/login')
    }

    // First check to consider whether hasProfile has already loaded in the auth plugin
    if ($auth.userValid.value && useLocalStorage('has-profile', false).value) {
        console.log('[auth-guard] valid session')
        return
    }

    await $auth.checkProfile() // If not, recheck

    // If we have a user but no profile, redirect to new-user
    if (!useLocalStorage('has-profile', false).value) {
        console.log("[auth-guard] valid session, no init")
        return navigateTo('/new-user')
    } else {
        console.log('[auth-guard] valid session')
        return
    }
})