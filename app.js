const STORAGE_KEY = 'todo-app-items';

let todos = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentFilter = 'all';

const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const footer = document.getElementById('footer');
const countEl = document.getElementById('count');
const clearBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function render() {
  const filtered = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.done;
    if (currentFilter === 'completed') return todo.done;
    return true;
  });

  list.innerHTML = '';
  filtered.forEach(todo => {
    const li = document.createElement('li');
    li.className = 'todo-item' + (todo.done ? ' completed' : '');

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = todo.done;
    cb.addEventListener('change', () => toggleTodo(todo.id));

    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = todo.text;

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = '\u00d7';
    del.addEventListener('click', () => deleteTodo(todo.id));

    li.append(cb, span, del);
    list.appendChild(li);
  });

  const activeCount = todos.filter(t => !t.done).length;
  countEl.textContent = `${activeCount} 件の未完了タスク`;
  footer.className = todos.length ? 'footer' : 'footer hidden';
}

function addTodo(text) {
  todos.push({ id: Date.now(), text, done: false });
  save();
  render();
}

function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  if (todo) todo.done = !todo.done;
  save();
  render();
}

function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;
  addTodo(text);
  input.value = '';
  input.focus();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    render();
  });
});

clearBtn.addEventListener('click', () => {
  todos = todos.filter(t => !t.done);
  save();
  render();
});

render();
