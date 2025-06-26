document.addEventListener('DOMContentLoaded', () =>{
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const tasklist = document.getElementById('task-list')
    const emptyImage = document.querySelector('.empty-image');
    const todosContainer = document.querySelector('.todo-container');
    const progressBar = document.getElementById('progress');
    const progressNumber = document.getElementById('numbers');

    const toggleEmptyState = () => {
        emptyImage.style.display = 
        tasklist.children.length === 0 ? 'block' : 'none';
        todosContainer.style.width = tasklist.
        children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = (checkcompletion = true) => {
        const totalTasks = tasklist.children.length;
        const completedTasks = tasklist.querySelectorAll('.checkbox:checked').length;

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : `0`;
        progressNumber.textContent = `${completedTasks} / ${totalTasks}`;

        if (checkcompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti();
        }
    };
    
    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(tasklist.querySelectorAll('li')).map(li => ({
            text:li.querySelector('span').textContent,completed:li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    const loadTasksFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem('tasks') || []);
        savedTasks.forEach(({text, completed}) => addTask(text, completed, false));
        toggleEmptyState();
        updateProgress();
    }

    const addTask = (text, completed = false , checkcompletion = true) => {
        const taskText = text  || taskInput.value.trim();
        if(!taskText) {
            return;
        }

        const li = document.createElement('li');
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed  ? 'checked' : ''}/>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="edit-btn">
            <i class="fa-solid fa-pen-to-square"></i></button>
            <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `;

        const checkbox = li.querySelector('.checkbox');
        const editbtn = li.querySelector('.edit-btn');

        if (completed) {
            li.classList.add('completed');
            editbtn.disabled = true;
            editbtn.style.opacity = '0.5';
            editbtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change' , () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed',isChecked);
            editbtn.disabled = isChecked;
            editbtn.style.opacity = isChecked ? '0.5' : '1';
            editbtn.style.pointerEvents = isChecked ?  'none' : 'auto';
            updateProgress();
            saveTaskToLocalStorage();
        });

        editbtn.addEventListener('click', () =>{
            if(!checkbox.checked){
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                updateProgress(false);
                saveTaskToLocalStorage();
            }
        });

        li.querySelector('.delete-btn').
        addEventListener('click' , () => {
            li.remove();
            toggleEmptyState();
            updateProgress();
            saveTaskToLocalStorage();
        });

        tasklist.appendChild(li);
        taskInput.value = '';
        toggleEmptyState();
        updateProgress(checkcompletion);
        saveTaskToLocalStorage();
    };

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    loadTasksFromLocalStorage();
});

const Confetti = () => {
    const count = 100,
    defaults = {
        origin: { y: 1 },
    };

    function fire(particleRatio, opts) {
    confetti(
        Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
        })
    );
    }

    let y = 1;
    const interval = setInterval(() => {
        fire(0.2, {spread:60 , starVelocity:30,scalar:0.8,origin:{ y }});
        fire(0.1, {spread:120, starVelocity:55,scalar: 1.2});
        y -= 0.05;
        if (y <= 0.3) clearInterval(interval);
    }, 8);
};