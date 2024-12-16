<template>
  <div class="table-wrapper scrollbar scrollbar-x pb-2">
    <UI-Progressbar indeterminate v-if="loading" />
    <div class="d-flex align-center gap-2 mb-2" v-if="allowSearch && items.length">
      <UI-Input v-model="search" type="search" placeholder="Search..." prepend-icon="mdi-magnify" />

    </div>
    <table>
      <thead v-if="headers && !hideHeaders">
        <tr>
          <th v-for="header in headers" :key="header.key || header.value" :class="`text-${header.align || 'left'}`">
            {{ header.label || header.text }}
          </th>
        </tr>
      </thead>
      <tbody :class="{ 'is-link': onHover }">
        <tr v-for="item in itemsPaginated" :key="item.id" @click="$emit('click:item', item)">
          <td v-for="header in headers" :key="header.key || header.value" :class="header.class">
            <template v-if="header.slot">
              <slot :name="header.slot" :item="item" />
            </template>
            <template v-else>
              {{ item[header.key || header.value] }}
            </template>
          </td>
        </tr>
        <tr v-if="items.length && !itemsPaginated.length && search">
          <td :colspan="headers.length" class="text-muted">
            <i>
              No results found for "{{ search }}"
            </i>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="d-flex align-center justify-center gap-2 mt-4" v-if="totalPages > 1">
      <UI-Btn :disabled="currentPage <= 1" @click="currentPage--">
        <UI-Icon icon="mdi-chevron-left" />
      </UI-Btn>
      <span>{{ currentPage }} / {{ totalPages }}</span>
      <UI-Btn :disabled="currentPage >= totalPages" @click="currentPage++">
        <UI-Icon icon="mdi-chevron-right" />
      </UI-Btn>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  headers: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
  hideHeaders: {
    type: Boolean,
    default: false,
  },
  itemsPerPage: {
    type: Number,
    default: 15,
  },
  onHover: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  allowSearch: {
    type: Boolean,
    default: false,
  },
});
const currentPage = ref(1);
const itemsPaginated = computed(() => {
  const start = (currentPage.value - 1) * props.itemsPerPage;
  const end = start + props.itemsPerPage;
  return props.items.slice(start, end).filter((item) => {
    if (!search.value) return true;
    return Object.values(item).some((value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(search.value.toLowerCase());
      }
      return false;
    });
  });
});

const search = ref("");
const totalPages = computed(() => Math.ceil(props.items.length / props.itemsPerPage));

watch(search, () => {
  currentPage.value = 1;
});
</script>
<style>
.table-wrapper {

  width: 100%;
}

.table-wrapper table {
  width: 100%;
  border-collapse: collapse;
}

.table-wrapper th,
.table-wrapper td {
  padding: 10px 20px;

  vertical-align: middle;
}

.table-wrapper th {
  background-color: rgba(var(--v-background-secondary), 1);
  color: #b8b1aa;
  font-weight: bold;
}

.table-wrapper tr {}

.table-wrapper tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.1);
}

.table-wrapper tr:hover {
  filter: brightness(0.7);
}

.table-wrapper table .text-center {
  text-align: center;
}

.table-wrapper table .text-right {
  text-align: right;
}

.table-wrapper table .text-left {
  text-align: left;
}
</style>
