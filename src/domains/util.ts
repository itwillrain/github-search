// ES6
export function debounced(delay: number, fn: Function): () => void {
  let timerId: NodeJS.Timeout | null;
  return (...args: any[]): void => {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(() => {
      fn(...args);
      timerId = null;
    }, delay);
  };
}

export function formatDescription(text: string, limit = 200): string {
  const outPut = text ? text.substr(0, limit) : '';
  const suffix = '…';
  if (text && text.length > limit) {
    return outPut.concat(suffix);
  }
  return outPut;
}

export function generateCard(repository: Repository): HTMLElement {
  const node = document.createElement('li');
  node.className = 'item m-4';

  const a = document.createElement('a');
  a.setAttribute('href', repository.html_url);
  node.appendChild(a);

  const card = document.createElement('div');
  card.className = 'md:flex bg-white rounded-lg p-6';
  a.appendChild(card);

  const avator = document.createElement('img');
  avator.setAttribute('src', repository.owner.avatar_url);
  avator.className = 'h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 md:mr-6';
  card.appendChild(avator);

  const userInfo = document.createElement('div');

  const property = document.createElement('div');
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

  const userName = document.createElement('div');
  userName.className = 'text-purple-500';
  userName.textContent = repository.name;

  const description = document.createElement('div');
  description.textContent = repository.description;

  card.appendChild(userInfo);
  userInfo.appendChild(property);
  userInfo.appendChild(repositoryName);
  userInfo.appendChild(userName);
  userInfo.appendChild(description);

  return node;
}
