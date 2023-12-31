<template>
  <tr :key="order.id" :class="[order.confirmation == 'reporter' && 'tw-relative', isReportedToday(order) && '!tw-border tw-border-red-400']" class="tw-bg-white tw-border-b tw-whitespace-nowrap hover:tw-bg-gray-50">

                    <th scope="row" class="tw-px-6 tw-py-4 tw-font-medium tw-text-gray-900 tw-whitespace-nowrap ">
                        {{ id }}
                    </th>

                    <td class="tw-px-6 tw-py-4 tw-relative">
                        <p>{{ fullname }}</p>
                        <div
                            class="tw-absolute tw-bottom-0 tw-left-1/2 -tw-translate-x-1/2 tw-text-xs"
                            >
                            <p
                                class="tw-bg-purple-500/10 tw-text-purple-500 tw-px-2 tw-rounded-t"
                            >
                                Maybe Double: {{ order.double }}
                            </p>
                            </div>

                    </td>
                    <td class="px-6 py-4 tw-flex tw-items-center">
                        {{ order.phone }}
                        <v-btn link target="_blank" :href="'https://api.whatsapp.com/send?phone=' + order.phone.replace('+', '').replace('-', '').replace(' ', '')" class="mr-2 !tw-px-0 !tw-py-0" min-height="25px" min-width="30" color="green" variant="text" density="comfortable" :ripple="false" size="small">
                            <v-icon color="green">mdi-whatsapp</v-icon>
                        </v-btn>
                    </td>
                    <td class="tw-px-6 tw-py-4 tw-relative">
                        <div class="tw-pb-2">
                            <ul>
                            <li v-for="i in order.items" :key="i.id" class="tw-font-bold">
                                -
                                <span
                                class="tw-text-orange-500 tw-font-bold tw-pr-1 tw-text-xs"
                                >{{ i.quantity }}
                                X </span
                                >{{ i.product.name }} 
                                <span v-if="!!i.product_variation.size">| {{ i.product_variation.size }}</span>
                                <span v-if="!!i.product_variation.color">| {{ i.product_variation.color }}</span>
                            </li>
                            </ul>
                        </div>
                    </td>
                    <td v-if="false" class="tw-px-6 tw-py-4">
                        <OrderUpsell :order="order" :key="upsell" :upsell="upsell" :id="id" />
                    </td>
                    <td v-if="false" class="tw-px-6 tw-py-4 tw-relative">
                        <div class="tw-flex tw-items-center tw-justify-center">
                            <OrderConfirmation :class="order.confirmation == 'reporter' && 'tw-mb-1'" :order="order" :confirmation="confirmation" :key="confirmation" :id="id" />
                            <div v-if="order.confirmation == 'reporter'" :class="isReportedToday(order) && '!tw-bg-red-400'" class=" tw-text-xs tw-text-white tw-px-1 tw-rounded-t tw-bottom-0 tw-left-1/2 -tw-translate-x-1/2 tw-absolute tw-bg-gray-500">
                                
                                <span class="tw-flex tw-gap-1">
                                    <span v-if="order.confirmation == 'reporter'">
                                        <v-icon size="x-small">mdi-autorenew</v-icon>
                                        <span >
                                        {{ order?.reported_agente_date?.split("T")[0]  }}
                                        </span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </td>
                    <td v-if="false" class="tw-px-6 tw-py-4">
                        <OrderAffectation :order="order" v-if="confirmation === 'confirmer'" :id="id" :affectation="affectation" :key="affectation" />
                    </td>
                    <td class="tw-px-6 tw-py-4">
                        {{ getPrice(order) }}
                    </td>
                    <td class="tw-px-6 tw-py-4">
                        {{ order.city }}
                    </td>
                    <td class="tw-px-6 tw-py-4">
                        {{ order.adresse }}
                    </td>
                    <td v-if="showNote" class="tw-px-6 tw-py-4 ">
                        <div class="tw-max-w-[300px] tw-min-w-[150px] tw-whitespace-normal">
                            {{ order.note }}
                            <v-icon @click="handleClick" size="x-small" class="tw-ml-2 tw-text-blue-500 tw-cursor-pointer hover:tw-bg-neutral-900/10 tw-rounded-full tw-p-3" :class="{'tw-animate-spin': isLoading}">{{ isLoading ? 'mdi-loading' : 'mdi-pencil' }}</v-icon>

                        </div>
                    </td>
                    <td class="tw-px-6 tw-py-4">
                        <OrderActions :double="true" @update-order="o => $emit('update', o)" :only="['update']" :order="order" />
                    </td>
                </tr>
                <popup type="info" title="Add Note" @resolved="handleResolved" :loading="isLoading" :visible="showPopup">
                    <div class="tw-min-w-[300px]">
                        <p>Edit note</p>
                        <v-textarea v-model="newNote" variant="outlined" class="rounded-md" color="primary-color">

                        </v-textarea>
                    </div>
                </popup>
