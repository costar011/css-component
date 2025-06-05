let todos = [];

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach(function(todo) {
        const li = document.createElement('li');
        li.className = 'todo-item';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.onchange = function() {
            toggleTodo(todo.id);
        };

        let textElem;
        if (todo.editing) {
            textElem = document.createElement('input');
            textElem.type = 'text';
            textElem.value = todo.text;
            textElem.className = 'todo-edit';
            textElem.onblur = function() {
                finishEdit(todo.id, textElem.value);
            };
            textElem.onkeydown = function(e) {
                if (e.key === 'Enter') {
                    finishEdit(todo.id, textElem.value);
                }
            };
            setTimeout(() => textElem.focus(), 0);
        } else {
            textElem = document.createElement('span');
            textElem.className = 'todo-text' + (todo.completed ? ' completed' : '');
            textElem.textContent = todo.text;
            textElem.onclick = function() {
                startEdit(todo.id);
            };
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = function() {
            deleteTodo(todo.id);
        };

        li.appendChild(checkbox);
        li.appendChild(textElem);
        li.appendChild(deleteBtn);

        todoList.appendChild(li);
    });
}

function addTodo(text) {
    if (!text.trim()) return;
    todos.push({
        id: Date.now(),
        text: text,
        completed: false,
        editing: false
    });
    renderTodos();
}

function toggleTodo(id) {
    todos = todos.map(function(todo) {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(function(todo) {
        return todo.id !== id;
    });
    renderTodos();
}

function startEdit(id) {
    todos = todos.map(function(todo) {
        if (todo.id === id) {
            return { ...todo, editing: true };
        }
        return { ...todo, editing: false };
    });
    renderTodos();
}

function finishEdit(id, newText) {
    todos = todos.map(function(todo) {
        if (todo.id === id) {
            return { ...todo, text: newText, editing: false };
        }
        return todo;
    });
    renderTodos();
}

todoForm.onsubmit = function(e) {
    e.preventDefault();
    const value = todoInput.value.trim();
    if (!value) return;
    addTodo(value);
    todoInput.value = '';
};

renderTodos();
