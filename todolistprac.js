const addForm = document.querySelector('.add');
const todolist = document.querySelector('.todolist');
const checks = document.querySelectorAll('.check');
const completedList = document.querySelector('.completed-list');
const completionMessage = document.querySelector('.completion-message');
let totalCount = document.getElementsByClassName('todo').length;
let totalCountDynamic = document.getElementsByClassName('todo').length;
const todoapp = document.querySelector('.todoapp');
const greeting = document.querySelector('.greeting');

// get name of user
const inputName = document.querySelector('.name-input');
inputName.addEventListener('submit', e => {
    e.preventDefault();

    const name = inputName.name.value.trim();

    document.querySelector('.name-input-container').classList.add('d-none');
    todoapp.classList.remove('d-none');
    todoapp.classList.add('d-block');
    
    if (name.toLowerCase() === 'taki') {
        greeting.textContent = 'Yo STOOPID! Stoopid stoopid stoopid';

        const htmlGreeting = `
        <img src="https://i.imgur.com/5g4xhH7.png" alt="bird" class="bird-img">

        `

        const htmlTodos = `
        <li class="list-group-item">
            <i class="far fa-check-circle check"></i>
            <span class="todo ml-1">Drink water</span>
        </li>
        <li class="list-group-item">
            <i class="far fa-check-circle check"></i>
            <span class="todo ml-1">Eat roti telur</span>
        </li>
        <li class="list-group-item">
            <i class="far fa-check-circle check"></i>
            <span class="todo ml-1">Rest more</span>
        </li>
        `
        todoapp.querySelector('.bird-space').innerHTML += htmlGreeting;
        todolist.innerHTML += htmlTodos;
        
    }
    else {
        greeting.querySelector('span').textContent = name;
    }

});

// add todo item
const generateTodo = todo => {
    const html = `
    <li class="list-group-item">
        <i class="far fa-check-circle check"></i>
        <span class="todo ml-1">${todo}</span>
    </li>
    `
    todolist.innerHTML += html;

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

        completionPercentage(totalCount, completedCount, totalCountDynamic);
    }
});

// remove item from todolist when checked & move checked todo item to completed list
// checks.forEach(check => { // iterate through each check
//     check.addEventListener('click', e => {
//         check.classList.remove('far');
//         check.classList.add('fas');

//         const completedTodo = e.target.nextElementSibling.innerHTML; // get text in span (span is sibling of i)

//         generateCompleted(completedTodo);

//         // remove item from todolist when checked, with fade out transition :)
//         check.parentElement.style.transition = "opacity 0.5s ease-out";
//         check.parentElement.style.opacity = 0;
//         setTimeout(() => {
//             check.parentElement.remove();
//         }, 800);
//     });
// });

todolist.addEventListener('click', e => {
    if (e.target.classList.contains('far')) { // use event delegation instead of iterating through each check
        e.target.classList.remove('far');
        e.target.classList.add('fas');

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

const generateCompleted = (totalCountDynamic, completedTodo) => {
    const html = `
    <li class="list-group-item completed-todo d-flex justify-content-between align-items-center">
        <span>${completedTodo}</span>
        <i class="far fa-trash-alt delete"></i>
    </li>
    `
    completedList.style.display = 'block';
    completedList.innerHTML += html;

    // let totalCount = document.getElementsByClassName('todo').length;
    let completedCount = document.getElementsByClassName('completed-todo').length;

    completionPercentage(totalCount, completedCount, totalCountDynamic);
};

// change completion percentage
const completionPercentage = (totalCount, completedCount, totalCountDynamic) => {
    console.log(totalCount,completedCount)
    console.log("dynamic: " + totalCountDynamic);
    const zeroCompletion = document.querySelector('.zero-completion');
    const hasCompletion = document.querySelector('.has-completion');
    const fullCompletion = document.querySelector('.full-completion');

    let completePercent = Math.round((completedCount / totalCount) * 100); // calculate percentage of how many tasks completed

    zeroCompletion.style.display = 'none';
    if (completePercent === 0) {
        zeroCompletion.style.display = 'block';
        hasCompletion.style.display = 'none';
        fullCompletion.style.display = 'none';
        document.querySelector('.completed-todos-title').style.display = 'none';
        
    } else if (completePercent < 100) {
        hasCompletion.style.display = 'block';
        fullCompletion.style.display = 'none';
        document.querySelector('.completed-todos-title').style.display = 'block';
        hasCompletion.querySelector('span').textContent = `${completePercent}%`;
        
    } else if (totalCountDynamic === 0) {
        hasCompletion.style.display = 'none';
        fullCompletion.style.display = 'block';
        document.querySelector('.completed-todos-title').style.display = 'block';
        fullCompletion.querySelector('span').textContent = `100%`;

    }
};

// remove completed todo from completed list
completedList.addEventListener('click', e => {
    if (e.target.classList.contains('delete')) {

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
