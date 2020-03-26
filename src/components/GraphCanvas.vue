<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    class="col"
    :key="key"
    @wheel="zoom"
    @mousedown.left="startDrag"
    @mouseup.left="stopDrag"
    @mousemove="doDrag"
  >
    <defs>
      <marker id="triangle" viewBox="0 0 10 10"
              refX="1" refY="5"
              markerUnits="strokeWidth"
              markerWidth="10" markerHeight="10"
              orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f000000"/>
      </marker>
    </defs>
    <g :transform="centerTransform">
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
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {getModule} from 'vuex-module-decorators';
import ProjectStoreModule from '../store/ProjectStoreModule';
import TaskNode from './TaskNode.vue';
import TaskPath from './TaskPath.vue';
import {NodeRadius} from '../Constants';
import {GraphEdge, graphlib, layout, Node} from 'dagre';
import Graph = graphlib.Graph;


@Component({
  components: {TaskPath, TaskNode}
})
export default class GraphCanvas extends Vue {
  store = getModule(ProjectStoreModule);
  key: number = 0;
  zoomFactor: number = 1;
  offsetX: number = 0;
  offsetY: number = 0;
  isDragging = false;

  startDrag() {
    this.isDragging = true;
  }

  stopDrag() {
    this.isDragging = false;
  }

  doDrag(event: MouseEvent) {
    if (this.isDragging) {
      this.offsetX += event.movementX;
      this.offsetY += event.movementY;
    }
  }

  zoom(event: WheelEvent) {
    this.zoomFactor = Math.min(3, Math.max(0.1, this.zoomFactor + 0.1 * -Math.sign(event.deltaY)));
  }


  get graph(): Graph | undefined {
    const project = this.store.project;
    const dependencies = this.store.dependencies;

    if (!project || !dependencies) {
      return undefined;
    }

    const graph = new Graph();
    graph.setGraph({});
    graph.setDefaultEdgeLabel(function () {
      return {};
    });

    // create an index of our nodes
    for (const task of project.tasks) {
      graph.setNode(task.index.toString(), {
        label: task.title,
        width: NodeRadius,
        height: NodeRadius,
        task: task,
        effectiveState: dependencies.getEffectiveTaskState(task),
        assignments: dependencies.getAssignments(task),
        finishDate: dependencies.getFinishDate(task)
      });
      const prerequisites = dependencies.getPrerequisites(task);
      for (let prerequisite of prerequisites) {
        graph.setEdge(prerequisite.index.toString(), task.index.toString());
      }
    }

    layout(graph);

    return graph;
  }

  get nodes(): Node[] {
    const graph = this.graph;
    if (!graph) {
      return [];
    }
    return graph.nodes().map((it) => graph.node(it));
  }

  get edges(): GraphEdge[] {
    const graph = this.graph;
    if (!graph) {
      return [];
    }
    return graph.edges().map((it) => graph.edge(it));
  }

  get centerTransform(): string {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;

    for (let node of this.nodes) {
      if (node.x < minX) {
        minX = node.x;
      }
      if (node.y < minY) {
        minY = node.y;
      }

    }

    minX -= NodeRadius;
    minY -= NodeRadius;


    return `translate(${-minX + this.offsetX},${-minY + this.offsetY}) scale(${this.zoomFactor})`;
  }
}
</script>
