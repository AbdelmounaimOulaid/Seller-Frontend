<template>
  <div :key="delivery" v-click-outside="close" class="tw-relative tw-min-w-[100px]">
    <div v-if="delivery == 'livrer'" class="focus:tw-ring-4 tw-min-w-fit focus:tw-outline-none  tw-font-medium tw-rounded-lg tw-text-sm tw-px-2 tw-py-1 tw-text-center tw-inline-flex tw-items-center tw-justify-between tw-bg-green-500/10 tw-text-green-500">
      {{ selected.name }}
    </div>
    <div v-if="delivery != 'livrer'">
      <button
          @click="toggle"
          :class="[selected.text, selected.bg, selected.ring]"
          class=" focus:tw-ring-4 tw-min-w-[100px] focus:tw-outline-none  tw-font-medium tw-rounded-lg tw-text-sm tw-px-2 tw-py-1 tw-text-center tw-inline-flex tw-items-center tw-justify-between"
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
            class="tw-py-2 tw-space-y-1 tw-text-sm tw-text-gray-700 tw-max-h-[250px] tw-overflow-y-auto"
          >
            <li @click="!disabled.includes(option.value) && handleChange(option)" v-for="option in options" :key="option.id">
              <a
                class="tw-block tw-px-4 tw-py-2"
                :class="[!disabled.includes(option.value) ? [option.text, option.bg] : 'tw-text-neutral-400/80 tw-bg-neutral-400/10']"
                >{{ option.name }}</a
              >
            </li>
          </ul>
        </div>
        
        <OrderReporting :order="order" :visible="showPopupReporter" @cancel="showPopupReporter = false" />
    </div>
    
  </div>
</template>

<script>
import Sale from '@/api/Sale';
import { deliveryStatus, disabledForDelivery } from '@/config/orders';
import OrderReporting from '@/views/delivery/partials/OrderReporting'

export default {
    props: ['delivery', 'id', 'order'],
    components: {OrderReporting},
    data() {
        return {
            isLoading: false,
            isOpen: false,
            showPopup: false,
            nextOption: null,
            note: '',
            selectedId: 0,
            allOptions: deliveryStatus,
            disabled: disabledForDelivery,
            showPopupReporter:false
        }
    },
    computed: {
        options() {
            return this.allOptions.filter(i => i.id !== this.selectedId)
        },
        selected() {
          return this.allOptions.filter((item) => item.id == this.selectedId)[0]
        },
        availableOptions() {
          return this.allOptions.map(i => i.value)
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

          if (option.id === this.selectedId) return false;
          
            if(option.value != 'reporter') {
              this.selectedId = option.id
              this.updateOrder()
              this.close()
            }

            if(option.value == 'reporter') {
              this.showPopupReporter = true
            }
        },
        async updateOrder() {
          this.isLoading = true
          return Sale.deliveryUpdateDelivery(this.id, this.selected.value)
          .then(
            res => {
              if (res.data.code === 'SUCCESS') {
                this.$alert({
                  type: 'success',
                  title: res.data.data
                })
                this.updateDelivery(this.id, this.selected.value)
                this.isLoading = false
              }
            },
            err => this.$handleApiError(err)
          )
          .then(
            () => this.$emit('update', this.selected.value)
          );
        },

        updateDelivery(id, delivery) {
            this.$store.dispatch('order/updateDelivery', {id, delivery})
        },
        
    },
    mounted() {
      if (this.availableOptions.includes(this.delivery)) {
        this.selectedId = this.allOptions.find(option => option.value == this.delivery).id;
      } else {
        this.selectedId = 0;
      }
    }
};
</script>

<style>
</style>