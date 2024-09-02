<script setup lang="ts">

definePageMeta({
    middleware: ['check-auth']
})
const links = [
    {
        label: 'Posts',
        icon: 'i-heroicons-home',
        to: '/admin/posts'
    },
    {
        label: 'Galleries',
        icon: 'i-heroicons-chart-bar',
        to: `/admin/galleries`
    },
    {
        label: 'Media Library',
        icon: 'i-heroicons-folder',
        to: '/admin/media'
    }
]
</script>

<template>
    <UDashboardLayout>
        <UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
            <UDashboardNavbar title="Galleries Dashboard"/>

            <UDashboardSidebar>
                <template #header>
                    <UDashboardSearchButton />
                </template>

                <UDashboardSidebarLinks :links="links"/>
            </UDashboardSidebar>
        </UDashboardPanel>

        <slot />

        <UDashboardSearch />
    </UDashboardLayout>
</template>

<style scoped>
div, main {
    font-family: Inter, sans-serif;
}
</style>