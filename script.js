let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const saveTasks = () => localStorage.setItem("tasks", JSON.stringify(tasks));

// Add a sound notification function
const playSound = (sound) => {
    const audio = new Audio(`./sounds/${sound}.mp3`);
    audio.play();
};

// Modify showToast to include sound
const showToast = (msg, sound = "ding") => {
    const toast = document.getElementById("toast");
    toast.textContent = msg;
    toast.classList.add("show");
    playSound(sound); // Play sound when the toast is shown
    setTimeout(() => toast.classList.remove("show"), 2000);
};


const addTask = () => {
    const taskInput = document.getElementById('taskInput');
    const text = taskInput.value.trim();
    if (text) {
        tasks.push({ text, completed: false });
        taskInput.value = "";
        updateTasksList();
        updateStats();
        saveTasks();
        showToast("Task added!");
    }
};


const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
    showToast("Task deleted!");
};

const editTask = (index) => {
    const taskInput = document.getElementById('taskInput');
    taskInput.value = tasks[index].text;
    tasks.splice(index, 1);
    updateTasksList();
    updateStats();
    saveTasks();
    showToast("Task ready to edit");
};

const toggleTaskComplete = (index) => {
    tasks[index].completed = !tasks[index].completed;
    updateTasksList();
    updateStats();
    saveTasks();
};

const updateStats = () => {
    const completeTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks ? (completeTasks / totalTasks) * 100 : 0;

    const progressBar = document.getElementById("progress");
    progressBar.style.width = `${progress}%`;

    const numbers = document.getElementById("numbers");
    numbers.textContent = `${completeTasks}/${totalTasks}`;
};

const updateTasksList = () => {
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
      <div class="taskItem">
        <div class="task ${task.completed ? 'completed' : ''}">
          <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''} />
          <p>${task.text}</p>
        </div>
        <div class="icons">
          <img height="300px" width="300px"src="./images/edit.png" onClick="editTask(${index})" />
          <img class="bin-icon"src="./images/bin.png" onClick="deleteTask(${index})" />
        </div>
      </div>`;
        listItem.querySelector('.checkbox').addEventListener('change', () => toggleTaskComplete(index));
        taskList.appendChild(listItem);
    

    });
};

document.getElementById('newTask').addEventListener("click", function (e) {
    e.preventDefault();
    addTask();
});

// Light/Dark mode toggle
const themeSwitcher = document.getElementById("themeSwitcher");
themeSwitcher.addEventListener("change", () => {
    document.body.classList.toggle("light-mode", themeSwitcher.checked);
    localStorage.setItem("theme", themeSwitcher.checked ? "light" : "dark");
});

// Load theme from localStorage
window.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        themeSwitcher.checked = true;
    }
    updateTasksList();
    updateStats();
});
