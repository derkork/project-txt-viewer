import { EasingType } from 'fatina';
<template>
  <g>
    <defs>
      <marker :id="uid" viewBox="0 0 10 10"
              :refX="10+arrayOffset" refY="5"
              markerUnits="strokeWidth"
              markerWidth="10" markerHeight="10"
              orient="auto">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="#f000000" :style="`opacity:${1-(arrayOffset/arraySize)};`"/>
      </marker>
    </defs>
    <path class="edge" ref="path"
          :style="`stroke-dasharray:${arraySize};stroke-dashoffset:${arrayOffset}`"
          v-bind:d="pathSpec"
          :marker-end="`url(#${uid})`"
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
import {Prop, Vue, Watch} from 'vue-property-decorator';
import Component from 'vue-class-component';
import {GraphEdge} from 'dagre';
import Fatina, {EasingType} from 'fatina';
import {uid} from 'quasar';

@Component
export default class TaskPath extends Vue {
  @Prop({default: null, required: true})
  private edge!: GraphEdge;


  arraySize: number = 0;
  arrayOffset: number = 0;

  mounted() {
    this.onSpecChange();
  }

  @Watch('pathSpec')
  onSpecChange() {
    // make sure the thing is not drawn
    this.arraySize = 1000;
    this.arrayOffset = 0;
    // wait one tick for the DOM to update, as we need to have the path length from the dom
    this.$nextTick(() => {
      this.arraySize = (this.$refs.path as SVGPathElement).getTotalLength();
      const obj = {value: this.arraySize};
      Fatina.tween(obj)
        .to({value: 0}, 1000)
        .setEasing(EasingType.InOutExponential)
        .onUpdate(() => this.arrayOffset = obj.value)
        .start();
    });
  }
  /**
   * The path specification.
   */
  get pathSpec() {
    const spec = `M${this.edge.points[0].x},${this.edge.points[0].y}`;
    const strings: string[] = this.edge.points.slice(1).map((it) => `L${it.x},${it.y}`);
    return spec.concat(...strings)
  }

  get uid() {
    return uid();
  }
}
</script>

