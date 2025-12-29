// 02-Challenge: Task Board (Unsolved Starter)
//
// Use this file to implement:
// - Task creation
// - Task rendering
// - Drag-and-drop across columns
// - Color-coding by due date using Day.js
// - Persistence with localStorage

// ===== State & Initialization =====

// Load tasks and nextId from localStorage (or use defaults)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let nextId = JSON.parse(localStorage.getItem('nextId')) || 1;

// Utility to save tasks + nextId
function saveState() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('nextId', JSON.stringify(nextId));
}

// ===== Core Functions (implement these) =====

// TODO: generateTaskId()
// - Return a unique id
// - Increment nextId and persist using saveState()
//This function generates a unique ID for each new task. Think of it like a ticket number system - each task gets the next number in sequence.
function generateTaskId() {
    const id = nextId;  // Get the current nextId value
    nextId++;           // Increment it for the next task
    saveState();        // Save to localStorage so the increment persists
    return id;          // Return the ID we just generated
}

// TODO: createTaskCard(task)
// - Return a jQuery element representing a task card
// - Include:
//   - Title
//   - Description
//   - Due date
//   - Delete button
// - Add a data-task-id attribute for later lookups
// - Use Day.js to color-code:
//   - If task is not in "done":
//     - Add a warning style if due soon / today
//     - Add an overdue style if past due
function createTaskCard(task) {
    // Create the main card element
    const card = $('<div>')
        .addClass('task-card card mb-3')
        .attr('data-task-id', task.id);
    
    // Create card body
    const cardBody = $('<div>').addClass('card-body');
    
    // Add title
    const title = $('<h5>').addClass('card-title').text(task.title);
    
    // Add description
    const description = $('<p>').addClass('card-text').text(task.description);
    
    // Add due date
    const dueDate = $('<p>')
        .addClass('card-text small text-muted')
        .text('Due: ' + task.dueDate);
    
    // Add delete button
    const deleteBtn = $('<button>')
        .addClass('btn btn-danger btn-sm')
        .text('Delete')
        .attr('data-task-id', task.id)
        .on('click', handleDeleteTask);
    
    // Append everything to card body
    cardBody.append(title, description, dueDate, deleteBtn);
    card.append(cardBody);
    
    // Color-code based on due date and status
    const today = dayjs();
    const due = dayjs(task.dueDate);
    const isToday = due.isSame(today, 'day');
    const isFuture = due.isAfter(today, 'day');
    
    if (task.status === 'done') {
        // All done tasks are accent color
        card.css('background-color', 'var(--accent)');
    } 
    else if (task.status === 'to-do') {
        // To Do section
        if (isToday) {
            card.css('background-color', 'var(--warning)');
        } else if (isFuture) {
            card.css('background-color', 'var(--light)');
        }
    } 
    else if (task.status === 'in-progress') {
        // In Progress section
        if (isToday) {
            card.css('background-color', 'var(--warning)');
        } else if (isFuture) {
            card.css('background-color', 'var(--waiting)');
        }
    }
    
    return card;
}

// TODO: renderTaskList()
// - Clear all lane containers (#todo-cards, #in-progress-cards, #done-cards)
// - Loop through tasks array
// - For each task, create a card and append it to the correct lane
// - After rendering, make task cards draggable with jQuery UI
function renderTaskList() {
    // Clear all lane containers
    $('#todo-cards').empty();
    $('#in-progress-cards').empty();
    $('#done-cards').empty();
    
    // Loop through all tasks
    tasks.forEach(task => {
        // Create the card for this task
        const card = createTaskCard(task);
        
        // Append to the correct lane based on task status
        if (task.status === 'to-do') {
            $('#todo-cards').append(card);
        } else if (task.status === 'in-progress') {
            $('#in-progress-cards').append(card);
        } else if (task.status === 'done') {
            $('#done-cards').append(card);
        }
    });
    
    // Make all task cards draggable
    $('.task-card').draggable({
        opacity: 0.7,        // Makes card semi-transparent while dragging
        zIndex: 9999,        // Ensures dragged card appears on top
        revert: 'invalid',   // Snaps back if dropped in invalid location
        cursor: 'move'       // Changes cursor to indicate draggable
    });
}

