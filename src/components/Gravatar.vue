<template>
  <g>
    <circle :r="size/2" fill="#cccccc" :cx="size/2" :cy="size/2"></circle>
    <clipPath :id="uid">
      <circle :cx="size/2" :cy="size/2" :r="size/2 - 2" fill="#FFFFFF"/>
    </clipPath>
    <image :width="size" :height="size" :xlink:href="url" :clip-path="`url(#${uid})`"/>
    <title v-if="name.length">{{name}}</title>
  </g>
</template>

<script lang="ts">
import Component from 'vue-class-component';
import TaskPath from './TaskPath.vue';
import TaskNode from './TaskNode.vue';
import Vue from 'vue';
import {Prop} from 'vue-property-decorator';
import {Md5} from 'ts-md5';
import {uid} from 'quasar';


@Component({
  components: {TaskPath, TaskNode}
})
export default class Gravatar extends Vue {
  @Prop( {default:''})
  name!:string;

  @Prop({default: ''})
  email!: string;

  @Prop({default: 80})
  size!: number;

  get uid() {
    return uid();
  }


  get url() {
    const hash = Md5.hashStr(this.email);
    return `https://www.gravatar.com/avatar/${hash}?d=robohash&s=${this.size}`;
  }

}
</script>
