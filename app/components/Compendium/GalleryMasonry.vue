<script setup lang="ts">
import MasonryWall from '@yeger/vue-masonry-wall'
import { ref } from 'vue'

const props = defineProps({
    galleries: {
        type: Array,
        required: true,
        default: () => []
    }
})

const columnWidth = ref(200)
const loadedImages = ref<Record<string, boolean>>({})

const handleImageLoad = (itemId: string) => {
    loadedImages.value[itemId] = true
}
</script>

<template>
    <div class="gallery-masonry">
        <masonry-wall
            :items="galleries"
            :column-width="columnWidth"
            :gap="16"
            class="masonry-wall"
        >
            <template #default="{ item }">
                <div class="gallery-card group">
                    <NuxtLink
                        :to="`/gallery/${item.id}`"
                        class="block overflow-hidden rounded-lg relative"
                    >
                        <div class="relative aspect-auto max-h-96 overflow-hidden">
                            <!-- Placeholder/Skeleton -->
                            <div
                                v-show="!loadedImages[item.id]"
                                class="absolute inset-0 bg-primary animate-pulse"
                            />

                            <!-- Actual Image -->
                            <img
                                :src="item.coverImage || (item.images && item.images[0])"
                                :alt="item.title"
                                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                :class="{ 'opacity-0': !loadedImages[item.id] }"
                                @load="handleImageLoad(item.id)"
                            />
                        </div>

                        <div
                            v-show="loadedImages[item.id]"
                            class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
                        >
                            <div class="absolute bottom-0 p-4 text-white">
                                <h3 class="text-lg font-semibold">{{ item.title }}</h3>
                                <p class="text-sm opacity-90">
                                    {{ item.images ? item.images.length : 0 }} photos
                                </p>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </template>
        </masonry-wall>
    </div>
</template>

<style scoped>
.gallery-masonry {
    @apply w-full max-w-[2000px] mx-auto px-4;
}

.gallery-card {
    @apply overflow-hidden rounded-lg shadow-lg transition-shadow hover:shadow-xl;
}

.masonry-wall {
    @apply pb-8;
}

img {
    @apply transition-opacity duration-300;
}
</style>