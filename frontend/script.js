const form = document.querySelector('.add');
const search = document.querySelector('.search input');
let list = document.querySelector('.todos');

// Fetch tasks from backend
const fetchTasks = async () => {
    const res = await fetch('http://localhost:3001/tasks');
    const tasks = await res.json();
    list.innerHTML = tasks.map(task => createTaskHTML(task)).join('');
};

// Create task HTML
const createTaskHTML = (task) => {
    return `<li class="list-group-item" data-id="${task._id}">
                ${task.task}
                <span class="delete material-icons float-right">delete_outline</span>
                <span class="edit material-icons float-right">edit</span>
            </li>`;
};

// Add task to backend
form.addEventListener('submit', async e => {
    e.preventDefault();
    const task = form.task.value.trim();
    if (task.length) {
        const res = await fetch('http://localhost:3001/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
        });
        const newTask = await res.json();
        list.innerHTML += createTaskHTML(newTask);
    }
    form.reset();
});

// Delete task from backend
list.addEventListener('click', async e => {
    if (e.target.classList.contains('delete')) {
        const id = e.target.parentElement.dataset.id;
        await fetch(`http://localhost:3001/tasks/${id}`, { method: 'DELETE' });
        e.target.parentElement.remove();
    }

    // Edit task
    if (e.target.classList.contains('edit')) {
        const taskElement = e.target.parentElement;
        const id = taskElement.dataset.id;
        const taskText = taskElement.firstChild.textContent.trim();
        const newTask = prompt("Edit your task:", taskText);
        if (newTask) {
            const res = await fetch(`http://localhost:3001/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ task: newTask })
            });
            const updatedTask = await res.json();
            taskElement.innerHTML = `${updatedTask.task}<span class="delete material-icons float-right">delete_outline</span><span class="edit material-icons float-right">edit</span>`;
        }
    }
});

// Filter tasks
const filterTodos = word => {
    const tasks = Array.from(list.children);
    tasks.filter(task => !task.textContent.includes(word))
        .forEach(task => task.classList.add('hide'));
    tasks.filter(task => task.textContent.includes(word))
        .forEach(task => task.classList.remove('hide'));
};

// Search tasks
search.addEventListener('keyup', () => {
    const word = search.value.trim().toLowerCase();
    filterTodos(word);
});

// Fetch tasks on load
document.addEventListener('DOMContentLoaded', fetchTasks);
