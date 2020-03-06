<template>
  <div>
    <h1>Nodes</h1>
    <div v-for="node in nodes" :key="node['uid']">
      {{ JSON.stringify(node) }}
    </div>
    <h1>Edges</h1>
    <div v-for="edge in edges" :key="edge['uid']">
      {{ JSON.stringify(edge) }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {getModule} from 'vuex-module-decorators';
import MainStoreModule from '../store/MainStoreModule';
import {GraphEdge, Node} from "dagre";

@Component
export default class GraphCanvas extends Vue {
  store = getModule(MainStoreModule)

  get nodes():Node[] {
    return this.store.nodes;
  }

  get edges():GraphEdge[] {
    return this.store.edges;
  }

}
</script>
