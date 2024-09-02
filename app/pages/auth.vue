<script setup lang="ts">
import type { FormError } from '#ui/types'

const fields = [{
    name: 'username',
    type: 'text',
    label: 'Username',
    placeholder: 'Enter your username'
}, {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: 'Enter your password'
}]

const validate = (state: any) => {
    const errors: FormError[] = []
    if (!state.username) errors.push({ path: 'username', message: 'Username is required' })
    if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
    return errors
}

function onSubmit (data: any) {
    console.log('Submitted', data)
}

definePageMeta({
    middleware: ['initialize']
})
</script>

<!-- eslint-disable vue/multiline-html-element-content-newline -->
<!-- eslint-disable vue/singleline-html-element-content-newline -->
<template>
    <div class="w-full min-h-screen items-center justify-center flex">
        <UCard class="max-w-sm w-full">
            <UAuthForm
                :fields="fields"
                :validate="validate"
                title="Welcome back!"
                align="top"
                icon="i-heroicons-lock-closed"
                :ui="{ base: 'text-center', footer: 'text-center' }"
                @submit="onSubmit"
            >
                <template #password-hint>
                    <NuxtLink to="/" class="text-primary font-medium">Forgot password?</NuxtLink>
                </template>
            </UAuthForm>
        </UCard>
    </div>
</template>

