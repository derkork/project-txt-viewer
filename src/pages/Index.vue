<template>
  <q-page class="col column">
    <splitter :mode="viewMode">
      <template slot="left">
        <code-mirror
          v-model="projectSource"
          :options="options"
          ref="codeMirror"
        ></code-mirror>
      </template>
      <template slot="right">
        <graph-canvas></graph-canvas>
      </template>
    </splitter>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import GraphCanvas from '../components/GraphCanvas.vue';
import {getModule} from 'vuex-module-decorators';
import ProjectStoreModule from '../store/ProjectStoreModule';
import AppStateStoreModule from '../store/AppStateStoreModule';
import Splitter from '../components/Splitter.vue';
import CodeMirror from '../components/CodeMirror.vue';
import {EditorConfiguration} from 'codemirror';
import 'codemirror/addon/selection/active-line';
import {EventBus} from '../EventBus';

@Component({
  components: {CodeMirror, Splitter, GraphCanvas}
})
export default class PageIndex extends Vue {
  appState = getModule(AppStateStoreModule);
  project = getModule(ProjectStoreModule);
  options:EditorConfiguration = {
    lineNumbers: true,
    styleActiveLine: {
      nonEmpty: true
    }
  };

  mounted() {
    EventBus.$on('select-task', this.selectLineNumber)
  }

  beforeDestroy() {
    EventBus.$off('select-task', this.selectLineNumber);
  }

  selectLineNumber(evt: number) {
    console.log('Selecting task with line: ', evt);
    const codeMirror: CodeMirror = this.$refs.codeMirror as CodeMirror;
    // @ts-ignore
    codeMirror.setCursorToLine(evt);
  }

  get viewMode() {
    return this.appState.viewMode;
  }

  get projectSource() {
    return this.project.projectSource;
  }

  set projectSource(value: string) {
    this.project.setProjectSource(value);
    this.project.parseProjectFromSource();
  }


}
</script>
