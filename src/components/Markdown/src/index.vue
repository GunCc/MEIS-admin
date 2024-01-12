main
<template>
    <main id="sample">
        <Editor
            api-key="koenwo5wekdu9e8dh0htsjviftak1o9y2h2peod49f6qz9ov"
            :init="unref(getEditorBind)"
        />
    </main>
</template>
<script lang="ts">
import Editor from "@tinymce/tinymce-vue"
export default defineComponent({
    name: "Markdown",
    components: {
        Editor,
    },
    setup() {
        const getEditorBind = computed(() => {
            return {
                toolbar_mode: "sliding",
                plugins:
                    "ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss",
                toolbar:
                    "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                tinycomments_mode: "embedded",
                tinycomments_author: "Author name",
                mergetags_list: [
                    { value: "First.Name", title: "First Name" },
                    { value: "Email", title: "Email" },
                ],
                ai_request: (request, respondWith) =>
                    respondWith.string(() =>
                        Promise.reject("See docs to implement AI Assistant")
                    ),
            }
        })
        return {
            getEditorBind,
        }
    },
})
</script>
<style lang="scss">
#sample {
    height: inherit;
    .tox-tinymce {
        height: inherit !important;
    }
}
</style>
