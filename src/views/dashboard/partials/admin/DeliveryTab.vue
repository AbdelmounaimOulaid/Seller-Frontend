<template>
  <div>
    <div class="tw-grid tw-mb-5 tw-grid-cols-4 md:tw-grid-cols-4 lg:tw-grid-cols-4 tw-gap-2 py-5">

      <div class="lg:tw-col-span-1 md:tw-col-span-2 tw-col-span-4">
        <DashItemTwo :dash="totalSales" />
      </div>

      <div class="lg:tw-col-span-1 md:tw-col-span-2 tw-col-span-4">
        <DashItemTwo :dash="deliveredSales" />
      </div>

      <div class="lg:tw-col-span-1 md:tw-col-span-2 tw-col-span-4">
        <DashItemTwo :dash="shippedSales" />
      </div>

      <!-- <div class="lg:tw-col-span-1 md:tw-col-span-2 tw-col-span-4">
        <DashItemTwo :dash="toProcess" />
      </div> -->

      <div class="lg:tw-col-span-1 md:tw-col-span-2 tw-col-span-4">
        <DashItemTwo :dash="reportedSales" />
      </div>

      <div class="lg:tw-col-span-1 md:tw-col-span-2 tw-col-span-4">
        <DashItemTwo :dash="noanswerSales" />
      </div>
      
      <div class="lg:tw-col-span-1 md:tw-col-span-2 tw-col-span-4">
        <DashItemTwo :dash="canceledSales" />
      </div>
      <div class="lg:tw-col-span-1 md:tw-col-span-2 tw-col-span-4">
        <DashItemTwo :dash="transferSales" />
      </div>

     
    </div>
  </div>
</template>

<script>

  import DashItemTwo from "@/views/dashboard/partials/DashItemTwo";


  import Sale from "@/api/Sale";

  export default {
    components: { DashItemTwo },

    props: ['filteredSales'],

    data() {
      return {
        isLoaded: false,

      };
    },
    computed: {
      user() {
        return this.$store.getters["user/user"];
      },
      isAdmin() {
        return this.user.role == "admin";
      },
      sales() {
        return this.filteredSales;
      },
      totalSales() {
        return {
          id: 1,
          title: "Total",
          value: this.sales.filter((i) => i.confirmation == "confirmer").length,
          pourcentage: this.sales.filter((i) => i.confirmation == "confirmer").length * 100  / this.sales.filter((i) => i.confirmation == "confirmer").length,
          // value: 35,
          color: "deep-purple-accent-2",
          icon: "mdi mdi-all-inclusive",
        };
      },

      deliveredSales() {
        return {
          id: 2,
          title: "Delivered",
          value: this.sales.filter((i) => i.delivery == "livrer").length,
          pourcentage: ((this.sales.filter((i) => i.delivery == 'livrer').length * 100) / (this.sales.filter((i) => i.confirmation == "confirmer").length)).toFixed(2),
          // value: 412,
          color: "primary-green",
          icon: "mdi-account-check-outline",
        };
      },

      toProcess() {
        return {
          id: 3,
          title: 'Process',
          value: this.sales.filter(
            i => (!!i.confirmation)
              && !(['confirmer', 'livrer', 'expidier'].includes(i.delivery))
          ).length,
          // value: 231,
          color: 'primary-orange',
          icon: 'mdi-reload'
        }
      },

      shippedSales() {
        return {
          id: 4,
          title: "Shipped",
          value: this.sales.filter((i) => i.delivery == "expidier").length,
          pourcentage: ((this.sales.filter((i) => i.delivery == 'expidier').length * 100) / (this.sales.filter((i) => i.confirmation == "confirmer").length)).toFixed(2),

          // value: 112,
          color: "primary-orange",
          icon: "mdi-truck",
        };
      },

      transferSales() {
        return {
          id: 8,
          title: "Transferred",
          value: this.sales.filter((i) => i.delivery == "transfer").length,
          pourcentage: ((this.sales.filter((i) => i.delivery == 'transfer').length * 100) / (this.sales.filter((i) => i.confirmation == "confirmer").length)).toFixed(2),

          // value: 112,
          color: "purple-darken-1",
          icon: "mdi-truck",
        };
      },


      reportedSales() {
        return {
          id: 5,
          title: 'Reported',
          value: this.sales.filter(i => i.delivery == 'reporter').length,
          pourcentage: ((this.sales.filter((i) => i.delivery == 'reporter').length * 100) / (this.sales.filter((i) => i.confirmation == "confirmer").length)).toFixed(2),

          // value: 112,
          color: 'primary-blue',
          icon: 'mdi mdi-clock-outline'
        }
      },

      canceledSales() {
        return {
          id: 6,
          title: 'Canceled',
          value: this.sales.filter(i => i.delivery == 'annuler').length,
          pourcentage: ((this.sales.filter((i) => i.delivery == 'annuler').length * 100) / (this.sales.filter((i) => i.confirmation == "confirmer").length)).toFixed(2),
          // value: 112,
          color: 'red-accent-3',
          icon: 'mdi mdi-cancel'
        }
      },
      noanswerSales() {
        return {
          id: 6,
          title: "No Answer",
          value: this.sales.filter((i) => i.delivery == 'pas-de-reponse').length,
          pourcentage: ((this.sales.filter((i) => i.delivery == 'pas-de-reponse').length * 100) / (this.sales.filter((i) => i.confirmation == "confirmer").length)).toFixed(2),
          // value: 112,
          color: "yellow-darken-3",
          icon: "mdi mdi-headphones-off",
        };
      }
    },
    mounted() {
      Sale.all()
        .then((res) => {
          if (res?.data.code == "SUCCESS") {
            const sales = res.data.data.orders;
            console.log(res.data);
            this.$store.dispatch("sale/setSales", sales);
            this.$store.dispatch("sale/setFetched", true);
            this.isLoaded = true;
          }
        })
        .catch(this.$handleApiError);
    },
  };
</script>

<style></style>