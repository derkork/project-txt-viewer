import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Store from './index';
import {ViewMode} from './ViewMode';

@Module({
  dynamic: true,
  name: 'app-state',
  namespaced: true,
  store: Store
})
export default class AppStateStoreModule extends VuexModule {
  public sidebarVisible:boolean = false;
  public viewMode:ViewMode = ViewMode.Split;

  @Mutation
  public UPDATE_SIDEBAR_VISIBILITY(sidebarVisible:boolean) {
    this.sidebarVisible = sidebarVisible;
  }

  @Mutation
  public UPDATE_VIEW_MODE(viewMode:ViewMode) {
    this.viewMode = viewMode;
  }

  @Action
  setViewMode(newMode: ViewMode) {
    this.UPDATE_VIEW_MODE(newMode);
  }

  @Action
  public setSidebarVisible(value: boolean) {
    this.UPDATE_SIDEBAR_VISIBILITY(value);
  }
}
