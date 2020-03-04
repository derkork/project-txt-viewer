<template>
  <q-page class="flex flex-center">
    <GraphCanvas v-bind:dependencies="dependencies" v-bind:project="project">

    </GraphCanvas>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component';
import GraphCanvas from '../components/GraphCanvas.vue';
import {Project, ProjectDependencies, parse,calculateDependencies} from 'project.txt';

  @Component({
    components: {GraphCanvas}
  })
export default class PageIndex extends Vue {
  project: Project|null = null;
  dependencies: ProjectDependencies|null = null;

  mounted() {
    const input = '[ ] foo\n[ ] bar';
    this.project = parse(input).project;
    this.dependencies = calculateDependencies(this.project);
  }

}
</script>
