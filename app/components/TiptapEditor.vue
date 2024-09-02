<template>
    <div class="h-fit rounded-2xl ring-1 ring-black/10">
        <div class="p-3">
            <div v-if="editor" class="flex flex-row items-center gap-2 container">
                <UButtonGroup>
                    <UButton
                        @click="editor.chain().focus().toggleBold().run()"
                        :disabled="!editor.can().chain().focus().toggleBold().run()"
                        :class="{ 'is-active': editor.isActive('bold') }"
                        :variant="editor.isActive('bold') ? 'solid' : 'soft'"
                        icon="i-fa-solid-bold"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleItalic().run()"
                        :disabled="!editor.can().chain().focus().toggleItalic().run()"
                        :class="{ 'is-active': editor.isActive('italic') }"
                        :variant="editor.isActive('italic') ? 'solid' : 'soft'"
                        icon="i-fa-solid-italic"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleStrike().run()"
                        :disabled="!editor.can().chain().focus().toggleStrike().run()"
                        :class="{ 'is-active': editor.isActive('strike') }"
                        :variant="editor.isActive('strike') ? 'solid' : 'soft'"
                        icon="i-fa-solid-strikethrough"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleCode().run()"
                        :disabled="!editor.can().chain().focus().toggleCode().run()"
                        :class="{ 'is-active': editor.isActive('code') }"
                        :variant="editor.isActive('code') ? 'solid' : 'soft'"
                        icon="i-fa-solid-code"
                    />
                    <UButton
                        @click="editor.chain().focus().unsetAllMarks().run()"
                        variant="soft"
                        icon="i-fa-solid-remove-format"
                        color="red"
                    />
                    <UButton
                        @click="editor.chain().focus().clearNodes().run()"
                        variant="soft"
                        icon="i-fa-solid-brush"
                        color="red"
                    />
                </UButtonGroup>
                <UDivider orientation="vertical" class="h-full"/>
                <UButtonGroup>
                    <UButton
                        @click="editor.chain().focus().setParagraph().run()"
                        :class="{ 'is-active': editor.isActive('paragraph') }"
                        :variant="editor.isActive('paragraph') ? 'solid' : 'soft'"
                        icon="i-fa-solid-paragraph"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                        :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
                        :variant="editor.isActive('heading', { level: 1 }) ? 'solid' : 'soft'"
                        icon="i-mdi-format-header-1"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                        :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
                        :variant="editor.isActive('heading', { level: 2 }) ? 'solid' : 'soft'"
                        icon="i-mdi-format-header-2"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                        :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
                        :variant="editor.isActive('heading', { level: 3 }) ? 'solid' : 'soft'"
                        icon="i-mdi-format-header-3"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                        :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
                        :variant="editor.isActive('heading', { level: 4 }) ? 'solid' : 'soft'"
                        icon="i-mdi-format-header-4"
                    />
                </UButtonGroup>
                <UButtonGroup>
                    <UButton
                        @click="editor.chain().focus().toggleBulletList().run()"
                        :class="{ 'is-active': editor.isActive('bulletList') }"
                        :variant="editor.isActive('bulletList') ? 'solid' : 'soft'"
                        icon="i-fa-solid-list-ul"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleOrderedList().run()"
                        :class="{ 'is-active': editor.isActive('orderedList') }"
                        :variant="editor.isActive('orderedList') ? 'solid' : 'soft'"
                        icon="i-fa-solid-list-ol"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleCodeBlock().run()"
                        :class="{ 'is-active': editor.isActive('codeBlock') }"
                        :variant="editor.isActive('codeBlock') ? 'solid' : 'soft'"
                        icon="i-fa-solid-laptop-code"
                    />
                    <UButton
                        @click="editor.chain().focus().toggleBlockquote().run()"
                        :class="{ 'is-active': editor.isActive('blockquote') }"
                        :variant="editor.isActive('blockquote') ? 'solid' : 'soft'"
                        icon="i-fa-solid-quote-left"
                    />
                </UButtonGroup>
                <UButtonGroup>
                    <UButton
                        @click="editor.chain().focus().setHorizontalRule().run()"
                        variant="ghost"
                        icon="i-fa-solid-align-left"
                    />
                    <UButton
                        @click="editor.chain().focus().setHardBreak().run()"
                        variant="ghost"
                        icon="i-fa-solid-window-minimize"
                    />
                </UButtonGroup>

                <UButton
                    @click="imageInsertModal = true;"
                    variant="ghost"
                    icon="i-mdi-image"
                />

                <UDivider orientation="vertical" class="h-full flex-grow"/>
                <UButtonGroup>
                    <UButton
                        @click="editor.chain().focus().undo().run()"
                        :disabled="!editor.can().chain().focus().undo().run()"
                        variant="ghost"
                        icon="i-fa-solid-undo"
                    />
                    <UButton
                        @click="editor.chain().focus().redo().run()"
                        :disabled="!editor.can().chain().focus().redo().run()"
                        variant="ghost"
                        icon="i-fa-solid-redo"
                    />
                </UButtonGroup>
            </div>
        </div>
        <UDivider/>
        <div class="p-3">
            <TiptapEditorContent :editor="editor" class="h-full min-h-72" :aria-disabled="disabled"/>
        </div>
        <UModal v-model="imageInsertModal" title="Insert Image">
            <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800', container: 'w-full' }">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                            Select Image Media
                        </h3>
                        <UButtonGroup>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-arrow-left" class="-my-1" @click="handlePrevious()"/>
                            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="imageInsertModal = false"/>
                        </UButtonGroup>
                    </div>
                </template>
                <MediaBrowserTable v-model="selected" :rows="(data as any).items as any[]" :loading="pending" :route-forwards="false" @onforwards="handleForwards"/>
                <template #footer>
                    <UButton :disabled="selected.length != 1" @click="addImage()" block>Insert</UButton>
                </template>
            </UCard>
        </UModal>
    </div>
