<template>
  <svg ref="svg"></svg>
</template>

<style type="text/css">
  g.task > rect {
    border-radius: 5px;
    fill: #00ffd0;
  }

  text {
    font-weight: 300;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 14px;
  }

  .node rect {
    stroke: #999;
    fill: #fff;
    stroke-width: 1.5px;
  }

  .edgePath path {
    stroke: #333;
    stroke-width: 1.5px;
  }
</style>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Project, ProjectDependencies} from 'project.txt';
import {graphlib, render} from 'dagre-d3';
import * as d3 from 'd3';
import {Watch} from 'vue-property-decorator';

const GraphCanvasProps = Vue.extend({
  props: {
    project: Project,
    dependencies: ProjectDependencies
  },
});

@Component
export default class GraphCanvas extends GraphCanvasProps {

  isMounted:boolean = false;

  mounted() {
    this.isMounted = true;
    this.refresh();
  }

  refresh() {
    if (!this.isMounted || !this.project ||!this.dependencies) {
      console.log('Not yet ready.');
      return;
    }

    console.log('Re-Rendering!');
    // Create the input graph
    const graph = new graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function () {
        return {};
      });

    for (const task of this.project.tasks) {
      graph.setNode(task.uid, {
        label: task.title,
        class: 'task',
        rx: 5,
        ry: 5
      });
      const prerequisites = this.dependencies.getPrerequisites(task);
      for (let prerequisite of prerequisites) {
        graph.setEdge(prerequisite.uid, task.uid);
      }
    }



    const renderer = new render();
    let svgNode = this.$refs.svg as EventTarget;
    const svg = d3.select(svgNode);
    const group = svg.append('g');
    renderer(group, graph);

    const xCenterOffset = (parseFloat(svg.attr('width')) - graph.graph().width) / 2;
    group.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg.attr('height', graph.graph().height + 40);
  }

  @Watch('project')
  onProjectChange() {
    this.refresh();
  }
}

</script>

<style scoped>

</style>
