<template>
  <div>
    <div class="mb-5 tw-flex tw-justify-between tw-items-center">
      <div>
        <h1 class="tw-text-gray-700 font-weight-medium tw-text-md md:tw-text-lg">Confirmed Orders</h1>
        <h2 class="tw-text-gray-500 tw-text-sm">See your confirmed orders</h2>
      </div>
      <div v-if="isLoaded">
        <v-btn
          color="primary-color"
          @click="showPopup = true"
          variant="flat"
          class="text-capitalize"
        >
          <v-icon icon="mdi-plus" class="mr-2 text-white"></v-icon>
          <span class="text-white"> Add Sale </span>
        </v-btn>
      </div>
    </div>

    <div v-if="!isLoaded">
          <LoadingAnimation />
    </div>

    <div v-if="isLoaded" class="py-5 px-5 tw-border bg-white tw-w-full tw-rounded-md">

      <div class="mb-5 tw-flex">
        <v-btn @click="showFilters = !showFilters" icon rounded="lg" variant="flat" size="small" color="primary-color" class="text-white">
          <v-icon color="white" size="xx-large">mdi-camera-control</v-icon>
        </v-btn>
        <div class="focus-within:tw-border-orange-400 tw-w-[250px] ml-2 px-2 tw-rounded-md tw-border tw-flex tw-items-center">
          <v-img width="18" height="18" max-width="18" class="ma-0 pa-0" :src="localUrl + 'assets/img/icons/search.svg'"></v-img>
          <input v-model="search" type="text" class="ml-2 tw-border-0 tw-outline-0 tw-h-full tw-text-sm" placeholder="Search by name">
        </div>
      </div>

      <div class="tw-max-h-0 tw-duration-500 tw-overflow-hidden" :class="{'!tw-max-h-[500px]': showFilters}">
        <div class="tw-grid tw-grid-cols-12 tw-gap-2 tw-mb-4">
          <div class="lg:tw-col-span-4 md:tw-col-span-6 tw-col-span-12 tw-h-fit"> 
            <span class="tw-text-sm tw-text-neutral-600">Sort By</span>
            <div class="tw-relative">
              <select v-model="sorting.sortBy" class="tw-w-full focus:tw-border-orange-400 tw-h-[40px] px-2 tw-rounded-md tw-border tw-border-solid tw-border-neutral-200  tw-outline-0  tw-text-sm">
                <option :key="f.value" v-for="f in sorting.fields" :value="f.value">{{f.name}}</option>
              </select>
              <v-icon class="tw-pointer-events-none tw-absolute tw-right-1 tw-text-neutral-500 tw-top-1/2 -tw-translate-y-1/2">mdi-chevron-down</v-icon>
            </div>
          </div>
          <div class="lg:tw-col-span-4 md:tw-col-span-6 tw-col-span-12 tw-h-fit"> 
            <span class="tw-text-sm tw-text-neutral-600">Order By</span>
            <div class="tw-relative">
              <select v-model="sorting.orderBy" class="tw-w-full focus:tw-border-orange-400 tw-h-[40px] px-2 tw-rounded-md tw-border tw-border-solid tw-border-neutral-200  tw-outline-0  tw-text-sm">
                <option :key="o.value" v-for="o in sorting.options" :value="o.value">{{o.name}}</option>
              </select>
              <v-icon class="tw-pointer-events-none tw-absolute tw-right-1 tw-text-neutral-500 tw-top-1/2 -tw-translate-y-1/2">mdi-chevron-down</v-icon>
            </div>
          </div>
          <div class="lg:tw-col-span-4 md:tw-col-span-6 tw-col-span-12 tw-h-fit"> 
            <span class="tw-text-sm tw-text-neutral-600">Upsell</span>
            <div class="tw-relative">
              <select v-model="upsellFilter" class="tw-w-full focus:tw-border-orange-400 tw-h-[40px] px-2 tw-rounded-md tw-border tw-border-solid tw-border-neutral-200  tw-outline-0  tw-text-sm">
                <option value="all">Select</option>
                <option value="oui">Oui</option>
                <option value="non">Non</option>
              </select>
              <v-icon class="tw-pointer-events-none tw-absolute tw-right-1 tw-text-neutral-500 tw-top-1/2 -tw-translate-y-1/2">mdi-chevron-down</v-icon>
            </div>
          </div>
          <div class="lg:tw-col-span-4 md:tw-col-span-6 tw-col-span-12 tw-h-fit"> 
            <span class="tw-text-sm tw-text-neutral-600">Confirmation</span>
            <div class="tw-relative">
              <select v-model="confirmationFilter" class="tw-w-full focus:tw-border-orange-400 tw-h-[40px] px-2 tw-rounded-md tw-border tw-border-solid tw-border-neutral-200  tw-outline-0  tw-text-sm">
                <option v-for="c in confirmations" :key="c.id" :value="!c.value ? 'all' : c.value">{{ c.name }}</option>
              </select>
              <v-icon class="tw-pointer-events-none tw-absolute tw-right-1 tw-text-neutral-500 tw-top-1/2 -tw-translate-y-1/2">mdi-chevron-down</v-icon>
            </div>
          </div>
          <div class="lg:tw-col-span-4 md:tw-col-span-6 tw-col-span-12 tw-h-fit"> 
            <span class="tw-text-sm tw-text-neutral-600">Affecté</span>
            <div  class="tw-relative">
              <select v-model="affectationFilter" class="tw-w-full focus:tw-border-orange-400 tw-h-[40px] px-2 tw-rounded-md tw-border tw-border-solid tw-border-neutral-200  tw-outline-0  tw-text-sm">
                <option value="all">Select</option>
                <option :value="delivery.id" :key="delivery.id" v-for="delivery in deliveries">
                  {{ delivery.firstname }} {{ delivery.lastname }}
                </option>
              </select>
              <v-icon class="tw-pointer-events-none tw-absolute tw-right-1 tw-text-neutral-500 tw-top-1/2 -tw-translate-y-1/2">mdi-chevron-down</v-icon>
            </div>
          </div>
        </div>
      </div>

      <div v-if="confirmedOrders.length > 0">
        <OrdersTable :note="true" :orders="filteredOrders" />
      </div>

      <div v-else class="">
        <p class="tw-text-neutral-400 tw-py-5">Your order's list is empty !</p>
      </div>
    </div>
    <AddNewOrder @cancel="showPopup = false" v-model:visible="showPopup"/>
  </div>
