<template>
  <div class="tw-flex tw-items-center tw-gap-1">
    
    <v-btn
      @click="showUpdateCommentPopup = true"
      v-if="$can(`update_factorisation`)"
      class="mr-2 !tw-px-0 !tw-py-0"
      min-height="25px"
      min-width="30"
      color="blue"
      variant="flat"
      density="comfortable"
      :ripple="false"
      size="small"
    >
      <v-icon color="white">mdi-comment-text</v-icon>
      <!-- <span class="text-white text-capitalize">Edit</span> -->
    </v-btn>
    <v-btn
      @click="showUpdatePopup = true"
      v-if="$can(`update_factorisation`)"
      class="mr-2 !tw-px-0 !tw-py-0"
      min-height="25px"
      min-width="30"
      color="orange"
      variant="flat"
      density="comfortable"
      :ripple="false"
      size="small"
    >
      <v-icon color="white">mdi-pencil-outline</v-icon>
      <!-- <span class="text-white text-capitalize">Edit</span> -->
    </v-btn>
    <!-- <v-btn :to="'/factorisations/' + factorisation.id"  v-if="$can(`view_factorisation`)" class="mr-2 !tw-px-0 !tw-py-0" min-height="25px" min-width="30" color="blue" variant="flat" density="comfortable" :ripple="false" size="small">
      <v-icon color="white">mdi-eye-outline</v-icon> -->
    <!-- <span class="text-white text-capitalize">View</span> -->
    <!-- </v-btn> -->
    <v-btn
      @click="showPopup = true"
      v-if="$can(`delete_factorisation`)"
      class="mr-2 !tw-px-0 !tw-py-0"
      min-height="25px"
      min-width="30"
      color="red"
      variant="flat"
      density="comfortable"
      :ripple="false"
      size="small"
    >
      <v-icon color="white">mdi-delete-outline</v-icon>
      <!-- <span class="text-white text-capitalize">Delete</span> -->
    </v-btn>

    <v-btn
      @click="showUpdateFeesPopup = true"
      v-if="$can(`update_factorisation`) && this.factorisation.type =='seller'"
      class="mr-2 !tw-px-0 !tw-py-0"
      min-height="25px"
      min-width="30"
      color="green"
      variant="flat"
      density="comfortable"
      :ripple="false"
      size="small"
    >
      <v-icon color="white">mdi-format-list-text</v-icon>
      <!-- <span class="text-white text-capitalize">Edit</span> -->
    </v-btn>

    <UpdateFactorisation
      :visible="showUpdatePopup"
      @cancel="showUpdatePopup = false"
      :key="factorisation.id"
      :factorisation="factorisation"
    />

    <UpdateComment
      :visible="showUpdateCommentPopup"
      @cancel="showUpdateCommentPopup = false"
      :key="factorisation.id"
      :factorisation="factorisation"
    />

    <UpdateFees
    :visible="showUpdateFeesPopup"
    @cancel="showUpdateFeesPopup = false"
    :key="factorisation.id"
    :factorisation="factorisation"
  />


    <popup
      type="warning"
      title="Warning"
      body="<p>Are you sure you want to delete this factorisation?</p> You won't be able to revert this!"
      :loading="isLoading"
      :visible="showPopup"
      @resolved="handleResolved"
    />
  </div>
</template>
<script>
import Factorisation from "@/api/Factorisation";
import UpdateFactorisation from "./UpdateFactorisation";
import UpdateComment from "./UpdateComment";
import UpdateFees from "./UpdateFees";

// myVue.vue

// your vue component
export default {
  // access any cell properties here
  components: { UpdateFactorisation, UpdateComment, UpdateFees},
  props: ["rowIndex", "factorisation"],
  name: "factorisationActions",
  data() {
    return {
      showPopup: false,
      isLoading: false,
      showUpdateCommentPopup: false,
      showUpdateFeesPopup: false,
      showUpdatePopup: false,
    };
  },
  methods: {
    handleResolved(response) {
      if (response) {
        this.isLoading = true;
        Factorisation.delete(this.factorisation.id)
          .then((res) => {
            if (res.data.code == "FACTORISATION_DELETED") {
              this.isLoading = false;
              this.$alert({
                type: "success",
                title: "Factorisation Deleted Successfully",
              });
              this.$store.dispatch(
                "factorisation/delete",
                this.factorisation.id
              );
            }
            if (res.data.code == "DELETE_ERROR") {
              this.$alert({
                type: "warning",
                title: res.data.message,
              });
            }
            // Warehouse.all().then(res => {
            //   if(res.data.code == 'SUCCESS') {
            //     this.$store.dispatch('factorisation/setWarehouses', res.data.data.factorisations)
            //   }
            // }).catch(this.$handleApiError)
          })
          .catch(this.$handleApiError)
          .finally(() => {
            this.isLoading = false;
            this.showPopup = false;
          });
      } else {
        this.showPopup = false;
      }
    },
  },
};
</script>
