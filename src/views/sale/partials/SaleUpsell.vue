<template>
  <div v-click-outside="close" :key="upsell" class="tw-relative tw-w-[60px]">
    <button
        @click="toggle"
        :class="[selected.text, selected.bg, selected.ring]"
      class=" focus:tw-ring-4 focus:tw-outline-none  tw-font-medium tw-rounded-lg tw-text-sm tw-px-2 tw-py-1 tw-text-center tw-inline-flex tw-items-center"
      type="button"
    >
      {{ selected.name }} 
      
      <v-icon v-if="!isLoading" class="tw-ml-1">{{ isOpen ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
      <v-icon v-if="isLoading" class="tw-animate-spin tw-ml-1">mdi-loading</v-icon>
    </button>
    <!-- Dropdown menu -->
    <div
      :class="{'tw-hidden': !isOpen}"
      class="tw-z-[20] tw-bg-white tw-absolute tw-top-full tw-left-0 tw-divide-y tw-divide-gray-100 tw-rounded-lg tw-shadow tw-w-44"
    >
      <ul
        class="tw-py-2 tw-space-y-1 tw-text-sm tw-text-gray-700"
      >
        <li @click="handleChange(option)" v-for="option in options" :key="option.id">
          <a
            class="tw-block tw-px-4 tw-py-2 hover:tw-bg-gray-100"
            :class="[option.text, option.bg]"
            >{{ option.name }}</a
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Sale from '@/api/Sale';
export default {
  props: ['upsell', 'id'],
    data() {
        return {
            isLoading: false,
            isOpen: false,
            selected: { id: 1, value: 'oui', name: 'Oui', text: 'tw-text-green-500', bg: 'tw-bg-green-500/10', ring: 'tw-ring-green-300' },
            allOptions: [
                { id: 0, value: null, name: 'select', text: 'tw-text-neutral-600', bg: 'tw-bg-neutral-500/10', ring: 'tw-ring-neutral-300' },
                { id: 1, value: 'oui', name: 'Oui', text: 'tw-text-green-500', bg: 'tw-bg-green-500/10', ring: 'tw-ring-green-300' },
                { id: 2, value: 'non', name: 'Non', text: 'tw-text-pink-500', bg: 'tw-bg-pink-500/10', ring: 'tw-ring-pink-300' },
            ]
        }
    },
    computed: {
        options() {
            return this.allOptions
        }
    },
    methods: {
        close() {
            this.isOpen = false
        },
        toggle() {
            this.isOpen = !this.isOpen
        },
        handleChange(option) {
          if(option == this.selected) return false;
            this.selected = option
            this.isLoading = true
            this.updateOrder()
            this.close()
        },
        updateOrder() {
          Sale.agenteUpdateUpsell(this.id, this.selected.value)
          .then(
            res => {
              if (res.data.code === 'SUCCESS') {
                this.$alert({
                  type: 'success',
                  title: res.data.data
                })
                this.updateUpsell(this.id, this.selected.value)
                this.isLoading = false
              }
            },
            err => this.$handleApiError(err)
          )
        },
        updateUpsell(id, upsell) {
          this.$store.dispatch('sale/updateUpsell', {id, upsell})
        }
    },
    updated() {
      // this.selected = this.options.find(i => i.value == this.upsell)
      // console.log(this.selected);
    },
    mounted() {
      // console.log(this.upsell);
      switch (this.upsell) {
        case 'oui':
          this.selected = { id: 1, value: 'oui', name: 'Oui', text: 'tw-text-green-500', bg: 'tw-bg-green-500/10', ring: 'tw-ring-green-300' }
          break;
        case 'non':
          this.selected = { id: 2, value: 'non', name: 'Non', text: 'tw-text-pink-500', bg: 'tw-bg-pink-500/10', ring: 'tw-ring-pink-300' }
          break;
        default:
          this.selected = { id: 0, value: null, name: 'select', text: 'tw-text-neutral-600', bg: 'tw-bg-neutral-500/10', ring: 'tw-ring-neutral-300' }
          break;
      }
    }
};
</script>

<style>
</style>