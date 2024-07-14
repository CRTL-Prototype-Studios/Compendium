// composables/useAuth.js

export default function useServerAuth(event: any, token: string) {

    async function validateServerToken() {
        let isServerAuth = false;
        try {
            const response = await $fetch('/api/v1/auth/validate-token', {
                method: 'POST',
                body: { token: token },
            });

            if (response.valid) {
                isServerAuth = true;
            } else {
                isServerAuth = false;
                setCookie(event, 'session_token', '');
            }
        } catch (error) {
            console.error('Token validation failed:', error);
            isServerAuth = false;
        }
        return isServerAuth;
    }

    return {
        validateServerToken
    };
}