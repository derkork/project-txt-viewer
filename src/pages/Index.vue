<template>
  <q-page class="flex flex-center">
    <GraphCanvas></GraphCanvas>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import GraphCanvas from '../components/GraphCanvas.vue';
import {getModule} from 'vuex-module-decorators';
import MainStoreModule from '../store/MainStoreModule';

  @Component({
    components: {GraphCanvas}
  })
export default class PageIndex extends Vue {
  store = getModule(MainStoreModule);

  mounted() {
    const input = '[ ] foo :#foo\n[ ] bar :#bar\n[x] baz :<#bar \n[ ] bam :<#bar :<#foo';
    this.store.loadProject(input);
  }

}
</script>
