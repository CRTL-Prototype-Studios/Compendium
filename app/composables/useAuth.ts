// composables/useAuth.js

export default function useAuth() {
    const sessionToken = useCookie('session_token');
    const isAuthenticated = useState('isAuthenticated', () => false);

    async function validateToken() {
        try {
            if(!sessionToken.value){
                isAuthenticated.value = false;
                sessionToken.value = null;
                return;
            }

            // console.log(sessionToken.value)
            const response = await $fetch('/api/v1/auth/validate-token', {
                method: 'POST',
                body: { token: sessionToken.value },
            });

            if ((response as any).valid) {
                isAuthenticated.value = true;
            } else {
                isAuthenticated.value = false;
                sessionToken.value = null;
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            isAuthenticated.value = false;
            sessionToken.value = null;
        }
    }

    async function logout() {
        try {
            await $fetch('/api/logout', {
                method: 'POST',
                body: { token: sessionToken.value },
            });

            isAuthenticated.value = false;
            sessionToken.value = null;
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    return {
        isAuthenticated,
        validateToken,
        logout
    };
}