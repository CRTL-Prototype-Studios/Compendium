<script setup lang="ts">
import type {FooterLink} from "#ui-pro/types";

const props = defineProps({
    links:{
        default: [] as any[],
        required: true,
        type: Array<FooterLink>
    }
})
</script>

<template>
    <UFooter :links="props.links" class="w-full mt-8">
        <template #left>
            The SHUL Team, Copyright © 2023-{{ new Date().getFullYear() }}
        </template>
        <template #right>
            <UButton icon="i-mdi-github" color="gray" variant="ghost" to="https://github.com/Type-32/UltimateFrisbee" target="_blank" />
        </template>
    </UFooter>
</template>

<style scoped>

</style>