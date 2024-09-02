<script setup lang="ts">

// import ControlBarLayout from "~/app/layouts/ControlBarLayout.vue";
import ControlBarLayout from "~/layouts/ControlBarLayout.vue";

definePageMeta({
    middleware: ['initialize']
})

</script>

<template>
    <ControlBarLayout>
        <div class="w-full grid desktop:grid-cols-6 grid-cols-4 tablet:grid-cols-2 p-5 gap-x-10 gap-y-10 grid-flow-row-dense auto-rows-auto">
            
        </div>
    </ControlBarLayout>
</template>

<style scoped>

</style>