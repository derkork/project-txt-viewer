import { EffectiveTaskState } from 'project.txt/src/main/EffectiveTaskState';
import { TaskState } from 'project.txt';
<template>
  <animated-group :x="left" :y="top">
    <g
      :class="{done:isDone, on_hold: isOnHold, in_progress: isInProgress, blocked: isBlocked, is_milestone: isMilestone}"
      v-on:dblclick="selectTaskInEditor"
    >
      <rect class="node-background"
            rx="5"
            ry="5"
            :width="width"
            :height="height">
      </rect>
      <g :transform="centerTransform">
        <text text-anchor="middle"
              class="node-label"
              v-for="(line, index) in wrappedText"
              :y="((-wrappedText.length/2) + 0.5 + (index)) + 'em'"
              :key="line"
        >
          {{line}}
        </text>
      </g>
      <!-- Task effort   -->
      <g v-if="effort"
         :transform="`translate(${width/2+10},${height-height/5 + 10})`"
      >
        <rect class="duration-background"
              :width="width/2" :height="height/5"
              rx="5"
              ry="5"
        >
        </rect>
        <g :transform="`translate(${width/4},${height/5/2})`">
          <text text-anchor="middle"
                class="duration-label"
                y="0.4em">
            {{effort}}
          </text>
        </g>
      </g>

      <!-- Finish date -->
      <g v-if="!isDone"
         :transform="`translate(${-10},${height-height/5 + 10})`"
      >
        <rect :class="{'duration-background': true, is_overdue: isOverdue }"
              :width="width/2" :height="height/5"
              rx="5"
              ry="5"
        >
        </rect>
        <g :transform="`translate(${width/4},${height/5/2})`">
          <text text-anchor="middle"
                :class="{ 'duration-label':true, is_unknown: finishDateIsUnknown, is_overdue: isOverdue }"
                y="0.4em">
            {{finishDate}}
            <title>{{finishDateHint}}</title>
          </text>
        </g>
      </g>
      <!-- Gravatar icons for all assigned people  -->
      <g
        v-for="(assignment,index) in assignments.slice().reverse()"
        :key="assignment.emailAddress"
        :transform="`translate(${-50 + (assignments.length - index) * 25},-25)`"
      >
        <gravatar
          :name="assignment.name"
          :email="assignment.emailAddress"
          :size="50"
        >
        </gravatar>
      </g>
    </g>
  </animated-group>
</template>

<!--suppress SassScssResolvedByNameOnly -->
<style lang="scss">
  rect.node-background, rect.duration-background {
    fill: $blue;
    stroke: #0000002f;
    stroke-width: 2px;
  }

  rect.duration-background.is_overdue {
    fill: $red !important;
  }

  text.duration-label.is_overdue {
    fill: white !important;
  }

  text.node-label, text.duration-label {
    fill: white;
  }

  text.node-label {
    font-family: 'Open Sans Condensed', "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1.5em;
  }

  text.duration-label {
    font-size: 0.85em;
    font-family: 'Open Sans', "Helvetica Neue", Helvetica, Arial, sans-serif;
  }

  text.duration-label.is_unknown {
    font-style: italic;
  }

  .in_progress {
    rect.node-background, rect.duration-background {
      fill: $yellow;
    }

    text.node-label, text.duration-label {
      fill: black;
    }
  }

  .blocked {
    rect.node-background, rect.duration-background {
      fill: $grey-4;
    }

    text.node-label, text.duration-label {
      fill: black;
    }
  }

  .done {
    rect.node-background, rect.duration-background {
      fill: $green;
    }
  }

  .on_hold {
    rect.node-background, rect.duration-background {
      fill: $red;
    }

  }

  .is_milestone {
    rect.node-background {
      stroke-width: 8px;
      stroke-dasharray: 5;
    }
  }


</style>

<script lang="ts">
import {Prop, Vue} from 'vue-property-decorator';
import Component from 'vue-class-component';
import {Node} from 'dagre';
import {NodeRadius} from '../Constants';
import {FinishDate, Person, Task, TaskState} from 'project.txt';
import Gravatar from './Gravatar.vue';
import lightFormat from 'date-fns/lightFormat';
import {EventBus} from '../EventBus';
import {EffectiveTaskState} from 'project.txt/src/main/EffectiveTaskState';
import {formatDistance, isSameDay, startOfDay} from 'date-fns';
import AnimatedGroup from './AnimatedGroup.vue';

@Component({
  components: {AnimatedGroup, Gravatar}
})
export default class TaskNode extends Vue {
  @Prop({default: null, required: true})
  private node!: Node;

  get wrappedText(): string[] {
    const label = this.task.title as string;
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

  get finishDateIsUnknown(): boolean {
    return (this.node.finishDate as FinishDate).hasUnknowns;
  }

  get isOverdue() : boolean {
    return (this.node.finishDate as FinishDate).cannotFinishInTime;
  }

  get finishDateHint(): string {
    const baseDate = startOfDay(new Date());
    const finishDate = startOfDay((this.node.finishDate as FinishDate).date);

    let text = '';

    if (isSameDay(baseDate, finishDate)) {
      text = 'today';
    }
    else {
      text = formatDistance(finishDate, baseDate, {
        addSuffix: true
      });
    }

    if (this.isOverdue) {
      // when task is overdue it MUST have a due date set.
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      text += ' - will finish after due date of ' + lightFormat(this.task.dueDate!, 'yyyy-MM-dd');
    }

    return text;
  }

  get finishDate(): string {
    const finishDate = (this.node.finishDate as FinishDate);
    return lightFormat(finishDate.date, 'yyyy-MM-dd');
  }

  get task(): Task {
    return this.node.task;
  }

  get effectiveState(): EffectiveTaskState {
    return this.node.effectiveState;
  }

  get isBlocked() {
    return this.effectiveState === EffectiveTaskState.Blocked;
  }

  get isDone() {
    return this.effectiveState === EffectiveTaskState.Done;
  }

  get isOnHold() {
    return this.effectiveState === EffectiveTaskState.OnHold;
  }

  get isInProgress() {
    return this.effectiveState === EffectiveTaskState.InProgress;
  }

  get isMilestone() {
    return this.task.state === TaskState.Milestone;
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

  get effort(): string | undefined {
    if (!this.task.effort) {
      return undefined;
    }

    const days = this.task.effort.days;
    const hours = this.task.effort.hours;
    const minutes = this.task.effort.minutes;
    return `${days ? days + 'd' : ''}${hours ? hours + 'h' : ''}${minutes ? minutes + 'm' : ''}`;
  }

  selectTaskInEditor() {
    EventBus.$emit('select-task', this.task.lineNumber);
  }
}
</script>