// TODO: handleAddTask(event)
// - Prevent default form submission
// - Read values from #taskTitle, #taskDescription, #taskDueDate
// - Validate: if missing, you can show a message or just return
// - Create a new task object with:
//   - id from generateTaskId()
//   - title, description, dueDate
//   - status: 'to-do'
// - Push to tasks array, save, re-render
// - Reset the form and close the modal
function handleAddTask(event) {
    // Prevent the form from submitting and refreshing the page
    event.preventDefault();
    
    // Get values from the form inputs
    const title = $('#taskTitle').val().trim();
    const description = $('#taskDescription').val().trim();
    const dueDate = $('#taskDueDate').val();
    
    // Validate: make sure all fields have values
    if (!title || !description || !dueDate) {
        alert('Please fill out all fields');
        return;
    }
    
    // Create new task object
    const newTask = {
        id: generateTaskId(),
        title: title,
        description: description,
        dueDate: dueDate,
        status: 'to-do'  // All new tasks start in "To Do"
    };
    
    // Add to tasks array
    tasks.push(newTask);
    
    // Save to localStorage
    saveState();
    
    // Re-render the task list to show the new task
    renderTaskList();
    
    // Reset the form fields
    $('#taskForm')[0].reset();
    
    // Close the modal
    const modal = bootstrap.Modal.getInstance($('#taskModal')[0]);
    modal.hide();
}

// TODO: handleDeleteTask(event)
// - Get the task id from the clicked button (data-task-id)
// - Remove that task from tasks array
// - Save and re-render
function handleDeleteTask(event) {
    // Get the task ID from the button that was clicked
    const taskId = $(event.target).attr('data-task-id');
    
    // Convert to number (IDs are stored as numbers)
    const id = parseInt(taskId);
    
    // Filter out the task with this ID (removes it from array)
    tasks = tasks.filter(task => task.id !== id);
    
    // Save the updated tasks array to localStorage
    saveState();
    
    // Re-render to update the display
    renderTaskList();
}

// TODO: handleDrop(event, ui)
// - Get the task id from the dragged card
// - Determine the new status from the lane's dataset/status or id
// - Update the task's status in the tasks array
// - Save and re-render
function handleDrop(event, ui) {
    // Get the task ID from the dragged card
    const taskId = ui.draggable.attr('data-task-id');
    const id = parseInt(taskId);
    
    // NEW: Get the ID of the lane body where the card was dropped
    // This will be 'todo-cards', 'in-progress-cards', or 'done-cards'
    const newStatusId = $(event.target).closest('.lane-body').attr('id');
    
    // NEW: Create a mapping object to convert lane body IDs to task status values
    // The lane body IDs don't match the status values we use in our task objects,
    // so we need this mapping to translate between them
    const statusMap = {
        'todo-cards': 'to-do',
        'in-progress-cards': 'in-progress',
        'done-cards': 'done'
    };
    
    // NEW: Use the statusMap to get the correct status value
    const newStatus = statusMap[newStatusId];
    
    // Find the task in the array and update its status
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.status = newStatus;
    }
    
    // NEW: Physically move the DOM element to the new lane body
    // .detach() removes it from its current location (keeping events/data)
    // .appendTo() places it in the new lane body
    // This prevents the card from disappearing and keeps the drag smooth
    ui.draggable.detach().appendTo($(event.target).closest('.lane-body'));
    
    // Save the updated tasks array
    saveState();
    
    // Re-render to show the task in its new column
    renderTaskList();
}

// ===== Document Ready =====

$(function () {
    // Show current date in header using Day.js
    $('#current-date').text(dayjs().format('[Today:] dddd, MMM D, YYYY'));

    // Initialize datepicker for due date
    // Hint: keep format consistent and use it in your parsing
    $('#taskDueDate').datepicker({
        dateFormat: 'mm-dd-yy',
        changeMonth: true,
        changeYear: true,
        minDate: 0,
    });

    // Render tasks on load (will do nothing until you implement renderTaskList)
    renderTaskList();

    // Form submit handler
    $('#taskForm').on('submit', handleAddTask);

    // Make lanes droppable
    // TODO: configure droppable to accept task cards and use handleDrop
    // Make lanes droppable
    $('.lane-body').droppable({
        accept: '.task-card',    // Only accept elements with task-card class
        drop: handleDrop         // Call this function when a card is dropped
    });
});

// NOTE:
// - You are encouraged to use Day.js for ALL date logic.
// - You may adjust "due soon" rules, as long as they're clearly implemented.