<template>
  <div v-if="visible">
    <teleport to="body">
      <div>
        <div
          ref="popup"
          class="
            tw-fixed tw-top-0 tw-left-0 tw-z-[50999] tw-right-0 tw-bottom-0
            tw-flex tw-items-center tw-justify-center
          "
        >
          <div
            name="body"
            class=" tw-z-[50999] tw-bg-white md:tw-min-w-[300px] md:tw-max-w-[800px] tw-flex tw-flex-col md:tw-min-h-[170px] tw-shadow-lg tw-rounded-lg tw-py-3 tw-px-5"
          >
            <div class="tw-font-medium tw-text-lg  mb-5 tw-text-start" :class="currentType.class">
              <v-icon size="small" class="mr-1">{{ currentType.icon }}</v-icon>
              <span>{{ title }}</span>
              </div>
            <div v-if="body" class="tw-text-center tw-text-lg tw-text-gray-700" v-html="body">
            </div>
            <div class="tw-text-lg tw-text-gray-700" v-else>
              <slot></slot>
            </div>
            <v-spacer></v-spacer>
            <div class="tw-flex tw-gap-3 tw-justify-end mt-5">
              <v-btn  variant="flat" color="grey" @click="resolve(false)">Cancel</v-btn>
              <v-btn v-if="!noConfirm" :loading="loading" variant="flat" :color="!!btnColor ? btnColor : 'red'" @click="resolve(true)">Confirm</v-btn>
            </div>
          </div>

          <div
            @click="resolve(false)"
            class="
            tw-duration-300
              tw-absolute
              tw-top-0
              tw-left-0
              tw-w-full
              tw-h-full
              tw-bg-neutral-900/50
              tw-opacity-0
            "
            :class="{'!tw-opacity-100': visible}"
          ></div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  props: ["visible", "loading", "title", "body", "type", 'noConfirm', 'btnColor'],
  data() {
    return {
      show: true,
      types: {
        warning: {
          class: 'tw-text-orange-400',
          icon: 'mdi-alert-circle-outline'
        },
        info: {
          class: 'tw-text-blue-400',
          icon: 'mdi-information-outline'
        }
      }
    };
  },
  watch: {
    visible(value) {
      this.show = value;
    },
  },
  methods: {
    resolve(value) {
      this.$emit("resolved", value);
    },
  },
  computed: {
    currentType() {
      return this.types[this.type]
    }
  }
};
</script>

<style>
</style>