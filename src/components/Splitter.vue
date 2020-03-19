<template>
  <div class="col column">
    <template v-if="mode === 0">
      <slot name="left"></slot>
    </template>

    <template v-if="mode === 1">
      <q-splitter :value="50" class="col" after-class="column splitter-fix" before-class="column splitter-fix">
        <template v-slot:before>
            <slot name="left"></slot>
        </template>
        <template v-slot:after>
            <slot name="right"></slot>
        </template>
      </q-splitter>
    </template>

    <template v-if="mode === 2">
      <slot name="right"></slot>
    </template>
  </div>
</template>

<style lang="sass">
.splitter-fix
  height: unset !important

</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {ViewMode} from '../store/ViewMode';
import {Prop} from 'vue-property-decorator';

@Component({})
export default class Splitter extends Vue {
  @Prop()
  mode!: ViewMode;
}
</script>
