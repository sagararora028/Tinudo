window.addEventListener("load", () => {
    renderTasks();
    renderLists();
    loadFromLocal();
})

// Initial Code Setup

let  lists = [
    {
        id: "default", 
        listName: "Default",
    }
]

let tasks = [];

let selectedList = "Default";

const fileInput = document.querySelector(".image-upload");
const addImageButton = document.querySelector(".add-image");
const previewImage = document.getElementById("preview-image");
const deleteImageButton = document.getElementById("delete-image");
const addtaskButton = document.getElementById("add-task-button");
const inputValue = document.getElementById("input-value");
const taskList = document.getElementById("task-list");
const taskEmptyText = document.getElementById("tasks-empty");
const clearTasks = document.getElementById("clear-tasks");
const clearLists = document.getElementById("clear-lists")
const showCompletedBtn = document.getElementById("completed-btn");
const showAllBtn = document.getElementById("all-tasks-btn");
const addCategoryBtn = document.getElementById("add-category");
const CategoryList = document.getElementById("category-list");
const listValue = document.getElementById("list-value");
const listDropdown = document.getElementById("list-dropdown");


function loadFromLocal() {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"))
    const storedLists = JSON.parse(localStorage.getItem("lists"))

    if(storedLists) lists = storedLists
    if(storedTasks) tasks = storedTasks
}

function saveListsToLocal() {
    localStorage.setItem("lists", JSON.stringify(lists));
}

function saveTasksToLocal() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//-----------Add Tasks Code Starts-----------//

addtaskButton.addEventListener("click", addTask);

function addTask() {
    const taskValue = inputValue.value.trim();
    const listDropdownValue = listDropdown.value;

    if(!taskValue) {
        alert("Please enter a task!");
        return;
    }

    const task = {
        id: Date.now().toString(),
        desc: taskValue,
        completed: false,
        listId: listDropdownValue || "Default",
    }

    tasks.push(task);    
    saveTasksToLocal();
    renderTasks()

    inputValue.value = "";
}

//-----------Add Tasks Code Starts-----------//

//-----------Render Tasks Code Starts-----------//

function renderTasks(filteredTasks = tasks) {

    taskList.innerHTML = ""

    const sortedTasks = [...filteredTasks].sort((a,b) => a.completed - b.completed);

    if(sortedTasks.length === 0) { 
        taskEmptyText.classList.remove("hidden");
        taskList.classList.add("hidden");
    } else {
        taskEmptyText.classList.add("hidden");  
        taskList.classList.remove("hidden");
    }

    sortedTasks.forEach(task => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("flex", "items-start", "justify-between", "pb-4", "task-item");
        taskItem.innerHTML = `
        <div class="flex items-center gap-2">
                                <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleTaskStatus('${task.id}')" class="w-4 h-4 accent-gray-800" />
                                <span class="text-gray-800 ${task.completed ? "line-through" : ""}">${task.desc}</span>
        </div>
        <!-- Delete Icon -->
        <div class="relative group">
                                    <button onclick="deleteTask('${task.id}')" text-gray-500 hover:text-gray-800">
                                        <img class="h-6" src="./Uploads/delete.svg" alt="urgent_icon">
                                    </button>
                                    <div class="absolute left-1/2 w-28 text-center bottom-full mb-2 -translate-x-1/2 rounded-md bg-gray-900 text-white text-sm px-3 py-2 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible">
                                        Delete Task?
                                    <div class="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                                </div>
        </div>
        `
        taskList.appendChild(taskItem);        
    })
}

// Toggle Task Status

function toggleTaskStatus(taskId) {
    // Ensure taskId is a string
    taskId = String(taskId);

    const taskExists = tasks.find(task => task.id === taskId);
    if (!taskExists) {
        console.error("Task not found:", taskId);
        return;
    }

    tasks = tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed} : task
    );

    saveTasksToLocal();
    renderTasks();
}

// Delete Task

function deleteTask(taskId) {
    taskId = String(taskId)

    const taskExists = tasks.find((task) => task.id === taskId)
    
    if(!taskExists) {
        console.error("Task not found", taskId)
        return;
    }

    tasks = tasks.filter((task) => task.id !== taskId);
    saveTasksToLocal();
    renderTasks();
}


//Filter All Tasks

showAllBtn.addEventListener("click", () => {
    showAllBtn.classList.add("active")
    showCompletedBtn.classList.remove("active")
    renderTasks();
})

//Filter Completed Tasks

showCompletedBtn.addEventListener("click", () => {
    showAllBtn.classList.remove("active")
    showCompletedBtn.classList.add("active")
    completedTasks = tasks.filter((task)=> task.completed === true)
    renderTasks(completedTasks);
})

//-----------Clear Tasks Code Starts-----------//

clearTasks.addEventListener("click", () => {
    tasks.length = [];
    renderTasks();
    saveTasksToLocal();
})


//-----------Add List Code Starts-----------//

