import { EasingType } from 'fatina';
<template>
  <g :transform="animatedTransform">
    <slot></slot>
  </g>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import TaskPath from './TaskPath.vue';
import TaskNode from './TaskNode.vue';
import Vue from 'vue';
import {Prop, Watch} from 'vue-property-decorator';
import Fatina, {EasingType, ITween} from 'fatina';

@Component({
  components: {TaskPath, TaskNode}
})
export default class AnimatedGroup extends Vue {
  @Prop({default: 0})
  x!: number;

  @Prop({default: 0})
  y!: number;

  animatedX = 0;
  animatedY = 0;

  runningTweenX: ITween | undefined;
  runningTweenY: ITween | undefined;

  mounted() {
    this.onXChange(this.x, this.animatedX);
    this.onYChange(this.y, this.animatedY);
  }

  beforeDestroy() {
    this.runningTweenX?.kill();
    this.runningTweenY?.kill();
  }

  @Watch('x')
  onXChange(newValue: number, oldValue: number) {
    if (this.runningTweenX) {
      this.runningTweenX.kill();
    }
    this.runningTweenX = this.doTween(newValue, oldValue, value => this.animatedX = value);
  }

  @Watch('y')
  onYChange(newValue: number, oldValue: number) {
    if (this.runningTweenY) {
      this.runningTweenY.kill();
    }
    this.runningTweenY = this.doTween(newValue, oldValue, value => this.animatedY = value);
  }


  doTween(newValue: number, oldValue: number, assign: (value: number) => void) : ITween {
    const obj = {value: oldValue};
    return Fatina.tween(obj)
      .to({value: newValue}, 500)
      .setEasing(EasingType.InOutExponential)
      .onUpdate(() => {
        assign(obj.value);
      }).start();

  }


  get animatedTransform(): string {
    return `translate(${this.animatedX}, ${this.animatedY})`;
  }


}
</script>