</template>

<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import { Editor, EditorContent } from '@tiptap/vue-3'
import Image from '@tiptap/extension-image'
import { onBeforeUnmount, ref, watch } from 'vue'
import {Youtube} from "@tiptap/extension-youtube";
const editor = ref()
const imageInsertModal = ref(false), imageInput = ref(), $route = useRoute(), prevFocus = ref()
const directory = ref(''), previousDir = ref(''), selected = ref([]), data = ref(), pending = ref(true)
const $media = useMedia(), $toast = useToast()

const refreshDir = async () => {
    pending.value = true
    data.value = await $media.listDirectory(directory.value, false, true)
    pending.value = false
}

// onBefore

const props = defineProps({
    modelValue: {
        type: String,
        default: '<p></p>'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const parseArrayRouteDir = (arr: string[]) => {
    if(arr.length == 0) return '/'
    if(arr.length == 1) return `${arr[0]}`

    let temp = arr[0] as string
    for(let i = 1; i < arr.length; i++) {
        if(arr[i] == '') continue;
        temp += `/${arr[i]}`
    }

    return temp
}

const lastDirAsRoute = () => {
    // NOT DIRECTORY! FOR ROUTE ONLY!
    let temp = directory.value.split('/')
    // selected.value = []
    if(temp.length <= 1)
        return '/'
    else {
        return temp.at(temp.length - 2) == '' ? '/' : '/' + parseArrayRouteDir(temp.splice(0, temp.length - 1))
    }
}

const handlePrevious = () => {
    directory.value = lastDirAsRoute()
    selected.value = []
    // dat.value.refresh()
    refreshDir()
}

const handleForwards = (url: string, pseudo: string) => {
    // previousDir.value = directory.value
    directory.value = url.substring(7)
    selected.value = []
    refreshDir()
}

const emit = defineEmits(['update:modelValue'])

// const editor = useEditor({
//     extensions: [
//         TiptapStarterKit,
//         Image
//     ],
// });

const addImage = async () => {
    // console.log(editor.value.chain().focus())

    if(selected.value.length != 1){
        $toast.add({title: 'Cannot select multiple images', color: 'red'})
        return
    }

    const url = (selected.value?.at(0) as any).url as string
    console.log(url)
    if (!(url.endsWith('.png') || url.endsWith('.jpg') || url.endsWith('.jpeg'))) {
        $toast.add({title: 'Cannot select non-image files', color: 'red'})
        return
    }

    editor.value?.chain().focus().setImage({ src: url }).run()
    imageInsertModal.value = false
    selected.value = []
}

watch(
    () => props.modelValue,
    (value) => {
        const isSame = editor.value?.getHTML() === value
        if (isSame) {
            return
        }
        editor.value?.commands.setContent(value, false)
    }
)

onMounted(async () => {
    await refreshDir()
    editor.value = new Editor({
        extensions: [StarterKit, Image,
            Youtube.configure({
                controls: false,
                nocookie: true,
            })],
        content: props.modelValue,
        onUpdate: () => {
            emit('update:modelValue', editor.value?.getHTML())
        }
    })
})

onBeforeUnmount(() => {
    unref(editor)?.destroy()
})
</script>

<style>
.tiptap {
    height: 100%;
    min-height: 18rem;
}
.tiptap-thread--selected {}

div[contenteditable=true]:focus {
    outline: none;
    border-color: rgba(158, 202, 237, 0);
    box-shadow:0 0 10px rgba(158, 202, 237, 0);
    height: 100%;
}
</style>