</template>

<script>
import {localUrl} from '@/config/config'

import OrdersTable from './partials/OrdersTable.vue'
import Sale from '@/api/Sale'
import { confirmations } from '@/config/orders'
import User from '@/api/User';
import AddNewOrder from '@/views/order/partials/AddNewOrder'


export default {
  components: {  OrdersTable, AddNewOrder },
  data() {
    return {
      localUrl,
      confirmations,
      isLoaded: false,
      showFilters: false,
      confirmationFilter: 'all',
      affectationFilter: 'all',
      upsellFilter: 'all',
      search: '',

      showPopup: false,

      sorting: {
        sortBy: null,
        orderBy: 'asc',
        fields: [
          {
            name: 'Select',
            value: null
          },
          {
            name: 'ID',
            value: 'id'
          },
          {
            name: 'Created At',
            value: 'created_at'
          },
        ],
        options: [
          {
            name: 'Ascending',
            value: 'asc'
          },
          {
            name: 'Descending',
            value: 'desc'
          },
        ]
      }
    }
  },
  computed: {
    confirmedOrders() {
      return this.$store.getters['order/orders']
    },
    sortedOrders() {
      const copied = this.confirmedOrders;
      return copied.sort((a, b) => {
        switch (this.sorting.sortBy) {
          case 'created_at':
            return this.sorting.orderBy == 'asc' ? new Date(a.created_at) - new Date(b.created_at) : new Date(b.created_at) - new Date(a.created_at);
          case 'id':
            return this.sorting.orderBy == 'asc' ? a.id - b.id : b.id - a.id;

          default:

            return true;
        }
      });
    },
    deliveries() {
      return this.$store.getters['user/deliveries']
    },
    filteredOrders() {
      const confirmationFilter = this.confirmationFilter;
      const affectationFilter = this.affectationFilter;
      const upsellFilter = this.upsellFilter;

      return this.sortedOrders.filter(item => {
        // filter by confirmation
        if (confirmationFilter !== 'all' && item.confirmation !== confirmationFilter) {
          return false;
        }

        // filter by affectation
        if (affectationFilter !== 'all' && parseInt(item.affectation) !== parseInt(affectationFilter)) {
          return false;
        }

        // filter by upsell
        if (upsellFilter !== 'all' && item.upsell !== upsellFilter) {
          return false;
        }

        // if(!item.fullname.toLowerCase().includes(this.search.toLowerCase()) && !item.product_name.toLowerCase().includes(this.search.toLowerCase())) {
        //   return false;
        // }

        const isSearchFound = ((item, search) => {
        for (const key in item) {
        if(['created_at', 'updated_at', 'sheets_id', 'reported_agente_note', 'reported_agente_note', 'reported_agente_date', 'reported_delivery_note', 'reported_delivery_date'].includes(key)){
            continue;
          }
          if (String(item[key]).toLowerCase().includes(search.toLowerCase())) {
            return true; // If any value matches the search, return true and exit the loop.
          }
        }
        return false; // If no value matches the search, return false after checking all values.
      })(item, this.search);
      
      if(!isSearchFound) {
        return false;
      }
        

        // if item passes all filters, include it in the filtered data
        return true;
      });
    }
  },
  methods: {
    getOrders() {
      Sale.agenteConfirmedOrders().then(
      res => {
        if(res?.data.code == "SUCCESS") {
          if (res?.data.data == "No Order Confirmed Yet !") {
            this.orders = []
            this.isLoaded = true
          } else {
            const orders = res.data.data.orders
            this.$store.dispatch('order/setOrders', orders);
            this.isLoaded = true
          }
          }
        }
        ).catch(this.$handleApiError)
    },
    async getDeliveries() {
        
        await User.deliveries()
        .then(
            res => {
                console.log(res.data.data);
                this.$store.dispatch('user/setDeliveries', res.data.data);
            },
            this.$handleApiError
        )
    },
  },
  mounted() {
    this.$store.dispatch('order/setOrders', []);
    this.getDeliveries()
    this.getOrders()
    
  }
}
</script>

<style>
</style>