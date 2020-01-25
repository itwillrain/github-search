interface Repository {
  id: string;
  star: number;
  fork: number;
  description: string;
}

class SearchModel {
  repositories: Repository[];
  constructor() {
    this.repositories = [];
  }
  setRepositories(repositories: Repository[]) {
    this.repositories = repositories;
  }
  deleteRepositories(){
    this.repositories = [];
  } 
}

class SearchView {
  constructor() {}
}

class Controller {
  model: SearchModel;
  view: SearchView;
  constructor(model: SearchModel, view: SearchView) {
    this.model = model;
    this.view =view;
  }
}

const app = new Controller(new SearchModel(), new SearchView())