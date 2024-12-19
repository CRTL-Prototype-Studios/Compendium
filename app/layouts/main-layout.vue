<script setup lang="ts"></script>

<template>
    <div class="min-h-screen w-full">
        <slot />
        <div class="sticky bottom-0 flex w-full items-center justify-center">
            <div class="flex h-fit w-fit items-center justify-center p-1">
                <InspiraDock class="rounded-lg" :magnification="10">
                    <InspiraDockIcon>
                        <Icon name="lucide:magnify" class="size-4" />
                    </InspiraDockIcon>
                    <InspiraDockIcon>
                        <Icon name="lucide:magnify" class="size-4" />
                    </InspiraDockIcon>
                    <InspiraDockIcon>
                        <Icon name="lucide:user-circle" class="size-4" />
                    </InspiraDockIcon>
                </InspiraDock>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
