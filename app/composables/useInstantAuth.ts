import type { AuthState } from '~/types/AuthState';

export const useInstantAuth = () => {
    const config = useRuntimeConfig();
    const { db } = useInstantDB();
    // const authState = useState<AuthState>('auth-state')
    const authState = useLocalStorage<AuthState>('auth-state', {isAuthenticated: false, isInitialized: false, hasProfile: false})
    const user = computed(() => authUser());
    // TODO Replace this with proper state management later
    const userValid = computed(() => (authState.value.isInitialized && authState.value.isAuthenticated) || !!user.value?.id);
    const hasProfile = computed(() => authState.value.hasProfile || false);
    const isInitialized = computed(() => authState.value.isInitialized || false)

    // Send the code
    async function sendCode(email: string) {
        try {
            await db.auth.sendMagicCode({ email });
            return { error: null };
        } catch (err: any) {
            return { error: err.body?.message as string };
        }
    }

    // Verify and Signin with Code
    async function signInWithCode(email: string, code: string) {
        try {
            await db.auth.signInWithMagicCode({ email, code })

            // Wait for auth state to be updated
            await waitAuth()
            await checkProfile(user.value?.id || '')

            // Determine redirect based on profile status
            if (!authState.value.hasProfile) {
                await navigateTo('/new-user')
            } else {
                await navigateTo('/dashboard')
            }

            return { error: null }
        } catch (err: any) {
            return { error: err.body?.message as string }
        }
    }

    function isLoading() {
        return db.useAuth().isLoading
    }

    function authUser() {
        return db.useAuth().user.value
    }

    async function signOut() {
        await db.auth.signOut()
        authState.value.isAuthenticated = false
    }

    async function blockRouteWithAuth() {
        if (!authState.value.isAuthenticated) {
            useToast().toast({
                title: "Session Expired",
                description: "We failed an investigation check on your identity. Please log in again.",
                icon: "lucide:badge-x",
                variant: "destructive"
            })
            await navigateTo("/login")
            return true
        }
        return false
    }

    async function waitAuth(){
        const {isLoading, user} = db.useAuth()
        if (isLoading.value) {
            authState.value.isInitialized = false
            authState.value.isAuthenticated = false
            await until(isLoading).toBe(false)
        }
        authState.value.isInitialized = true
        if(user.value?.id){
            authState.value.isAuthenticated = true
        }
    }

    async function checkProfile(userId: string = ""){
        if(authState.value.isInitialized && useLocalStorage('has-profile', false).value) return;

        let uid = userId
        if (!uid) {
            uid = user.value?.id || ""
            console.log("Checking profile of", uid)
        }
        if (!uid) {
            return false
        }

        const { data, pageInfo } = await db.queryOnce({
            profiles: {
                $: {
                    where: {
                        'owner.id': uid
                    }
                }
            }
        })

        // console.log(data.profiles.length)

        authState.value.hasProfile = data.profiles.length > 0
        useLocalStorage('has-profile', data.profiles.length > 0).value = data.profiles.length > 0

        return data.profiles.length > 0
    }

    return {
        signOut,
        sendCode,
        signInWithCode,
        waitAuth,
        isLoading,
        checkProfile,
        userValid,
        user,
        isInitialized,
        hasProfile,
    };
};