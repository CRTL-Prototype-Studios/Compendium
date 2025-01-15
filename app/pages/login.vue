<script setup lang="ts">
definePageMeta({
    middleware: ['initialized']
})
const $auth = useInstantAuth()
const verify = ref(false), email = ref(''), pin = ref()
function sendCode(){
    useSonner.promise(async () => {
        await $auth.sendCode(email.value)
    }, {
        loading: 'Sending code to your inbox...',
        success: () => {verify.value = true; return 'Code sent. Check your inbox or spam.'},
        error: 'Unable to send code.'
    })
}

function login(){
    useSonner.promise(async () => {
        await $auth.signInWithCode(email.value, pin.value)
    }, {
        loading: 'Trying to log you in...',
        success: () => {navigateTo('/'); return 'You are now logged in.'},
        error: 'Unable to log in. Wrong code or error.'
    })
}
</script>

<template>
    <div class="w-full min-h-screen flex flex-col items-center justify-center">
        <div class="container w-fit">
            <h2 class="text-center mb-4">Login</h2>
            <Transition>
                <div class="flex items-center justify-center gap-3" v-if="!verify">
                    <UiInput v-model="email" type="email" placeholder="e.g. user@example.com"/>
                    <UiButton @click="sendCode">Send Code</UiButton>
                </div>
                <div class="flex-col flex items-center justify-center gap-3" v-else>
                    <UiPinInput v-model="pin" :input-count="6"/>
                    <UiButton @click="login">Login</UiButton>
                </div>
            </Transition>
        </div>
    </div>
</template>

<style scoped>

</style>