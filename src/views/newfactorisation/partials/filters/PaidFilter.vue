<template>
    <div class="md:tw-col-span-3 tw-col-span-12 tw-rounded">
      <label
        for="countries"
        class="tw-block tw-mb-2 tw-text-sm tw-font-medium tw-text-gray-900"
        >Paid</label
      >
  
      <select
        @change="(e) => $emit('update', { ...filters, paid: e.target.value })"
        :value="filters.paid"
        class="tw-bg-gray-50 tw-border-solid tw-outline-none tw-border tw-border-gray-300 tw-text-gray-900 tw-text-sm tw-rounded-lg focus:tw-ring-orange-500 focus:tw-border-orange-500 tw-block tw-w-full tw-p-2.5"
      >
        <option value="all">All</option>
        <option
          :value="p.value"
          v-for="p in paid"
          :key="p.id"
          class="tw-capitalize"
        >
          {{ p.title }}
        </option>
      </select>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      filters: {
        required: true,
      },
    },
  
    data() {
      return {
        paid: [
          {
            id: 1,
            title: "Paid",
            value: 1,
          },
          {
            id: 2,
            title: "Not Paid",
            value: 0,
          },
        ],
      };
    },
  };
  </script>
  
  <style></style>
  