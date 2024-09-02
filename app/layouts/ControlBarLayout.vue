<script setup lang="ts">

import {$fetch} from "ofetch";

const auth = useAuth()

const groups = [{
    key: 'users',
    label: (q: any) => q && `Users matching “${q}”...`,
    search: async (q: any) => {
        if (!q) {
            return []
        }

        const users = await $fetch<any[]>('https://jsonplaceholder.typicode.com/users', { params: { q } })

        return users.map(user => ({ id: user.id, label: user.name, suffix: user.email }))
    }
}]

let dropdown: any[] = [
    [
        {label: 'About Me', icon: 'i-heroicons-information-circle', to: '/about-me'}
    ],
    [
        {label: 'Sign In', icon: 'i-heroicons-arrow-right-end-on-rectangle', to: '/auth'}
    ]
]

const searchOpen = ref(false)
const aboutMeOpen = ref(false)

defineShortcuts({
    meta_k: {
        usingInput: true,
        handler: () => {
            searchOpen.value = !searchOpen.value
        }
    }
})

onBeforeMount(async () => {
    await auth.validateToken()
    if(auth.isAuthenticated.value){
        // console.log(auth.isAuthenticated.value)
        dropdown = [
            [
                {label: 'Dashboard', icon: 'i-heroicons-adjustments-horizontal', to: '/dashboard'},
                {label: 'About Me', icon: 'i-heroicons-information-circle', to: '/about-me'}
            ],
            [
                {label: 'Sign Out', icon: 'i-heroicons-arrow-right-end-on-rectangle', click: () => {}}
            ]
        ]
    }
})

const {metaSymbol} = useShortcuts()
</script>

<template>
    <UMain>
        <NuxtLayout>
            <slot/>
        </NuxtLayout>
    </UMain>
    <div class="justify-center flex flex-col inset-x-0 mx-auto fixed bottom-10 h-fit items-center align-middle">
        <div class="flex flex-row p-2 border rounded-2xl">
            <UTooltip text="Search" :shortcuts="['⌘', 'K']" :popper="{placement:'top'}">
                <UButton @click="searchOpen = true" icon="i-heroicons-magnifying-glass" size="sm" color="black" variant="ghost" square/>
            </UTooltip>
            <UTooltip text="Blog" :popper="{placement:'top'}">
                <UButton to="/blog" icon="i-heroicons-book-open" size="sm" color="black" variant="ghost" square/>
            </UTooltip>
            <UTooltip text="User" :popper="{placement:'top'}">
                <UDropdown :items="dropdown" trigger="hover" :popper="{placement:'top-start'}">
                    <UButton icon="i-heroicons-user-circle" size="sm" color="black" variant="ghost" square/>
                </UDropdown>
            </UTooltip>
        </div>
    </div>

    <UModal v-model="searchOpen">
        <UCommandPalette
            :groups="groups"
            :empty-state="{ icon: 'i-heroicons-magnifying-glass-20-solid', label: 'Type in any keyword to search for a gallery!', queryLabel: 'We couldn\'t find any items with that term. Please try again.' }"
            placeholder="Search Gallery..."
        />
    </UModal>
    <UModal prevent-close v-model="aboutMeOpen" class="select-none">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
            <template #header>
                <div class="flex items-center justify-between">
                    <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                        About Me
                    </h3>
                    <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="aboutMeOpen = false" />
                </div>
            </template>

            <USkeleton class="h-32" />
        </UCard>
    </UModal>
</template>

<style scoped>
div, main {
    font-family: Inter, sans-serif;
}
</style>