</template>

<script>
import OrderConfirmation from '@/views/order/partials/OrderConfirmation'
import OrderUpsell from '@/views/order/partials/OrderUpsell'
import OrderAffectation from '@/views/order/partials/OrderAffectation'
import OrderActions from '@/views/order/partials/OrderActions'
import Sale from '@/api/Sale'
import { getPrice } from '@/helpers/methods'

export default {
    props: ['order', 'showNote'],
    emits: ['update'],
    components: { OrderConfirmation, OrderUpsell, OrderAffectation, OrderActions },

    data() {
        return {
            showPopup: false,
            isLoading: false,
            newNote: '',
            newOrder: null,

            todayDate: null,

        }
    },

    computed: {
        id() {
            return this.order.id;
        },
        fullname() {
            return this.order.fullname;
        },
        product_name() {
            return this.order.product_name;
        },
        agente_id() {
            return this.order.agente_id;
        },
        upsell() {
            return this.order.upsell;
        },
        phone() {
            return this.order.phone;
        },
        city() {
            return this.order.city;
        },
        adresse() {
            return this.order.adresse;
        },
        quantity() {
            return this.order.quantity;
        },
        price() {
            return this.order.price;
        },
        confirmation() {
            return this.order.confirmation;
        },
        affectation() {
            return this.order.affectation;
        },
        delivery() {
            return this.order.delivery;
        },
        note() {
            return this.order.note;
        },
        created_at() {
            return this.order?.created_at;
        },
    },

    methods: {
        getPrice(order) {
            return getPrice(order)
        },
        handleClick() {
            this.showPopup = true
            this.newNote = this.note
        },
        handleResolved(response) {
            if(!response) {
                this.showPopup = false;
                return;
            }

            this.showPopup = false
            this.isLoading = true
            Sale.agenteUpdateNote(this.id, this.newNote)
            .then(
                res => {
                    if (res.data.code == "SUCCESS") {
                        this.$alert({
                            type: 'success',
                            title: res.data.data
                        })
                        this.$store.dispatch('order/updateNote', {note: this.newNote, id: this.id})
                    }
                },
                this.$handleApiError
            )
            .finally(
                () => this.isLoading = false
            )
        },
        isReportedToday(order) {
            if(order.confirmation != "reporter") {
                return false
            }

            if(order.reported_agente_date == this.todayDate) {
                return true
            }

            return false;
        }
    },
    mounted() {
        this.newOrder = this.order
        const date = new Date();
        const day = date.getDate();
        const dayFormated = day.toLocaleString('en-US', {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            });
        const month = date.getMonth() + 1;
        const monthFormated = month.toLocaleString('en-US', {
                                minimumIntegerDigits: 2,
                                useGrouping: false
                            })
        const year = date.getFullYear();
        this.todayDate = `${year}-${monthFormated}-${dayFormated}`;
    
    }

}
</script>

<style>

</style>