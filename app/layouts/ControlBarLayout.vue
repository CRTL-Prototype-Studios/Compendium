<script setup lang="ts">

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

const {metaSymbol} = useShortcuts()
</script>

<template>
    <div class="sticky top-0 grid grid-cols-3 w-full p-4 backdrop-blur-2xl bg-transparent select-none">
        <div class="flex flex-row items-center justify-start gap-2">
            <UButton @click="searchOpen = true" icon="i-heroicons-magnifying-glass" size="sm" color="black" variant="ghost" square/>
            <div class="flex items-center gap-0.5">
                <UKbd>{{ metaSymbol }}</UKbd>
                <UKbd>K</UKbd>
            </div>
        </div>
        <div class="flex flex-row items-center justify-center">
            <span>Compendium of <UButton variant="outline" @click="aboutMeOpen = true">Anonymous</UButton></span>
        </div>
        <div class="flex flex-row items-center justify-end gap-2">
            <UButton icon="i-heroicons-cog-6-tooth" size="sm" color="black" variant="ghost" square/>
            <UButton icon="i-heroicons-user" size="sm" color="black" variant="ghost" square/>
            <UButton icon="i-heroicons-code-bracket" size="sm" color="black" variant="ghost" square/>
        </div>
    </div>
    <div class="w-full">
        <slot/>
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

</style>