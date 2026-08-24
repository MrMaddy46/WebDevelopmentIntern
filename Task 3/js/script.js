"use strict";

/*
========================================
TASK MANAGER
CRUD + localStorage + Filtering
========================================
*/


// ======================================
// DOM ELEMENTS
// ======================================

const taskForm = document.getElementById("task-form");

const taskInput = document.getElementById("task-input");

const taskList = document.getElementById("task-list");

const taskCount = document.getElementById("task-count");

const filterButtons =
    document.querySelectorAll(".filter-btn");


// ======================================
// APPLICATION STATE
// ======================================

let tasks = [];

let currentFilter = "all";


// ======================================
// LOCAL STORAGE KEY
// ======================================

const STORAGE_KEY = "mathavan_todo_tasks";


// ======================================
// GENERATE UNIQUE ID
// ======================================

function generateId() {

    return Date.now().toString() +
        Math.random().toString(36).slice(2);

}


// ======================================
// LOAD TASKS FROM LOCAL STORAGE
// ======================================

function loadTasks() {

    const storedTasks =
        localStorage.getItem(STORAGE_KEY);

    if (!storedTasks) {

        tasks = [];

        return;
    }

    try {

        const parsedTasks =
            JSON.parse(storedTasks);

        if (Array.isArray(parsedTasks)) {

            tasks = parsedTasks;

        } else {

            tasks = [];

        }

    } catch (error) {

        console.error(
            "Unable to load saved tasks:",
            error
        );

        tasks = [];
    }

}


// ======================================
// SAVE TASKS TO LOCAL STORAGE
// ======================================

function saveTasks() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(tasks)
    );

}


// ======================================
// CREATE TASK
// ======================================

function addTask(text) {

    const trimmedText = text.trim();

    if (!trimmedText) {

        return;
    }

    const newTask = {

        id: generateId(),

        text: trimmedText,

        completed: false

    };

    tasks.push(newTask);

    saveTasks();

    renderTasks();

}


// ======================================
// GET FILTERED TASKS
// ======================================

function getFilteredTasks() {

    if (currentFilter === "active") {

        return tasks.filter(
            task => !task.completed
        );

    }

    if (currentFilter === "completed") {

        return tasks.filter(
            task => task.completed
        );

    }

    return tasks;

}


// ======================================
// CREATE TASK DOM ELEMENT
// ======================================

function createTaskElement(task) {

    const listItem =
        document.createElement("li");

    listItem.className = "task-item";

    listItem.dataset.id = task.id;


    // Checkbox

    const checkbox =
        document.createElement("input");

    checkbox.type = "checkbox";

    checkbox.className = "task-checkbox";

    checkbox.checked = task.completed;

    checkbox.setAttribute(
        "aria-label",
        `Mark "${task.text}" as ${
            task.completed
                ? "active"
                : "completed"
        }`
    );


    // Task text

    const taskText =
        document.createElement("span");

    taskText.className = "task-text";

    taskText.textContent = task.text;


    // Action container

    const actions =
        document.createElement("div");

    actions.className = "task-actions";


    // Edit button

    const editButton =
        document.createElement("button");

    editButton.type = "button";

    editButton.className = "edit-btn";

    editButton.dataset.action = "edit";

    editButton.textContent = "Edit";

    editButton.setAttribute(
        "aria-label",
        `Edit task: ${task.text}`
    );


    // Delete button

    const deleteButton =
        document.createElement("button");

    deleteButton.type = "button";

    deleteButton.className = "delete-btn";

    deleteButton.dataset.action = "delete";

    deleteButton.textContent = "Delete";

    deleteButton.setAttribute(
        "aria-label",
        `Delete task: ${task.text}`
    );


    // Add buttons

    actions.appendChild(editButton);

    actions.appendChild(deleteButton);


    // Build task

    listItem.appendChild(checkbox);

    listItem.appendChild(taskText);

    listItem.appendChild(actions);


    // Completed state

    if (task.completed) {

        listItem.classList.add("completed");

    }


    return listItem;

}


