const addForm = document.querySelector('.add');
const todolist = document.querySelector('.todolist');
const checks = document.querySelectorAll('.check');
const completedList = document.querySelector('.completed-list');
const completionMessage = document.querySelector('.completion-message');
let totalCount = document.getElementsByClassName('todo').length;
let totalCountDynamic = document.getElementsByClassName('todo').length;
const todoapp = document.querySelector('.todoapp');
const greeting = document.querySelector('.greeting');
const inputName = document.querySelector('.name-input');
const inputNameContainer = document.querySelector('.name-input-container');

document.addEventListener('DOMContentLoaded', e => {

    // if there is already a name in the storage, dont display the input name div
    let name = localStorage.getItem('name');
    if (name != null) {
        inputNameContainer.classList.add('d-none');
        todoapp.classList.add('d-block');
        greeting.querySelector('span').textContent = name;

        checkName();

        document.querySelector('.name-input-container').classList.add('d-none');
        todoapp.classList.remove('d-none');
        todoapp.classList.add('d-block');
    
        displayTodos(); // display items when page loads
        displayCompletedTodos();
    }
}); 

const checkName = () => {

    greeting.querySelector('span').textContent = localStorage.getItem('name');
    
}

// get name of user
inputName.addEventListener('submit', e => {
    e.preventDefault();

    const name = inputName.name.value.trim();

    localStorage.setItem('name', name);  
    
    document.querySelector('.name-input-container').classList.add('d-none');
    todoapp.classList.remove('d-none');
    todoapp.classList.add('d-block');

    displayTodos(); // display items when page loads
    displayCompletedTodos();
    
});

// add todo item
const generateTodo = todo => {
    const html = `
    <li class="list-group-item">
        <i class="far fa-check-circle check"></i>
        <span class="todo ml-1">${todo}</span>
    </li>
    `

    Store.addTodo(html);
    const todos = Store.getTodos();

    // add only last item in storage to list
    todolist.innerHTML += todos[todos.length - 1];
    
};

// display all todo items in storage
const displayTodos = () => {
    const todos = Store.getTodos();

    todos.forEach(todoHTML => {
        todolist.innerHTML += todoHTML;
    });
};

addForm.addEventListener('submit', e => {
    e.preventDefault();
    const todo = addForm.add.value.trim();

    if (todo.length) {
        generateTodo(todo);
        addForm.reset();

        totalCount++;
        totalCountDynamic++;
        let completedCount = document.getElementsByClassName('completed-todo').length;

        completionPercentage();
    }
});

// remove item from todolist when checked & move checked todo item to completed list
todolist.addEventListener('click', e => {
    if (e.target.classList.contains('far')) { // use event delegation instead of iterating through each check
        e.target.classList.remove('far');
        e.target.classList.add('fas');

        Store.removeTodo(e.target.parentElement.querySelector('span').textContent);
        
        const completedTodo = e.target.nextElementSibling.innerHTML; // get text in span (span is sibling of i)

        totalCountDynamic--;

        // remove item from todolist when checked, with fade out transition :)
        e.target.parentElement.style.transition = "opacity 0.5s ease-out";
        e.target.parentElement.style.opacity = 0;
        setTimeout(() => {
            e.target.parentElement.remove();
        }, 800);

        generateCompleted(totalCountDynamic, completedTodo);

    }
});


// display all completed todo items in storage
const displayCompletedTodos = () => {
    const completedTodos = Store.getCompletedTodos();

    completedTodos.forEach(completedTodoHTML => {
        completedList.innerHTML += completedTodoHTML;
    });
};

// add item to completed todolist
const generateCompleted = (totalCountDynamic, completedTodo) => {
    const html = `
    <li class="list-group-item completed-todo d-flex justify-content-between align-items-center">
        <span>${completedTodo}</span>
        <i class="far fa-trash-alt delete"></i>
    </li>
    `
    completedList.style.display = 'block';

    Store.addCompletedTodo(html);
    const completedTodos = Store.getCompletedTodos();

    // add only last item in storage to list
    completedList.innerHTML += completedTodos[completedTodos.length - 1];

    let completedCount = document.getElementsByClassName('completed-todo').length;

    completionPercentage();
};

// calculate & change completion percentage
const completionPercentage = () => {
    const todos = Store.getTodos();
    const completedTodos = Store.getCompletedTodos();

    totalTodos = todos.length;
    totalCompleted = completedTodos.length;

    const zeroCompletion = document.querySelector('.zero-completion');
    const hasCompletion = document.querySelector('.has-completion');
    const fullCompletion = document.querySelector('.full-completion');

    // let completePercent = Math.round((totalCompleted / totalTodos) * 100); // calculate percentage of how many tasks completed

    zeroCompletion.style.display = 'none';
    if (totalCompleted === 0) {
        zeroCompletion.style.display = 'block';
        hasCompletion.style.display = 'none';
        fullCompletion.style.display = 'none';
        document.querySelector('.completed-todos-title').style.display = 'none';
        
    } else if (totalCompleted != 0 && totalTodos != 0) {
        hasCompletion.style.display = 'block';
        fullCompletion.style.display = 'none';
        document.querySelector('.completed-todos-title').style.display = 'block';        
    } 
    else if (totalTodos === 0 && totalCompleted != 0) {
        hasCompletion.style.display = 'none';
        fullCompletion.style.display = 'block';
        document.querySelector('.completed-todos-title').style.display = 'block';
        fullCompletion.querySelector('span').textContent = `100%`;

    }
};

// remove completed todo from completed list
completedList.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {

        Store.removeCompletedTodo(e.target.parentElement.querySelector('span').textContent);
        // Store.updateTotalTodos();


        e.target.parentElement.style.transition = "opacity 0.5s ease-out";
        e.target.parentElement.style.opacity = 0;
        setTimeout(() => {
            e.target.parentElement.remove();
        }, 800);
    }

    // if all completed todos are removed, reset totalCount to 0
    if (e.target.parentElement.parentElement.children.length) {
        totalCount = 0;
    }

});

// handle local storage
class Store {

    // get todos from todolist
    static getTodos() {
        let todos;
        if (localStorage.getItem('todos') === null) {
            todos = [];
        } else {
            todos = JSON.parse(localStorage.getItem('todos'));
        }
        
        return todos;
    }

    // get completed todos from completed list
    static getCompletedTodos() {
        
        let completedTodos;
        if (localStorage.getItem('completedTodos') === null) {
            completedTodos = [];
        } else {
            completedTodos = JSON.parse(localStorage.getItem('completedTodos'));
        }
        return completedTodos;
    }

    // add new todo
    static addTodo(todoHTML) {
        const todos = Store.getTodos();
        todos.push(todoHTML);

        // Store.updateTotalTodos();

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // move todo to completed list
    static addCompletedTodo(completedTodoHTML) {
        const completedTodos = Store.getCompletedTodos();
        completedTodos.push(completedTodoHTML);

        localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
    }

    // remove todo from todolist after completed
    static removeTodo(el) {
        const todos = Store.getTodos();
        
        todos.forEach((todo, index) => {
            if (todo.includes(el)) {
                todos.splice(index, 1);
            } 
        });

        localStorage.setItem('todos', JSON.stringify(todos));
    }

    // remove completed todolist (buang completely)
    static removeCompletedTodo(el) {
        const completedTodos = Store.getCompletedTodos();

        completedTodos.forEach((completedTodo, index) => {
            if (completedTodo.includes(el)) {
                completedTodos.splice(index, 1);
            }
        });
        
        localStorage.setItem('completedTodos', JSON.stringify(completedTodos));

    }
}
