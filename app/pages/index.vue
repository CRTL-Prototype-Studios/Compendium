<script setup lang="ts">

definePageMeta({
    layout: "main-layout",
});

const $c = useCompendium(), $cp = useCompendiumProfile(), $db = useInstantDB()
const items = ref([])
const scrollContainer = ref<HTMLElement>()
const pageCursor = ref(), isSiteOwner = ref(false)


async function loadItems(){
    const {data, pageInfo} = await $c.getGalleriesLimit(10, pageCursor.value)
    pageCursor.value = pageInfo.galleries
    for(const i of data.galleries)
        items.value.push(i)
}

useInfiniteScroll(
    scrollContainer,
    loadItems,
    { distance: 10 }
)

onMounted(async () => {
    console.log(await $db.db.queryOnce({$users: {}}))
    isSiteOwner.value = await $cp.isSiteOwner()
    const {data, pageInfo} = await $c.getGalleriesLimit()
    pageCursor.value = pageInfo.galleries
    for(const i of data.galleries)
        items.value.push(i)

})
</script>

<template>
    <div class="min-h-screen w-full -mb-12 p-8">
        <template v-if="items.length">
            <div class="container mx-auto">
                <CompendiumGalleryMasonry
                    :galleries="items"
                />
            </div>
        </template>
        <template v-else>
            <div class="w-full flex flex-col items-center justify-center text-center min-h-screen">
                There aren't any posts yet :(
                <UiButton v-if="isSiteOwner">Add Gallery</UiButton>
            </div>
        </template>
    </div>
</template>

<style scoped></style>
