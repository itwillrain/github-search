import SearchModel from "./domains/search/model";
import SearchView from "./domains/search/view";

class App {
  constructor() {
    const model = new SearchModel();
    const view = new SearchView(model);
  }
}

window.onload = (): void => {
  const app = new App();
};