addCategoryBtn.addEventListener("click", () => {
    const listName = listValue.value.trim()

    if(!listName) {
        alert("Please enter a List Name!")
        return;
    }

    if(lists.some((list) => list.listName.toLowerCase() === listName.toLowerCase())) {
        alert("list already exists!")
        return;
    }

    const list = {
        id: Date.now().toString(),
        listName
    }

    listValue.value = "";

    lists.push(list);
    saveListsToLocal();
    renderLists();
})


//-----------Render List Code Starts-----------//

function renderLists() {
    CategoryList.innerHTML = "";
    listDropdown.innerHTML = "";

    lists.forEach((list) => {
        const listItem = document.createElement("li")
        listItem.classList.add("flex", "justify-between", "pb-3", "pt-3", "border-b", "border-dashed", "border-gray-300", "cursor-pointer");
        listItem.innerHTML = `
                            <div class="flex items-center gap-2">
                                <img class="h-6" src="./Uploads/list.svg" alt="list-icon"> ${list.listName}
                            </div>
                            <div class="relative group inline-block"> 
                                <button onclick="deleteList('${list.id}')" class="${list.listName === "Default" ? "hidden" :" "} list-delete-btn">
                                    <img class="h-6" src="./Uploads/delete.svg" alt="delete-icon">
                                </button>  
                                <div class="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 rounded-md bg-gray-900 text-white text-sm px-3 py-2 opacity-0 invisible transition-opacity duration-300 group-hover:opacity-100 group-hover:visible">
                                    Delete?
                                    <div class="absolute left-1/2 top-full -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                                </div>
                            </div>
        `
        listItem.addEventListener("click", () => filterTasksByList(list.id))

        CategoryList.appendChild(listItem)

        const option = document.createElement("option")
        option.value = list.id
        option.textContent = list.listName
        listDropdown.appendChild(option)
    })    
}


// Delete List

function deleteList(listId) {
    lists = lists.filter((list) => list.id !== listId);
    renderLists();
    saveListsToLocal();
}

// Filter List

function filterTasksByList(listId) {
    const filteredTasks = tasks.filter((task) => task.listId === listId);
    renderTasks(filteredTasks);
}

// Show All Tasks

clearLists.addEventListener("click", () => {
    renderTasks();
})


//-----------Gallery Code Starts-----------//

window.addEventListener("load", () => {
    const savedImage = localStorage.getItem("uploadImage");
    if(savedImage) {
        previewImage.src = savedImage;
        previewImage.classList.remove("hidden");
        deleteImageButton.classList.remove("hidden");
    }
})

addImageButton.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if(file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageURL = e.target.result;
            previewImage.src = imageURL;
            previewImage.classList.remove("hidden");
            deleteImageButton.classList.remove("hidden");
            addImageButton.classList.add("hidden");

            localStorage.setItem("uploadImage", imageURL);
        };
        reader.readAsDataURL(file);
    } else {
        alert("only image files are allowed")
    }
});

deleteImageButton.addEventListener("click", () => {
    localStorage.removeItem("uploadImage");
    previewImage.src = "";
    previewImage.classList.add("hidden");
    deleteImageButton.classList.add("hidden");
    addImageButton.classList.remove("hidden");
})

//-----------Gallery Code Ends-----------//

//-----------Fetching Quote Starts-----------//

// Fetch quote function (unchanged)
async function fetchQuote() {
    try {
        const response = await fetch('https://api.allorigins.win/get?url=https://zenquotes.io/api/today');
        const data = await response.json();
        const parsedData = JSON.parse(data.contents);
        
        document.getElementById('quote-container').innerHTML = `<p class="mb-3">"${parsedData[0].q}"</p><cite>- ${parsedData[0].a}</cite>`;
    } catch (error) {
        document.getElementById('quote-container').innerHTML = '<p>"No quote to show right now!"</p><cite>- Me</cite>';
    }
}

fetchQuote()
//-----------Fetching Quote Ends-----------//

//-----------Sun Background Code Starts-----------//

gsap.to("#sun-gradient stop:first-child", {
    keyframes: [
        { attr: { "stop-color": "#FFBF85" }, duration: 3 },
        { attr: { "stop-color": "#f85944" }, duration: 3 }
    ],
    repeat: -1,
    yoyo: true,
    ease: "power2.inOut",
});

gsap.to("#sun-gradient stop:last-child", {
    attr: { "stop-color": "#FFFF00" }, // Bright yellow
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease: "power2.inOut",
});

gsap.to("#sun", {
    scale: 1.1,
    repeat: -1,
    yoyo: true,
    duration: 3,
    ease: "sine.inOut",
});

// 🔄 Make the gradient move around randomly
function animateGradient() {
    gsap.to("#sun-gradient", {
        x: gsap.utils.random(-10, 30), // Moves left/right randomly
        y: gsap.utils.random(-10, 30), // Moves up/down randomly
        duration: 10,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
    });
}
animateGradient();

//-----------Sun Background Code Ends-----------//