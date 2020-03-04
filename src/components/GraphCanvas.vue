<template>
  <svg ref="svg"></svg>
</template>

<style type="text/css">
  g.type-TK > rect {
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

const GraphCanvasProps = Vue.extend({
  props: {
    project: Project,
    dependencies: ProjectDependencies
  }
});

@Component
export default class GraphCanvas extends GraphCanvasProps {

  /**
   * Computes a graph from the project and its dependencies.
   */
  get graph(): graphlib.Graph {
    // Create the input graph
    const g = new graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function () {
        return {};
      });

    g.setNode('0', {label: 'TOP', class: 'type-TOP'});
    g.setNode('1', {label: 'S', class: 'type-S'});
    g.setNode('2', {label: 'NP', class: 'type-NP'});
    g.setNode('3', {label: 'DT', class: 'type-DT'});
    g.setNode('4', {label: 'This', class: 'type-TK'});
    g.setNode('5', {label: 'VP', class: 'type-VP'});
    g.setNode('6', {label: 'VBZ', class: 'type-VBZ'});
    g.setNode('7', {label: 'is', class: 'type-TK'});
    g.setNode('8', {label: 'NP', class: 'type-NP'});
    g.setNode('9', {label: 'DT', class: 'type-DT'});
    g.setNode('10', {label: 'an', class: 'type-TK'});
    g.setNode('11', {label: 'NN', class: 'type-NN'});
    g.setNode('12', {label: 'example', class: 'type-TK'});
    g.setNode('13', {label: '.', class: 'type-.'});
    g.setNode('14', {label: 'sentence', class: 'type-TK'});

    g.nodes().forEach(function (v) {
      const node = g.node(v);
      // Round the corners of the nodes
      node.rx = node.ry = 5;
    });

    // Set up edges, no special attributes.
    g.setEdge('0', '1');
    g.setEdge('3', '4');
    g.setEdge('2', '3');
    g.setEdge('1', '2');
    g.setEdge('6', '7');
    g.setEdge('5', '6');
    g.setEdge('9', '10');
    g.setEdge('8', '9');
    g.setEdge('11', '12');
    g.setEdge('8', '11');
    g.setEdge('5', '8');
    g.setEdge('1', '5');
    g.setEdge('13', '14');
    g.setEdge('1', '13');
    return g;
  }

  mounted() {
    const renderer = new render();
    let svgNode = this.$refs.svg as EventTarget;
    const svg = d3.select(svgNode);
    const group = svg.append('g');
    const graph = this.graph;
    renderer(group, graph);

    const xCenterOffset = (parseFloat(svg.attr('width')) - graph.graph().width) / 2;
    group.attr('transform', 'translate(' + xCenterOffset + ', 20)');
    svg.attr('height', graph.graph().height + 40);
  }
}

</script>

<style scoped>

</style>
