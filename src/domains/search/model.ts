import axios from 'axios';
import EventDispatcher from '../eventDispatcher';
import { formatDescription } from '../util';

const BASE_URL = 'https://api.github.com/search/repositories';

export default class SearchModel extends EventDispatcher {
  public repositories: Repository[];

  private totalCount: number;

  private nextPage: number;

  private perPage: number;

  private query: string;

  public errorMessage: string;

  constructor() {
    super();
    this.query = '';
    this.repositories = [];
    this.totalCount = 0;
    this.nextPage = 1;
    this.perPage = 10;
    this.errorMessage = '';
  }

  setQuery(query: string): void {
    if (this.query === query) return;
    this.query = query;
    this.searchGithub();
  }

  getTotalAccount(): number {
    return this.totalCount;
  }

  getPerPage(): number {
    return this.perPage;
  }

  pageIncrement(): void {
    this.nextPage++;
  }

  init(): void {
    this.repositories = [];
    this.totalCount = 0;
    this.nextPage = 1;
  }

  async searchGithub(): Promise<void> {
    try {
      this.init();
      if (!this.query) return;

      const { data } = await axios.get(
        `${BASE_URL}?q=${this.query}&sort=stars&order=desc&?&per_page=${this.perPage}&page=${this.nextPage}`
      );
      this.repositories = data.items.map((item: Repository) => ({
        html_url: item.html_url,
        stargazers_count: item.stargazers_count,
        forks_count: item.forks_count,
        watchers_count: item.watchers_count,
        full_name: item.full_name,
        name: item.name,
        description: formatDescription(item.description),
        owner: {
          avatar_url: item.owner.avatar_url,
        },
      }));
      this.totalCount = data.total_count;
      this.pageIncrement();
      this.dispatchEvent({ type: 'success', task: this.query });
    } catch (e) {
      this.handleError(e);
      this.dispatchEvent({ type: 'fail' });
    }
  }

  async addMore(): Promise<void> {
    try {
      if (!this.query) return;
      const { data } = await axios.get(
        `${BASE_URL}?q=${this.query}&sort=stars&order=desc&?&per_page=${this.perPage}&page=${this.nextPage}`
      );
      this.pageIncrement();
      this.repositories = [...this.repositories, ...data.items];
      this.dispatchEvent({ type: 'success', task: this.query });
    } catch (e) {
      this.handleError(e);
      this.dispatchEvent({ type: 'fail' });
    }
  }

  handleError(e: any): void {
    if (e.config && e.response && e.response.status === 403) {
      this.errorMessage = 'API 取得の上限に達しました。しばらくたってから再度おためしください。';
    } else if (e.config && e.response && e.response.status === 422) {
      this.errorMessage = '不正な文字列です';
    } else if (e.config && e.response && e.response.status) {
      this.errorMessage = e.response.data.message;
    } else {
      this.errorMessage = 'エラーが発生しました。';
    }
  }
}
