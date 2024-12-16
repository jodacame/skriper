<template>
    <div class="markdown scrollbar scrollbar-y" v-html="highlightedMarkdown" />
    <Modals-Preview v-if="previewCode" :code="previewCode" @close="previewCode = null" />
</template>

<script setup>
import { marked } from "marked";
import Prism from 'prismjs';
// Load languages
import 'prismjs/components/prism-bash.min.js';
import 'prismjs/components/prism-javascript.min.js';
import 'prismjs/components/prism-json.min.js';
import 'prismjs/components/prism-markdown.min.js';
import 'prismjs/components/prism-sql.min.js';
import 'prismjs/components/prism-python.min.js';
import 'prismjs/components/prism-yaml.min.js';
import 'prismjs/components/prism-docker.min.js';
import 'prismjs/components/prism-nginx.min.js';
import 'prismjs/components/prism-toml.min.js';
import 'prismjs/components/prism-graphql.min.js';
import 'prismjs/components/prism-markup-templating.min.js';
// typescript
import 'prismjs/components/prism-typescript.min.js';






import 'prismjs/themes/prism-okaidia.css';

const { $utils, $toast } = useNuxtApp();

const previewCode = ref(null);
const renderer = new marked.Renderer();

renderer.code = (code) => {

    let { type, lang, text } = code;
    // extract all <pre> blocks

    const allowPreview = ['html'];
    const randomID = Math.random().toString(36).substring(7);
    const codeBase64 = allowPreview.includes(lang) && text.includes('<body>') ? btoa(text) : null;
    const toolbarHTML = `
    <div class="toolbar d-flex no-wrap align-center gap-1">
        <span class="language-name">${lang}</span>
        <div class="spacer"></div>
        <button class="trg-btn copy-btn">Copy</button>
        ${allowPreview.includes(lang) && text.includes('<body>') ? `<button class="trg-btn  preview-btn" data-target="#${randomID}" data-code="${codeBase64}">Preview</button>` : ''}
    </div>
  `;

    if (lang === 'bash') lang = 'shell';
    if (lang === 'json') lang = 'javascript';
    if (lang === 'vue') lang = 'html';
    if (lang === 'yml') lang = 'yaml';
    // Envolver el bloque de código con el toolbar y el bloque <pre>
    return `
    <div class="code-container">
      ${toolbarHTML}
      <pre class="language-${lang}"><code class="language-${lang}" >${scapeHTML(text)}</code></pre>
      <textarea id="${randomID}" style="display:none">${scapeHTML(text)}</textarea>
    </div>
  `;
};



const props = defineProps({
    markdown: { type: String, required: true },
});

const compiledMarkdown = computed(() => {


    let markdown = props.markdown
    try {
        const html = marked(markdown, { renderer })

        return html;
    } catch (e) {
        return markdown;
    }

});

const updateCodeSyntax = (html) => {

    const div = document.createElement('div');
    div.innerHTML = html;

    Prism.highlightAllUnder(div);
    addEventListeners();
    return div.innerHTML;
};

const scapeHTML = (html) => {
    // const text = document.createTextNode(html);
    // const p = document.createElement('p');
    // p.appendChild(text);
    // return p.innerHTML;
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');

};

const highlightedMarkdown = computed(() => {


    return updateCodeSyntax(compiledMarkdown.value);
});


const addEventListeners = () => {

    const copyBtns = document.querySelectorAll('.copy-btn:not([data-tooltip])');

    for (const btn of copyBtns) {
        if (btn.dataset.tooltip) continue;
        btn.dataset.tooltip = 'Copy code to clipboard';

        btn.addEventListener('click', () => {
            let code = btn.parentElement.nextElementSibling.querySelector('code').textContent;
            // reverse the scapeHTML
            code = code.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
            $utils.copyToClipboard(code);
            $toast.success('Code copied to clipboard');
        });
    }

    const previewBtns = document.querySelectorAll('.preview-btn');
    for (const btn of previewBtns) {
        if (btn.dataset.tooltip) continue;
        btn.dataset.tooltip = 'Preview code';
        btn.addEventListener('click', () => {
            const code = btn.dataset.code;
            previewCode.value = code;
        });
    }
};

watch(() => props.markdown, () => {
    // I lost my mind trying to make this work after the update.
    setTimeout(() => {
        addEventListeners();
    }, 100);
}, { immediate: true, deep: true });
onMounted(() => {
    addEventListeners();
});
</script>

<style>
.markdown {
    max-width: 100%;

}

.markdown code {
    background-color: rgba(var(--v-background-alt), 1);
    padding: 0.2em 0.4em;
    margin: 0;
    border-radius: 3px;
    font-size: 85%;
}

.markdown pre {
    background-color: rgba(var(--v-background-alt), 1);
    padding: 1em;
    border-radius: 3px;
    overflow-x: auto;
}

.markdown pre code {
    background-color: transparent;
    padding: 0;
    border-radius: 0;
}

.markdown table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    margin-bottom: 1.5em;
}

.markdown table thead {
    background-color: rgba(var(--v-background), 1);
    font-weight: 600;

}

.markdown table thead th {
    padding: 10px 13px;
    border: 1px solid rgba(var(--v-border), 1);
}

.markdown table tbody th {
    font-weight: 600;
}

.markdown table tbody th,
.markdown table tbody td {
    padding: 6px 13px;
    border: 1px solid rgba(var(--v-border), 1);
}

.markdown table tbody tr {
    background-color: rgba(var(--v-background-alt), 0.5);
    border-top: 1px solid rgba(var(--v-border), 1);
}

.markdown table tbody tr:nth-child(2n) {
    background-color: rgba(var(--v-background), 0.3);
}

.markdown ul,
.markdown ol {
    margin: 0;
    padding: 0 0 0 1.5em;
}

.toolbar {
    padding: 0.5em 1em;
    background-color: rgba(var(--v-background), 1);
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;

}

code[class*="language-"],
pre[class*="language-"] {
    margin: 0;
}

.code-container {
    border-radius: 3px;
    overflow: hidden;
    margin-bottom: 1.5em;
    display: flex;
    flex-direction: column;
    background-color: rgba(var(--v-background-alt), 1);
    padding: 1px;
}

.language-name {
    font-size: 0.8em;
    font-weight: 600;
    color: rgba(var(--v-text-color), 0.4);
    text-transform: uppercase;
}

.trg-btn {
    background-color: rgba(var(--v-primary), 1);
    color: rgba(var(--v-text-color), 1);
    padding: 0.5em 1em;
    border-radius: 3px;
    font-weight: 600;
    cursor: pointer;
}

.trg-btn:hover {
    background-color: rgba(var(--v-primary), 0.9);
}
</style>