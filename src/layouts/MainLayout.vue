<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="sidebarVisible = !sidebarVisible"
        >
        </q-btn>

        <q-toolbar-title>
          Project.txt Viewer
        </q-toolbar-title>
        <div>
          <q-btn-toggle
            v-model="viewMode"
            push
            rounded
            toggle-color="light-blue"
            :options="[
          {value: 0, slot: 'text'},
          {value: 1 , slot: 'split'},
          {value: 2,  slot: 'graph'}
        ]"
          >
            <template v-slot:text>
              <q-icon name="subject"/>
            </template>

            <template v-slot:split>
              <q-icon name="vertical_split"/>
            </template>

            <template v-slot:graph>
              <q-icon name="visibility"/>
            </template>
          </q-btn-toggle>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="sidebarVisible"
      show-if-above
      bordered
      content-class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list>
          <q-item-label
            header
            class="text-grey-8"
          >
            Load & Save
          </q-item-label>
          <input
            type="file"
            style="display: none"
            ref="fileInput"
            @change="loadFile"
          >

          <q-item clickable @click="triggerOpenFile">
            <q-item-section avatar>
              <q-icon name="unarchive"/>
            </q-item-section>
            <q-item-section>
              Open file
            </q-item-section>
          </q-item>
          <q-item clickable @click="saveFile">
            <q-item-section avatar>
              <q-icon name="save"/>
            </q-item-section>
            <q-item-section>
              Save file
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="column">
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {getModule} from 'vuex-module-decorators';
import AppStateStoreModule from '../store/AppStateStoreModule';
import {ViewMode} from '../store/ViewMode';
import ProjectStoreModule from '../store/ProjectStoreModule';
import {saveAs} from "file-saver";
import file from "quasar/src/mixins/file";

@Component({
  components: {}
})
export default class MainLayout extends Vue {

  appState = getModule(AppStateStoreModule);
  projectState = getModule(ProjectStoreModule);

  get sidebarVisible() {
    return this.appState.sidebarVisible;
  }

  set sidebarVisible(value: boolean) {
    this.appState.setSidebarVisible(value);
  }

  get viewMode() {
    return this.appState.viewMode;
  }

  set viewMode(newMode: ViewMode) {
    this.appState.setViewMode(newMode);
  }


  triggerOpenFile() {
    (this.$refs.fileInput as HTMLInputElement).click();
  }

  loadFile() {
    const input = this.$refs.fileInput as HTMLInputElement;

    if (!input.files || input.files.length != 1) {
      return;
    }
    const reader = new FileReader();
    const toRead = input.files[0];

    reader.onload = event => {
      if (event.target) {
        this.projectState.setFilename(toRead.name);
        this.projectState.setProjectSource(event.target.result as string);
        this.projectState.parseProjectFromSource();
      }
    };
    reader.readAsText(toRead);
  }

  saveFile() {
    const text = this.projectState.projectSource;
    const blob = new Blob([text], {
      type: 'text/plain;charset=utf-8'
    });
    let filename = 'project.txt';
    if  (this.projectState.fileName.length > 0) {
      filename = this.projectState.fileName;
    }
    saveAs(blob, filename);
  }
}
</script>
