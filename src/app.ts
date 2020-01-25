import  axios from 'axios'
import { debounce, debounced } from './domains/util';

const result = document.getElementById('result');
const BASE_URL = 'https://api.github.com/search/repositories';
const thresHold = 200; 
const perPage = 2;
let page = 1;


class PageModel {
  public currentPage: number;
  public perPage: number;
  public repositiories: any[] 
  public _query: string;

  constructor() {
    this.currentPage = 1;
    this.perPage = 2;
    this.repositiories = [];
    this._query = '';
  }

  get hasMore() {
    if(this.repositiories.length > 0) {
      return  false;
    } else {
      return true;
    }
  }

  set query(query: string) {
    this._query = query;
  }

  get query() {
    return this._query;
  }
}

class PageView {
  el: HTMLElement | null;
  page: PageModel;
  constructor(el: string) {
    this.el =  document.getElementById(el);
    this.page = new PageModel()
    this.handleEvents();
  }

  handleEvents() {
    const handler = (event: KeyboardEvent) => { this.onKeyup(event)};
    const debouncedHandler = debounced(thresHold, handler);
    this.el!.addEventListener('keyup', debouncedHandler);
  }

  async onKeyup(event: KeyboardEvent): Promise<void> {
    const _target: any = event.target;
    this.page.query = (_target.value);
    await this.searchRepositories();
  }

  async searchRepositories(): Promise<void>{
    try {
      const {data} = await axios.get(`${BASE_URL}?q=${this.page.query}&sort=stars&order=desc&?&per_page=${this.page.perPage}&page=${this.page.currentPage}`);
      console.log({data}, {page});
      this.page.repositiories = data.items;
      this.page.repositiories.map((item: any) => {
        this.createView(item);
      })
    } catch (e) {
      console.dir(e);
    }
  }

  createView(repository: any) {
    console.log(this);
    const node = document.createElement('li')
      node.className = 'item m-4';
    
      const a = document.createElement('a');
      a.setAttribute('href', repository.html_url);
      node.appendChild(a);
    
      const card = document.createElement('div');
      card.className = 'md:flex bg-white rounded-lg p-6';
      a.appendChild(card)
    
      const avator = document.createElement('img');
      avator.setAttribute('src', repository.owner.avatar_url);
      avator.className = 'h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6';
      card.appendChild(avator);
    
      const userInfo = document.createElement('div');
    
      const property = document.createElement('div')
      property.className = 'property';
     
      const star = document.createElement('span');
      star.className = 'text-gray-600 mr-5 star';
      star.innerHTML = `<i class="fas fa-star ml2">${repository.stargazers_count}</i>`;
    
      const fork = document.createElement('span');
      fork.className = 'text-gray-600 mr-5 folk';
      fork.innerHTML = `<i class="fas fa-utensils pl-2">${repository.forks_count}</i>`;
    
      const view = document.createElement('span');
      view.className = 'text-gray-600 mr-5 view';
      view.innerHTML = `<i class="fas fa-eye pl-2">${repository.watchers_count}</i>`;
    
      property.appendChild(star);
      property.appendChild(fork);
      property.appendChild(view);
    
      const repositoryName = document.createElement('h2');
      repositoryName.className = 'text-center md:text-left';
      repositoryName.textContent = repository.full_name;
    
      const  userName = document.createElement('div');
      userName.className = 'text-purple-500';
      userName.textContent = repository.name;
    
    
      const description = document.createElement('div')
      description.textContent = repository.description;
    
      card.appendChild(userInfo);
      userInfo.appendChild(property);
      userInfo.appendChild(repositoryName);
      userInfo.appendChild(userName);
      userInfo.appendChild(description);
    
      result!.querySelector('ul')!.appendChild(node);
  }
}

const pageView = new PageView('query');


console.log(pageView)


// const searchEl = Array.from(document.forms).find((e) => e.name === 'search-repositories')
// searchEl!.addEventListener('keyup', debounce(async () =>{
//   initView()
//   page = 1
//   await fetchRepositories()
// }, thresHold))


// const moreEl = document.getElementById('more');
// moreEl!.addEventListener('click',  async() => {
//   page += 1;
//   await fetchRepositories()
// })


// /**
//  *  再検索用
//  */
// function initView(): void {
//   const items = result!.getElementsByTagName('li');
//   const error = document.getElementById('error');
//   if(items.length > 0) {
//     Array.from(items).forEach(e => e.parentNode!.removeChild(e));
//   }
//   error!.classList.remove('block');
//   error!.classList.add('hidden');
// }

// /**
//  *  API CALL
//  */
// async function fetchRepositories(): Promise<void> {
//    try {
//       const query = getQuery();
//       if(query) {
//         const {data} = await axios.get(`${BASE_URL}?q=${query}&sort=stars&order=desc&?&per_page=${perPage}&page=${page}`);
//         console.log({data}, {page});
//         data.items.map((item: any) => {
//           createView(item);
//         })
//       }
    
//    } catch (e) {
//      console.dir(e);
//      showErrorMessage(e.response.data.message);

//   }
// }

// /**
//  *  エラーメッセージ表示
//  * @param errorMessage 
//  */
// function showErrorMessage(errorMessage: string) {
//   const error = document.getElementById('error');
//   error!.textContent = errorMessage;
//   error!.classList.remove('hidden');
//   error!.classList.add('block');
// }


// /**
//  *  CardのVIEWを作成
//  * @param repository 
//  */
// function createView(repository: any): void {
//   const node = document.createElement('li')
//   node.className = 'item m-4';

//   const a = document.createElement('a');
//   a.setAttribute('href', repository.html_url);
//   node.appendChild(a);

//   const card = document.createElement('div');
//   card.className = 'md:flex bg-white rounded-lg p-6';
//   a.appendChild(card)

//   const avator = document.createElement('img');
//   avator.setAttribute('src', repository.owner.avatar_url);
//   avator.className = 'h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6';
//   card.appendChild(avator);

//   const userInfo = document.createElement('div');

//   const property = document.createElement('div')
//   property.className = 'property';
 
//   const star = document.createElement('span');
//   star.className = 'text-gray-600 mr-5 star';
//   star.innerHTML = `<i class="fas fa-star ml2">${repository.stargazers_count}</i>`;

//   const fork = document.createElement('span');
//   fork.className = 'text-gray-600 mr-5 folk';
//   fork.innerHTML = `<i class="fas fa-utensils pl-2">${repository.forks_count}</i>`;

//   const view = document.createElement('span');
//   view.className = 'text-gray-600 mr-5 view';
//   view.innerHTML = `<i class="fas fa-eye pl-2">${repository.watchers_count}</i>`;

//   property.appendChild(star);
//   property.appendChild(fork);
//   property.appendChild(view);

//   const repositoryName = document.createElement('h2');
//   repositoryName.className = 'text-center md:text-left';
//   repositoryName.textContent = repository.full_name;

//   const  userName = document.createElement('div');
//   userName.className = 'text-purple-500';
//   userName.textContent = repository.name;


//   const description = document.createElement('div')
//   description.textContent = repository.description;

//   card.appendChild(userInfo);
//   userInfo.appendChild(property);
//   userInfo.appendChild(repositoryName);
//   userInfo.appendChild(userName);
//   userInfo.appendChild(description);

//   result!.querySelector('ul')!.appendChild(node);
// }

// /**
//  *  検索ワード取得
//  */
// function getQuery(): string {
// const el: HTMLInputElement = <HTMLInputElement>document.getElementById('query');
//   if(el) {
//     const val = encodeURIComponent(el.value);
//     return val
//   } else {
//     return '';
//   }
// }
