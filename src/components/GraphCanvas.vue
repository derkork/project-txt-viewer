<template>
  <div>
    <svg>
      <defs>
        <marker id="triangle" viewBox="0 0 10 10"
                refX="1" refY="5"
                markerUnits="strokeWidth"
                markerWidth="10" markerHeight="10"
                orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f000000"/>
        </marker>
      </defs>
      <g>
        <task-node
          v-for="node in nodes"
          :key="node.uid"
          v-bind:node="node"
        >
        </task-node>

        <task-path
          v-for="edge in edges"
          :key="edge.uid"
          v-bind:edge="edge"
          >
        </task-path>
      </g>
    </svg>

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
import {GraphEdge, Node} from 'dagre';
import TaskNode from './TaskNode.vue';
import TaskPath from './TaskPath.vue';
@Component({
  components: {TaskPath, TaskNode}
})
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
