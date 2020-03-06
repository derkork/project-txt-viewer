import {Action, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import Store from './index';
import {GraphEdge, graphlib, Node} from 'dagre';
import {calculateDependencies, parse, Project, ProjectDependencies} from 'project.txt';
import * as dagre from 'dagre';

@Module({
  dynamic: true,
  name: 'main',
  namespaced: true,
  store: Store
})
export default class MainStoreModule extends VuexModule {
  public edges: GraphEdge[] = [];
  public nodes: Node[] = [];
  public project: Project | null = null;
  public dependencies: ProjectDependencies | null = null;


  @Mutation
  public UPDATE_EDGES(edges: GraphEdge[]) {
    this.edges = edges;
  }

  @Mutation
  public UPDATE_NODES(nodes: Node[]) {
    this.nodes = nodes;
  }

  @Mutation
  public UPDATE_PROJECT(project: Project) {
    this.project = project;
  }

  @Mutation
  public UPDATE_DEPENDENCIES(dependencies: ProjectDependencies) {
    this.dependencies = dependencies;
  }

  @Action
  public loadProject(projectDefinition: string) {
    const project = parse(projectDefinition).project;
    const dependencies = calculateDependencies(project);

    const graph = new graphlib.Graph()
      .setGraph({})
      .setDefaultEdgeLabel(function () {
        return {};
      });

    for (const task of project.tasks) {
      graph.setNode(task.uid, {
        label: task.title,
        class: 'task',
        task: task,
        rx: 5,
        ry: 5
      });
      const prerequisites = dependencies.getPrerequisites(task);
      for (const prerequisite of prerequisites) {
        graph.setEdge(prerequisite.uid, task.uid);
      }
    }

    dagre.layout(graph);

    const nodes = graph.nodes().map((it) => graph.node(it));
    const edges = graph.edges().map((it) => graph.edge(it));

    this.UPDATE_PROJECT(project);
    this.UPDATE_DEPENDENCIES(dependencies);
    this.UPDATE_NODES(nodes);
    this.UPDATE_EDGES(edges);
  }
}
