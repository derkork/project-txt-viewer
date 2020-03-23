import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Store from './index';
import {calculateDependencies, parse, Project, ProjectDependencies, ProjectCalculationSettings} from 'project.txt';

@Module({
  dynamic: true,
  name: 'project',
  namespaced: true,
  store: Store
})
export default class ProjectStoreModule extends VuexModule {
  public project: Project | null = null;
  public dependencies: ProjectDependencies | null = null;
  public projectSource: string = '';
  public fileName:string = '';

  @Mutation
  private UPDATE_PROJECT(project: Project) {
    this.project = project;
  }

  @Mutation
  private UPDATE_PROJECT_SOURCE(projectSource: string) {
    this.projectSource = projectSource;
  }

  @Mutation
  private UPDATE_DEPENDENCIES(dependencies: ProjectDependencies) {
    this.dependencies = dependencies;
  }

  @Mutation
  private UPDATE_FILENAME(fileName:string) {
    this.fileName = fileName;
  }

  @Action
  public setFilename(fileName:string) {
    this.UPDATE_FILENAME(fileName);
  }

  @Action
  public setProjectSource(projectSource: string) {
    this.UPDATE_PROJECT_SOURCE(projectSource);
  }

  @Action
  public parseProjectFromSource() {
    const projectDefinition = this.projectSource;
    const project = parse(projectDefinition.toString()).project;
    const dependencies = calculateDependencies(project, ProjectCalculationSettings.default());
    this.UPDATE_PROJECT(project);
    this.UPDATE_DEPENDENCIES(dependencies);
  }

  // @Action
  // public updateSimulation() {
  //   if (this.simulation) {
  //     this.simulation.tick();
  //     this.UPDATE_SIMULATION(this.simulation);
  //   }
  // }
}
