<template>
  <g>
    <path class="edge"
          v-bind:d="pathSpec"
          marker-end="url(#triangle)"
    >
    </path>
  </g>
</template>

<style scoped>
  path.edge {
    fill: none;
    stroke: #000000;
    stroke-width: 1px;
  }
</style>

<script lang="ts">
import {Prop, Vue} from 'vue-property-decorator';
import Component from 'vue-class-component';
import {GraphEdge} from 'dagre';

@Component
export default class TaskPath extends Vue {
  @Prop({default: null, required: true})
  private edge!: GraphEdge;

  /**
   * The path specification.
   */
  get pathSpec() {
    const spec = `M${this.edge.points[0].x},${this.edge.points[0].y}`;
    const strings: string[] = this.edge.points.slice(1).map((it) => `L${it.x},${it.y}`);
    return spec.concat(...strings)
  }
}
</script>

