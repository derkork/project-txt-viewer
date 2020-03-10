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
          @click="toggleSidebar"
        />

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
                <q-icon name="subject" />
            </template>

            <template v-slot:split>
              <q-icon name="vertical_split" />
            </template>

            <template v-slot:graph>
              <q-icon name="visibility" />
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
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Options
        </q-item-label>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {getModule} from 'vuex-module-decorators';
import AppStateStoreModule from '../store/AppStateStoreModule';
import {ViewMode} from "../store/ViewMode";

@Component({
  components: {}
})
export default class MainLayout extends Vue {

  appState = getModule(AppStateStoreModule)

  get sidebarVisible() {
    return this.appState.sidebarVisible;
  }

  get viewMode() {
    return this.appState.viewMode;
  }

  set viewMode(newMode:ViewMode) {
    this.appState.setViewMode(newMode);
  }

  toggleSidebar() {
    this.appState.toggleSidebarVisibility();
  }
}
</script>
