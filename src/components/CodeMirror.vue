<template>
  <div class="col column">
    <textarea ref="textarea"></textarea>
  </div>
</template>

<style lang="sass">
  .CodeMirror
    position: absolute
    font-family: 'JetBrains Mono', sans-serif !important
</style>

<script lang="ts">
import 'codemirror/lib/codemirror.css';
import Vue from 'vue';
import Component from 'vue-class-component';

import {Prop, Watch} from 'vue-property-decorator';
import {EditorConfiguration, EditorFromTextArea, fromTextArea} from 'codemirror';
import 'codemirror/addon/selection/active-line';

@Component({})
export default class CodeMirror extends Vue {
  @Prop()
  value!: string;

  @Prop()
  options!: EditorConfiguration;

  /**
   * Helper flag to avoid endless recursion when updating the value
   * of the text editor from outside.
   */
  skipNextChangeEvent: boolean = false;

  editor!: EditorFromTextArea;

  mounted() {
    this.editor = fromTextArea(this.$refs.textarea as HTMLTextAreaElement, this.options);
    this.editor.setSize('100%', '100%');
    this.editor.setValue(this.value);
    this.editor.on('change', (cm) => {
      if (this.skipNextChangeEvent) {
        this.skipNextChangeEvent = false;
        return;
      }

      this.$emit('change', cm.getValue());
      this.$emit('input', cm.getValue());
    });
  }

  @Watch('value')
  onValueChange(newValue: string) {
    const editorValue = this.editor.getValue();
    if (newValue !== editorValue) {
      this.skipNextChangeEvent = true;
      const scrollInfo = this.editor.getScrollInfo();
      this.editor.setValue(newValue);
      this.editor.scrollTo(scrollInfo.left, scrollInfo.top);
    }
  }


  @Watch('options')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOptionsChange(newValue: any) {
    if (newValue) {
      for (const item in newValue) {
        if (Object.prototype.hasOwnProperty.call(newValue, item)) {
          this.editor.setOption(item as keyof EditorConfiguration, newValue[item]);
        }
      }
    }
  }

  public setCursorToLine(newValue:number) {
    this.editor.setCursor(newValue-1, 0, {scroll: true});
    this.editor.focus();
  }

}
</script>
