require('./assets/style.scss');

let q = document.querySelector.bind(document);
let qa = document.querySelectorAll.bind(document);

let id;
window.onload = () => {
    let todos = JSON.parse(localStorage.getItem('todos'));
    todos ? id = todos.length : id = 0;

    for (let item in todos) {
        // if (todos[item].value){
        renderItem(todos[item].value, todos[item].id, todos[item].date, todos[item].name, todos[item].status);
        toLS(todos[item].value, todos[item].id, todos[item].date, todos[item].name);
        // }
    }
}


let form = q('form');
let cont = q('#container');
let input = q('#task');
let warn = q('#warn');
let name = q('#name');
let date = q('#date');
let sortName = q('#sortByName');
let sortDate = q('#sortByDate');

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = yyyy + '-' + mm + '-' + dd;
date.setAttribute("min", today);

class Task {
    constructor(value, id, date, name, status) {
        this.value = value;
        this.id = id;
        this.date = date;
        this.name = name;
        this.status = status || 'soon';
    }
}
let todos = [];

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
        renderItem(input.value, id, date.value, name.value);
        toLS(input.value, id, date.value, name.value)
        id++;
        input.value = '';
        name.value = '';
    }
})


let toLS = (value, id, date, name) => {
    let newTask = new Task(value, id, date, name);
    todos.push(newTask);
    localStorage.removeItem('todos');
    localStorage.setItem('todos', JSON.stringify(todos));
}

let renderItem = (value, id, date, name, status) => {
    let task = document.createElement('div');
    let textNode = document.createElement('span');
    let mainNodeWrap = document.createElement('div');
    let descNode = document.createElement('div');
    let statusesNode = document.createElement('div');
    let statusWaiting = document.createElement('span');
    let statusExecuting = document.createElement('span');
    let statusDone = document.createElement('span');


    statusWaiting.innerHTML = 'soon';
    statusExecuting.innerHTML = 'executing';
    statusDone.innerHTML = 'done';
    textNode.innerHTML = value;
    descNode.innerHTML = `${name} (${date})`;
    descNode.classList.add('description-node')

    if (!status || status === statusWaiting.innerHTML) {
        statusWaiting.classList.add('selected')
    } else if (status === statusExecuting.innerHTML) {
        statusExecuting.classList.add('selected')
    } else if (status === statusDone.innerHTML) {
        statusDone.classList.add('selected')
    }

    task.classList.add('item');
    task.id = id;
    statusesNode.appendChild(statusWaiting);
    statusesNode.appendChild(statusExecuting);
    statusesNode.appendChild(statusDone);
    descNode.appendChild(statusesNode);
    task.appendChild(descNode);
    mainNodeWrap.appendChild(textNode);
    cont.appendChild(task);

    let edit = document.createElement('div');
    edit.classList.add('edit');

    let del = document.createElement('div');
    del.classList.add('delete');
    mainNodeWrap.appendChild(del);
    mainNodeWrap.appendChild(edit);
    task.appendChild(mainNodeWrap);
}

cont.addEventListener('click', (e) => {
    let item = e.path[2];

    if (e.target.classList.value === 'delete') {
        todos.splice(item.id, 1);
        for (let i = 0; i < todos.length; i++) {
            todos[i].id = i;
        }
        localStorage.removeItem('todos');
        localStorage.setItem('todos', JSON.stringify(todos));
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
        item.appendChild(input);
        item.appendChild(submit);
    } else if (e.target.classList.value === 'edit-submit') {
        let input = q('.edit-input');
        let edited = input.value;
        e.path[1].children[1].children[0].innerHTML = edited;
        todos[e.path[1].id].value = edited;
        e.path[1].children[1].children[2].classList.add('edited');
        localStorage.removeItem('todos');
        localStorage.setItem('todos', JSON.stringify(todos));
        q('.edit-submit').remove();
        input.remove();
    } else if (e.target.innerHTML === 'soon' || e.target.innerHTML === 'executing' || e.target.innerHTML === 'done') {
        for (let i = 0; i < e.target.parentNode.children.length; i++) {
            e.target.parentNode.children[i].classList.remove('selected')
        }
        todos[e.path[1].parentNode.parentNode.id].status = e.target.innerHTML;
        e.target.classList.add('selected');
        localStorage.removeItem('todos');
        localStorage.setItem('todos', JSON.stringify(todos));
    }
})

sortDate.addEventListener('click', () => {
    todos.sort((a, b)=>  new Date(a.date) - new Date(b.date));
    qa('.item').forEach(el => {
        el.remove();
    });
    todos.forEach(task => {
        renderItem(task.value, task.id, task.date, task.name, task.status)
    })
    localStorage.removeItem('todos');
    localStorage.setItem('todos', JSON.stringify(todos));
})

sortName.addEventListener('click', () => {
    todos.sort(function (a, b) {
        let nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
    qa('.item').forEach(el => {
        el.remove();
    });
    todos.forEach(task => {
        renderItem(task.value, task.id, task.date, task.name, task.status)
    })
    localStorage.removeItem('todos');
    localStorage.setItem('todos', JSON.stringify(todos));
})