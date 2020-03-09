<template>
  <g v-bind:transform="rootTransform">
    <rect class="node"
          rx="5"
          ry="5"
          v-bind:width="node.width"
          v-bind:height="node.height">
    </rect>
    <g class="label"
       v-bind:transform="centerTransform">
      <text text-anchor="middle" y="-0.5em">
        <tspan space="preserve" dy="1em" x="1">{{node.label}}</tspan>
      </text>
    </g>
  </g>
</template>

<style scoped>
  rect.node {
    fill: #ffffff;
    stroke: #000000;
    stroke-width: 1px;
  }
</style>

<script lang="ts">
import {Prop, Vue} from 'vue-property-decorator';
import Component from 'vue-class-component';
import {Node} from 'dagre';

@Component
export default class TaskNode extends Vue {
  @Prop({default: null, required: true})
  private node!: Node;

  /**
   * The transform to be applied to the root element. Positions the node in the drawing.
   */
  get rootTransform() {
    return `translate(${this.left},${this.top})`
  }

  /**
   * The transform to be applied to the centered element. Positions the contents of the node inside of it.
   */
  get centerTransform() {
    return `translate(${this.centerX},${this.centerY})`;
  }

  /**
   * The left edge of the node.
   */
  get left() {
    return this.node.x - this.node.width /2;
  }

  /**
   * The top edge of the node.
   */
  get top() {
    return this.node.y - this.node.height / 2;
  }

  /**
   * The node's horizontal center.
   */
  get centerX() {
    return this.node.width / 2;
  }

  /**
   * The node's vertical center.
   */
  get centerY() {
    return this.node.height / 2;
  }
}
</script>

