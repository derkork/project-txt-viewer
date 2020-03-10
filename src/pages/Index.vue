<template>
  <q-page class="flex flex-center">

    <q-input
      v-if="viewMode === 0"
      type="textarea"
    >

    </q-input>
    <GraphCanvas v-if="viewMode===2"></GraphCanvas>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import GraphCanvas from '../components/GraphCanvas.vue';
import {getModule} from 'vuex-module-decorators';
import ProjectStoreModule from '../store/ProjectStoreModule';
import AppStateStoreModule from "../store/AppStateStoreModule";

@Component({
  components: {GraphCanvas}
})
export default class PageIndex extends Vue {
  appState = getModule(AppStateStoreModule);
  project = getModule(ProjectStoreModule);


  mounted() {
    const input = '[ ] foo :#foo\n[ ] bar :#bar\n[x] baz :<#bar \n[ ] bam :<#bar :<#foo';
    this.project.loadProject(input);
  }

  get viewMode() {
    return this.appState.viewMode;
  }

}
</script>
