<template>
  <div>
    <popup-full @cancel="$emit('cancel')" :visible="visible">
      <div
        class="md:tw-w-[80%] tw-w-[95%] tw-px-5 tw-max-w-[750px] tw-mx-auto tw-my-3 tw-min-h-fit tw-bg-white tw-rounded-lg tw-shadow-lg tw-py-5"
      >
        <h1 class="tw-text-lg">Update Factorisation</h1>

        <div class="tw-grid tw-grid-cols-12 tw-gap-y-1 tw-gap-x-3 mt-5">
          <div class="tw-w-full tw-col-span-6">
            <div class="mb-1 text-body-2 tw-text-zinc-700">
              Factorisation Code
            </div>
            <v-text-field
              :error="!formStatus.factorisation_id.valid"
              @keyup="resetError('factorisation_id')"
              :hide-details="true"
              v-model="Factorisation.factorisation_id"
              clearable
              clear-icon="mdi-close"
              class="tw-w-full"
              variant="outlined"
              color="primary-color"
              density="compact"
            ></v-text-field>
            <div class="tw-h-[3px] tw-text-red-700 tw-mb-3 tw-mt-1 tw-text-xs">
              {{ formStatus.factorisation_id.message }}
            </div>
          </div>

          <div class="tw-w-full tw-col-span-6">
            <div class="mb-1 text-body-2 tw-text-zinc-700">Delivery</div>
            <v-text-field
              :error="!formStatus.delivery_id.valid"
              @keyup="resetError('delivery_id')"
              :hide-details="true"
              :disabled="true"
              v-model="deliveryName"
              clearable
              disable
              clear-icon="mdi-close"
              class="tw-w-full"
              variant="outlined"
              color="primary-color"
              density="compact"
            ></v-text-field>
            <div class="tw-h-[3px] tw-text-red-700 tw-mb-3 tw-mt-1 tw-text-xs">
              {{ formStatus.delivery_id.message }}
            </div>
          </div>

          <div class="tw-w-full tw-col-span-6">
            <div class="mb-1 text-body-2 tw-text-zinc-700">Total Price</div>
            <v-text-field
              :error="!formStatus.price.valid"
              @keyup="resetError('price')"
              :hide-details="true"
              v-model="Factorisation.price"
              :disabled="true"
              clearable
              clear-icon="mdi-close"
              class="tw-w-full"
              variant="outlined"
              color="primary-color"
              density="compact"
            ></v-text-field>
            <div class="tw-h-[3px] tw-text-red-700 tw-mb-3 tw-mt-1 tw-text-xs">
              {{ formStatus.price.message }}
            </div>
          </div>

          <div class="tw-w-full tw-col-span-6">
            <div class="mb-1 text-body-2 tw-text-zinc-700">Nb Commands</div>
            <v-text-field
              :error="!formStatus.commands_number.valid"
              :disabled="true"
              @keyup="resetError('commands_number')"
              :hide-details="true"
              v-model="Factorisation.commands_number"
              clearable
              clear-icon="mdi-close"
              class="tw-w-full"
              variant="outlined"
              color="primary-color"
              density="compact"
            ></v-text-field>
            <div class="tw-h-[3px] tw-text-red-700 tw-mb-3 tw-mt-1 tw-text-xs">
              {{ formStatus.commands_number.message }}
            </div>
          </div>
        </div>

        <div class="tw-flex tw-gap-2 mt-3 mb-2 tw-justify-end">
          <v-btn
            @click="$emit('cancel')"
            color="grey-darken-2"
            variant="flat"
            class="text-capitalize"
          >
            <span class="text-white"> Cancel </span>
          </v-btn>
          <v-btn
            :loading="isLoading"
            @click="update"
            color="primary-color"
            variant="flat"
            class="text-capitalize"
          >
            <span class="text-white"> Update </span>
          </v-btn>
        </div>
      </div>
    </popup-full>
  </div>
</template>

<script>
import { validateName, validateNumber } from "@/helpers/validators";
import Factorisation from "@/api/Factorisation";

export default {
  components: {},
  props: ["factorisation", "visible"],
  data() {
    return {
      isLoading: false,
      isLoaded: false,

      Factorisation: {
        factorisation_id: "",
        delivery_id: 0,
        price: 0,
        commands_number: 0,
        note: "",
      },

      formStatus: {
        factorisation_id: {
          valid: true,
          message: "",
        },

        delivery_id: {
          valid: true,
          message: "",
        },

        price: {
          valid: true,
          message: "",
        },

        commands_number: {
          valid: true,
          message: "",
        },
      },
    };
  },

  computed: {
    deliveryName: {
      get() {
        return this.Factorisation.delivery.firstname + ' ' + this.Factorisation.delivery.lastname
      },
      set(v) {
        console.log(v);
      }
    }
  },

  methods: {
    update() {
      if (!this.validate()) return false;

      this.isLoading = true;

      // let Factorisation = this.Factorisation;

      Factorisation.update(this.factorisation.id, this.Factorisation)
        .then((res) => {
          if (res.data.code == "FACTORISATION_UPDATED") {
            this.$alert({
              type: "success",
              title: res.data.message,
            });
            this.$store.dispatch("factorisation/update", this.Factorisation);
            this.$emit("cancel");
          }

          if (res.data.code == "FACTORISATION_NOT_UPDATED") {
            this.$alert({
              type: "warning",
              title: res.data.message,
            });
          }
        })
        .catch((err) => {
          this.$handleApiError(err);
        })
        .finally(() => (this.isLoading = false));
    },

    resetError(field) {
      this.formStatus[field] = {
        valid: true,
        message: "",
      };
    },

    validate() {
      this.formStatus.factorisation_id = validateName(
        this.Factorisation.factorisation_id,
        "Factorisation Code"
      );

      this.formStatus.price = validateNumber(
        this.Factorisation.price,
        "Factorisation Price"
      );

      this.formStatus.commands_number = validateNumber(
        this.Factorisation.commands_number,
        "Factorisation Nb Commands"
      );

      return (
        this.formStatus.factorisation_id.valid &&
        this.formStatus.price.valid &&
        this.formStatus.commands_number.valid
      );
    },
  },

  mounted() {
    this.Factorisation = { ...this.factorisation };
  },
};
</script>

<style></style>
