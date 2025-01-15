<script setup lang="ts">
const colorMode = useColorMode()
const $p = useCompendiumProfile()
function toggleDarkLight(){
    colorMode.preference = colorMode.preference == 'light' ? 'dark' : 'light';
}

onMounted(async() => {
    await $p.waitProfile()
})
</script>

<template>
    <div class="min-h-screen w-full">
        <slot />
        <div class="sticky bottom-3 flex w-full items-center justify-center">
            <div class="flex h-fit w-fit items-center justify-center gap-3 border rounded-lg p-3 group bg-secondary backdrop-blur-lg">
                <Icon name="lucide:search" class="size-5 transition-all duration-300 hover:scale-110 cursor-pointer" />
                <Icon name="lucide:sun-moon" class="size-5 transition-all duration-300 hover:scale-110 cursor-pointer" @click="toggleDarkLight" />
                <Icon name="lucide:user-circle" class="size-5 transition-all hover:scale-110 cursor-pointer" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
