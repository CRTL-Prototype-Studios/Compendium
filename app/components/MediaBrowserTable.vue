<script setup lang="ts">
import type {PropType} from "vue";

const columns = [
    {
        key: 'fileName',
        label: 'Name',
        sortable: true,
    },
    {
        key: 'createdAt',
        label: 'Created At'
    }
]

const $toast = useToast()

const emits = defineEmits<{
    (e: 'onforwards', fordir: string, forPseudo: string): void
    (e: 'update:modelValue', value: any[]): void
}>()

const props = defineProps({
    modelValue: {
        type: Array,
        default: null
    },
    rows: {
        type: Array as PropType<{ [key: string]: any }[]>,
        default: () => []
    },
    loading: {
        type: Boolean,
        default: false
    },
    routeForwards: {
        type: Boolean,
        default: true
    }
})

const localModelValue = ref(props.modelValue || [])
// Watch for changes in the prop and update the local ref

watch(() => localModelValue.value, () => {
    emits('update:modelValue', localModelValue.value)
})

watch(() => props.modelValue, (newValue) => {
    localModelValue.value = newValue || []
}, { deep: true })

const handleForwards = async (fordir: string, forPseudo: string) => {
    emits('onforwards', fordir, forPseudo)
    if(props.routeForwards) {
        await navigateTo(`/admin${fordir}`)
    }
}

function joinUrl(str: string): string{
    const runtimeConfig = useRuntimeConfig()
    return runtimeConfig.public.siteUrl + str
}

function select(row: any) {
    //@ts-ignore
    const index = localModelValue.value.findIndex((item) => item.id === row.id)
    if (index === -1) {
        localModelValue.value.push(row)
    } else {
        localModelValue.value.splice(index, 1)
    }
}

function parseAndFormatDate(dateString: string): string {
    const date = new Date(dateString);

    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${year}/${month}/${day}, ${hours}:${minutes}`;
}

function copyFileUrl(fileUrl: string) {
    const textarea = document.createElement('textarea');
    textarea.value = fileUrl;

    // Set the textarea to be out of view
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';

    // Append the textarea to the DOM
    document.body.appendChild(textarea);

    // Select the text inside the textarea
    textarea.select();

    try {
        document.execCommand('copy');
        $toast.add({title: 'Copied File URL to Clipboard.', color: 'green'})
    } catch (err) {
        console.error('Unable to copy text to clipboard:', err);
        $toast.add({title: `Unable to copy text to clipboard: ${err}`, color: 'red'})
    } finally {
        document.body.removeChild(textarea);
    }
}

const imagePreviewModal = ref(false), previewingImage = ref('')
</script>

<template>
    <UTable :columns="columns" v-model="localModelValue" :rows="props.rows" :loading="props.loading" >
        <template #fileName-data="{row}">
            <div class="flex flex-row gap-3 items-center">
                <span v-if="!row.isFolder" class="flex flex-row gap-3 items-center"><UTooltip text="Click to preview"><nuxt-img @click="previewingImage = joinUrl(row.url); imagePreviewModal = true" v-if="row.url.endsWith('.png') || row.url.endsWith('.jpg') || row.url.endsWith('.jpeg')" :src="joinUrl(row.url)" alt="preview" class="object-contain size-8"/></UTooltip> {{row.fileName}}</span>
                <span v-else><UButton icon="i-mdi-folder" @click="handleForwards(row.url, row.pseudoDirectory)" :label="row.fileName"/></span>
                <UTooltip text="Copy File URL to Clipboard"><UButton icon="i-mdi-link" size="sm" variant="ghost" @click="copyFileUrl(joinUrl(row.url))"/></UTooltip>
            </div>
        </template>
        <template #updatedAt-data="{ row }">
            <span>{{ parseAndFormatDate(row.updatedAt) }}</span>
        </template>
        <template #createdAt-data="{ row }">
            <span>{{ parseAndFormatDate(row.updatedAt) }}</span>
        </template>
    </UTable>
    <UModal v-model="imagePreviewModal" title="Image Preview">
        <nuxt-img :src="previewingImage" alt="Previewing Image" class="max-w-screen p-5 select-none"/>
    </UModal>
</template>

<style scoped>

</style>