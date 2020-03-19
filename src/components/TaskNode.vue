<template>
  <g :transform="rootTransform">
    <rect :class="{ node:true, done:isDone, on_hold: isOnHold, in_progress: isInProgress }"
          rx="5"
          ry="5"
          :width="width"
          :height="height">
    </rect>
    <g :class="{ label:true, done:isDone, on_hold: isOnHold, in_progress: isInProgress }"
       v-bind:transform="centerTransform">
      <text text-anchor="middle"
            v-for="(line, index) in wrappedText"
            :y="((-wrappedText.length/2) + 0.5 + (index)) + 'em'"
            :key="line"
      >
        {{line}}
      </text>
    </g>
    <!-- Gravatar icons for all assigned people  -->
    <g
      v-for="(assignment,index) in assignments.slice().reverse()"
      :key="assignment.emailAddress"
      :transform="`translate(${-50 + (assignments.length - index) * 25},-25)`"
    >
      <gravatar
        :email="assignment.emailAddress"
        :size="50"
      >
      </gravatar>
    </g>
  </g>
</template>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="scss" scoped>
  rect.node {
    fill: $blue;
    stroke: $blue-11;
    stroke-width: 2px;

    &.in_progress {
      fill: $yellow;
      stroke: $yellow-11;
    }

    &.done {
      fill: $green;
      stroke: $green-11;
    }

    &.on_hold {
      fill: $red;
      stroke: $red-11;
    }
  }

  .label text {
    fill: white;
  }

  .label.in_progress text {
    fill: black;
  }
</style>

<script lang="ts">
import {Prop, Vue} from 'vue-property-decorator';
import Component from 'vue-class-component';
import {Node} from 'dagre';
import {NodeRadius} from '../Constants';
import {Person, TaskState} from 'project.txt';
import Gravatar from './Gravatar.vue';

@Component({
  components: {Gravatar}
})
export default class TaskNode extends Vue {
  @Prop({default: null, required: true})
  private node!: Node;


  get wrappedText(): string[] {
    const label = this.node.task.title as string;
    const words = label.split(/\s+/);

    let lines: string[] = [];
    let line = '';
    while (words.length > 0) {
      const word = words.shift() || '';

      // does the word still fit on the line?
      if (line.length + word.length + 1 < 20) {
        line += ' ' + word;
      } else {
        if (line.length == 0) { // overlong word
          line = word;
          lines.push(line);
          line = '';
        } else {
          lines.push(line);
          line = word;
        }
      }
    }

    if (line.length > 0) {
      lines.push(line);
    }

    return lines;
  }

  get isDone() {
    return this.node.task.state === TaskState.Done;
  }

  get isOnHold() {
    return this.node.task.state === TaskState.OnHold;
  }

  get isInProgress() {
    return this.node.task.state === TaskState.InProgress;
  }

  get assignments(): Person[] {
    return this.node.assignments || [];
  }

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

  get width() {
    return NodeRadius;
  }

  get height() {
    return NodeRadius;
  }

  /**
   * The left edge of the node.
   */
  get left() {
    return this.node.x - NodeRadius / 2;
  }

  /**
   * The top edge of the node.
   */
  get top() {
    return this.node.y - NodeRadius / 2;
  }

  /**
   * The node's horizontal center.
   */
  get centerX() {
    return NodeRadius / 2;
  }

  /**
   * The node's vertical center.
   */
  get centerY() {
    return NodeRadius / 2;
  }
}
</script>