// ======================================
// RENDER TASKS
// ======================================

function renderTasks() {

    taskList.innerHTML = "";

    const filteredTasks =
        getFilteredTasks();


    if (filteredTasks.length === 0) {

        const emptyMessage =
            document.createElement("li");

        emptyMessage.className =
            "empty-message";

        emptyMessage.textContent =
            currentFilter === "all"
                ? "No tasks yet. Add your first task!"
                : `No ${currentFilter} tasks.`;

        taskList.appendChild(
            emptyMessage
        );

    } else {

        filteredTasks.forEach(task => {

            const taskElement =
                createTaskElement(task);

            taskList.appendChild(
                taskElement
            );

        });

    }


    updateTaskCount();

}


// ======================================
// UPDATE TASK COUNT
// ======================================

function updateTaskCount() {

    const remainingTasks =
        tasks.filter(
            task => !task.completed
        ).length;


    taskCount.textContent =
        `${remainingTasks} ${
            remainingTasks === 1
                ? "task"
                : "tasks"
        } remaining`;

}


// ======================================
// UPDATE TASK
// ======================================

function toggleTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );

    if (!task) {

        return;
    }

    task.completed =
        !task.completed;

    saveTasks();

    renderTasks();

}


// ======================================
// EDIT TASK
// ======================================

function editTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );

    if (!task) {

        return;
    }

    const updatedText =
        window.prompt(
            "Edit your task:",
            task.text
        );


    if (updatedText === null) {

        return;
    }


    const trimmedText =
        updatedText.trim();


    if (!trimmedText) {

        window.alert(
            "Task cannot be empty."
        );

        return;
    }


    task.text = trimmedText;

    saveTasks();

    renderTasks();

}


// ======================================
// DELETE TASK
// ======================================

function deleteTask(taskId) {

    const task =
        tasks.find(
            item => item.id === taskId
        );

    if (!task) {

        return;
    }


    const confirmed =
        window.confirm(
            `Delete "${task.text}"?`
        );


    if (!confirmed) {

        return;
    }


    tasks =
        tasks.filter(
            item => item.id !== taskId
        );


    saveTasks();

    renderTasks();

}


// ======================================
// FORM EVENT
// ======================================

taskForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();

        addTask(taskInput.value);

        taskInput.value = "";

        taskInput.focus();

    }
);


// ======================================
// EVENT DELEGATION
// ======================================

taskList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                "button[data-action]"
            );


        if (!button) {

            return;
        }


        const taskItem =
            button.closest(".task-item");


        if (!taskItem) {

            return;
        }


        const taskId =
            taskItem.dataset.id;


        const action =
            button.dataset.action;


        if (action === "edit") {

            editTask(taskId);

        }


        if (action === "delete") {

            deleteTask(taskId);

        }

    }
);


// ======================================
// CHECKBOX EVENT DELEGATION
// ======================================

taskList.addEventListener(
    "change",
    function (event) {

        if (
            !event.target.classList.contains(
                "task-checkbox"
            )
        ) {

            return;
        }


        const taskItem =
            event.target.closest(
                ".task-item"
            );


        if (!taskItem) {

            return;
        }


        toggleTask(
            taskItem.dataset.id
        );

    }
);


// ======================================
// FILTER EVENTS
// ======================================

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        function () {

            currentFilter =
                this.dataset.filter;


            filterButtons.forEach(
                filterButton => {

                    const isActive =
                        filterButton === this;

                    filterButton.classList.toggle(
                        "active",
                        isActive
                    );

                    filterButton.setAttribute(
                        "aria-pressed",
                        String(isActive)
                    );

                }
            );


            renderTasks();

        }
    );

});


// ======================================
// INITIALIZE APPLICATION
// ======================================

loadTasks();

renderTasks();

taskInput.focus();