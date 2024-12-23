<script setup>
import { MasonryWallComponent } from '@yeger/vue-masonry-wall'
import { ref, onMounted } from 'vue'

// Define props for your galleries data
const props = defineProps({
    galleries: {
        type: Array,
        required: true
    }
})

// Responsive column count configuration
const columnWidth = ref(300) // Base width for each column
</script>

<template>
    <div class="gallery-masonry">
        <MasonryWallComponent
            :items="galleries"
            :min-col-width="columnWidth"
            :padding="16"
            class="masonry-wall"
        >
            <template #default="{ item }">
                <div class="gallery-card group">
                    <!-- Card content -->
                    <NuxtLink :to="`/gallery/${item.id}`" class="block overflow-hidden rounded-lg">
                        <!-- Image container with aspect ratio -->
                        <div class="relative aspect-[4/3] overflow-hidden">
                            <img
                                :src="item.coverImage || item.images[0]"
                                :alt="item.title"
                                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                        </div>

                        <!-- Gallery info overlay -->
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                            <div class="absolute bottom-0 p-4 text-white">
                                <h3 class="text-lg font-semibold">{{ item.title }}</h3>
                                <p class="text-sm opacity-90">{{ item.imageCount }} photos</p>
                            </div>
                        </div>
                    </NuxtLink>
                </div>
            </template>
        </MasonryWallComponent>
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
</style>