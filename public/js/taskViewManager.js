const url = 'http://localhost:3000'

class TaskViewManager {
    render() {
        fetch(url)
            .then(response => response.json())
            .then(tasks => {
                this.clearColumns();

                tasks.forEach(currentTask => {
                    const column = document.querySelector(`.${currentTask.status}`);
                    const taskHtml = this.generateTaskCardHtml(currentTask);

                    column.innerHTML += taskHtml;
                });
            })
    }

    saveTask() {
        var taskObj = this.getTaskObjectFromForm('task-form');

        if (!taskObj.taskId)
            this.sendInsertRequest(taskObj);
        else
            this.sendUpdateRequest(taskObj);
    }

    sendInsertRequest(taskObj) {
        fetch(url + "/tasks", {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: taskObj })
        }).then(res => {
            this.render();
        })
    }

    sendGetRequest(taskId) {
        fetch(url + "/tasks/" + taskId)
            .then(res => res.json())
            .then(task => {
                this.setTaskObjectInForm('task-form', task)
            })
    }

    sendUpdateRequest(taskObj) {
        fetch(url + "/tasks", {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ task: taskObj })
        }).then(res => {
            this.render();
        })
    }

    sendDeleteRequest(taskId) {
        fetch(url + "/tasks/" + taskId, {
            method: 'DELETE',
            mode: 'cors',
        }).then(res => {
            this.render();
        })
    }

    deleteTask(btnObj) {
        this.sendDeleteRequest(btnObj.dataset.taskId);
    }

    displayTask(btnObj) {
        var taskId = btnObj.dataset.taskId;

        this.sendGetRequest(taskId)
    }

    getTaskObjectFromForm(formId) {
        const formElements = document.getElementById(formId).elements;

        var obj = {
            taskId: formElements["task-id"].value,
            title: formElements["task-title"].value,
            details: formElements["task-details"].value,
            assignedTo: formElements["task-assigned-to"].value,
            dueDate: formElements["task-due-date"].value,
            status: formElements["task-status"].value,
        };

        document.getElementById(formId).reset();

        return obj;
    }

    setTaskObjectInForm(formId, taskObj) {
        const formElements = document.getElementById(formId).elements;

        formElements["task-id"].value = taskObj.taskId;
        formElements["task-title"].value = taskObj.title;
        formElements["task-details"].value = taskObj.details;
        formElements["task-assigned-to"].value = taskObj.assignedTo;
        formElements["task-due-date"].value = taskObj.dueDate;
        formElements["task-status"].value = taskObj.status;
    }

    generateTaskCardHtml(taskObj) {
        var taskCardHtml =
            `<div id="draggable-handle" class="card mt-2  " >                     
        <!-- Card content -->
        <div class="card-body" >
            <!-- Title -->
            <h4 class="card-title">${taskObj.taskId}: ${taskObj.title}</h4>
            <!-- Text -->
            <div class="card-text taskDescription">
                <label for="cardLabelDescription">Task Description: </label>
                <p class="cardDescriptionValue">${taskObj.details}</p>
            </div>
            <!-- Assign To -->
            <div class="card-text assignto">
                <label for="cardLabelAssign">Assign To: </label>
                <p class="cardAssignedToValue"> ${taskObj.assignedTo}</p>
            </div>
            <!-- Due Date -->
            <div class="card-text duedate">
                <label for="cardLabelDueDate">DueDate: </label>
                <p class="cardDueDateValue"> ${new Date(taskObj.dueDate).toLocaleDateString("en-GB")}</p>
            </div>
            <!-- Status -->
            <div class="card-text status">
                <label for="cardLabelStatus">Status: </label>
                <p id="${taskObj.status}" class="cardStatusValue">${taskObj.status}</p>
            </div>
            <!-- Button -->
            <button data-task-id=${taskObj.taskId} onclick="taskViewManager.displayTask(this)"
            data-bs-toggle="modal" data-bs-target="#staticBackdrop" class="btn btn-primary edit-button">Edit</button>
            <button data-task-id=${taskObj.taskId} onclick="taskViewManager.deleteTask(this)" class="btn btn-primary del-button">Delete</button>
        </div>                              
    </div> <br>`;

        return taskCardHtml;
    }

    clearColumns() {
        var todoColumn = document.querySelector(".ToDo");
        var inProgressColumn = document.querySelector(".InProgress");
        var reviewColumn = document.querySelector(".Review");
        var doneColumn = document.querySelector(".Done");

        todoColumn.innerHTML = "";
        inProgressColumn.innerHTML = "";
        reviewColumn.innerHTML = "";
        doneColumn.innerHTML = "";
    }

}

