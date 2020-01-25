import SearchModel from "./model";
import { generateCard, debounced } from "../util";

export default class SearchView {
  private result: HTMLInputElement;

  private moreButton: HTMLButtonElement;

  private count: HTMLSpanElement;

  private queryEl: HTMLFormElement;

  private model: SearchModel;

  private errorEl: HTMLDivElement;

  constructor(model: SearchModel) {
    this.model = model;
    this.queryEl = document.getElementById("query") as HTMLFormElement;
    this.result = document.getElementById("result")! as HTMLInputElement;
    this.count = document.getElementById("count")!;
    this.moreButton = document.getElementById("more")! as HTMLButtonElement;
    this.errorEl = document.getElementById("error")! as HTMLDivElement;

    this.handleEvent();
  }

  handleEvent(): void {
    const moreHandler = (event: KeyboardEvent): void => {
      this.model.addMore();
    };
    const debouncedShowMore = debounced(400, moreHandler);
    this.moreButton.onclick = debouncedShowMore;

    const searchHandler = (event: KeyboardEvent): void => {
      const query = (event.target as HTMLInputElement).value;
      this.model.setQuery(query);
    };
    const debouncedSearch = debounced(200, searchHandler);
    this.queryEl.onkeyup = debouncedSearch;

    this.model.addObserver("success", () => {
      this.removeCard();
      this.showCard();
      this.handleMoreButton();
      this.hideError();
    });

    this.model.addObserver("fail", () => {
      this.showError();
    });
  }

  showCard(): void {
    this.model.repositories.forEach((repository: Repository) => {
      const node = generateCard(repository);
      const parent = this.result.querySelector("ul");
      if (parent) {
        parent.appendChild(node);
      }
    });
  }

  removeCard(): void {
    const parent = this.result.querySelector("ul");
    if (parent) {
      while (parent!.lastChild) {
        parent.removeChild(parent?.lastChild);
      }
    }
  }

  showError(): void {
    this.errorEl.style.display = "inline-block";
    this.errorEl.querySelector(
      "#error-message"
    )!.innerHTML = this.model.errorMessage;
  }

  hideError(): void {
    this.errorEl.style.display = "none";
  }

  handleMoreButton(): void {
    const total = this.model.getTotalAccount();
    if (total > this.model.repositories.length) {
      this.switchButton("show");
    } else {
      this.switchButton("hide");
    }
  }

  switchButton(state: string): void {
    this.moreButton.style.display = state === "hide" ? "none" : "inline-block";
  }
}
