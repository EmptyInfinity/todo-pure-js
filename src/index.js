require('./assets/style.scss');
require('./assets/media.scss');

let q = document.querySelector.bind(document);
let qa = document.querySelectorAll.bind(document);

let id = 0, todos = [], form = q('form'),
    cont = q('#container'), input = q('#task'),
    warn = q('#warn'), name = q('#name'),
    date = q('#date'), sortName = q('#sortByName'),
    sortDate = q('#sortByDate');

window.onload = () => {
    let todosLS = JSON.parse(localStorage.getItem('todos'));
    if (todosLS) {
        todosLS.forEach(todo=>todos.push(todo)),
        id = todosLS.length,
        render(todosLS),
        toLS(todosLS)
    }   
}

let today = new Date();
let dd = String(today.getDate()).padStart(2, '0');
let mm = String(today.getMonth() + 1).padStart(2, '0');
let yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
date.setAttribute("min", today);
date.value = today;

class Task {
    constructor(value, id, date, name, status) {
        this.value = value;
        this.id = id;
        this.date = date;
        this.name = name;
        this.status = status || 'soon';
    }
}

form.addEventListener("submit", () => {
    event.preventDefault();
    let value = input.value.replace(/\s/g, '');

    if (value.length <= 2) {
        warn.classList.add('open');
        warn.innerHTML = 'task shoud have at least 3 symbols!';
    } else if (!isNaN(name.value)) {
        warn.classList.add('open');
        warn.innerHTML = 'name must me a text!';
    } else {
        warn.innerHTML = '';
        warn.classList.remove('open');
        let newTask = new Task(input.value, id, date.value, name.value, status);
        todos.push(newTask);
        render(todos);
        toLS(todos);
        id++;
        input.value = '';
    }
})


let toLS = (todos) => {
    localStorage.removeItem('todos');
    localStorage.setItem('todos', JSON.stringify(todos));
}
let render = (todos) => {
    let todosList = `${todos.map((todo, i) => `
          <div class="item" id=${todo.id}>
            <div class="description-node">
            <span class="desc">${todo.name} (${todo.date})</span>
            <div>
                <span ${todo.status === 'soon' ? 'class="selected"' : ''}>soon</span>
                <span ${todo.status === 'executing' ? 'class="selected"' : ''}>executing</span>
                <span ${todo.status === 'done' ? 'class="selected"' : ''}>done</span>
            </div>
            </div>
            <div class="content">
                <span>${todo.value}</span>
                <div class="delete"></div>
                <div class="edit"></div>
            </div>
            <span class="counter">${i+1}</span>
          </div>
          </div>
        `).join('')}`;
    items.innerHTML = todosList;
}

cont.addEventListener('click', (e) => {
    let item = e.path[2];

    if (e.target.classList.value === 'delete') {
        todos.splice(item.id, 1);
        for (let i = 0; i < todos.length; i++) {
            todos[i].id = i;
        }
        qa('.item').forEach(item=>item.remove());
        render(todos);
        toLS(todos);
        item.remove();
        id--;
        let items = qa('.item');
        for (let i = 0; i < todos.length; i++) {
            items[i].id = i;
        }
    } else if (e.target.classList.contains('edit') && !q('.edit-input')) {
        if (e.path[2].children[0].children[0].children[2].classList.contains('selected')) return;
        let textNode = item.children[1].children[0];
        let input = document.createElement('input');
        input.autofocus = "autofocus";
        input.setAttribute("type", "text");
        input.value = textNode.innerHTML;
        textNode.innerHTML = '';
        input.classList.add('edit-input');

        let submit = document.createElement('div');
        submit.classList.add('edit-submit');
        item.children[1].appendChild(input);
        item.children[1].appendChild(submit);
    } else if (e.target.classList.value === 'edit-submit') {
        let input = q('.edit-input');
        let edited = input.value;
        e.path[1].children[0].innerHTML = edited;
        todos[e.path[2].id].value = edited;
        e.path[1].children[2].classList.add('edited');
        toLS(todos);
        q('.edit-submit').remove();
        input.remove();
    } else if (e.target.innerHTML === 'soon' || e.target.innerHTML === 'executing' || e.target.innerHTML === 'done') {
        for (let i = 0; i < e.target.parentNode.children.length; i++) {
            e.target.parentNode.children[i].classList.remove('selected')
        }
        todos[e.path[1].parentNode.parentNode.id].status = e.target.innerHTML;
        e.target.classList.add('selected');
        toLS(todos);
    }
})

sortDate.addEventListener('click', () => {
    todos.sort((a, b) => new Date(a.date) - new Date(b.date));
    qa('.item').forEach(el => el.remove());
    render(todos)
    toLS(todos);
})

sortName.addEventListener('click', () => {
    todos.sort(function (a, b) {
        let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
    qa('.item').forEach(el => el.remove());

    render(todos);
    toLS(todos);
})