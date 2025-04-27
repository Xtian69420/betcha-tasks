const addTaskBtn = document.getElementById('addTaskBtn');
const taskForm = document.getElementById('taskForm');
const saveTaskBtn = document.getElementById('saveTaskBtn');
const cancelTaskBtn = document.getElementById('cancelTaskBtn');
const taskAccordion = document.getElementById('taskAccordion');

let editIndex = null;

addTaskBtn.addEventListener('click', () => {
  taskForm.style.display = 'block';
  clearForm();
});

cancelTaskBtn.addEventListener('click', () => {
  taskForm.style.display = 'none';
  clearForm();
});

saveTaskBtn.addEventListener('click', () => {
  const title = document.getElementById('taskTitle').value.trim();
  const who = document.getElementById('taskWho').value;
  const desc = document.getElementById('taskDesc').value.trim();
  const status = document.getElementById('taskStatus').value;

  if (!title || !who || !desc || !status) {
    alert('Please fill all fields!');
    return;
  }

  const task = { title, who, desc, status };

  if (editIndex === null) {
    addTaskToAccordion(task);
  } else {
    updateTaskInAccordion(task);
  }

  taskForm.style.display = 'none';
  clearForm();
});

function generateId() {
  return 'id-' + Math.random().toString(36).substr(2, 9);
}

function addTaskToAccordion(task) {
    const itemId = generateId();
  
    const accordionItem = document.createElement('div');
    accordionItem.classList.add('accordion-item', 'mb-2');
    accordionItem.dataset.index = taskAccordion.children.length;
  
    accordionItem.innerHTML = `
      <h2 class="accordion-header" id="heading-${itemId}">
        <button class="accordion-button collapsed d-flex justify-content-between align-items-center" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-${itemId}" aria-expanded="false" aria-controls="collapse-${itemId}">
          <div class="d-flex flex-grow-1 align-items-center justify-content-between">
            <span><strong>${task.title}</strong> - ${task.who}</span>
            <span class="badge ${task.status === 'Finished' ? 'bg-success' : 'bg-warning text-dark'} ms-3 me-1">${task.status}</span>
          </div>
        </button>
      </h2>
      <div id="collapse-${itemId}" class="accordion-collapse collapse" aria-labelledby="heading-${itemId}" data-bs-parent="#taskAccordion">
        <div class="accordion-body">
          <p><strong>Description:</strong> ${task.desc}</p>
          <p><strong>Status:</strong> <span class="task-status">${task.status}</span></p>
          <div class="actions">
            ${task.status === 'Pending' ? `
              <button class="btn btn-success btn-sm finish-btn">Finish</button>
              <button class="btn btn-warning btn-sm edit-btn">Edit</button>
              <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;
  
    taskAccordion.appendChild(accordionItem);
  
    attachButtonEvents(accordionItem);
  }
  
function attachButtonEvents(item) {
  const finishBtn = item.querySelector('.finish-btn');
  const editBtn = item.querySelector('.edit-btn');
  const deleteBtn = item.querySelector('.delete-btn');

  if (finishBtn) {
    finishBtn.addEventListener('click', () => {
      const badge = item.querySelector('.accordion-button .badge');
      badge.classList.remove('bg-warning', 'text-dark');
      badge.classList.add('bg-success');
      badge.textContent = 'Finished';

      const statusSpan = item.querySelector('.task-status');
      statusSpan.textContent = 'Finished';

      const actionsDiv = item.querySelector('.actions');
      actionsDiv.innerHTML = '';
    });
  }

  if (editBtn) {
    editBtn.addEventListener('click', () => {
      const titleText = item.querySelector('.accordion-button').childNodes[0].textContent.trim().split(' - ')[0];
      const whoText = item.querySelector('.accordion-button').childNodes[0].textContent.trim().split(' - ')[1];
      const descText = item.querySelector('.accordion-body p strong + text') || item.querySelector('.accordion-body p').nextSibling.nodeValue.trim();
      const statusText = item.querySelector('.task-status').textContent;

      document.getElementById('taskTitle').value = titleText;
      document.getElementById('taskWho').value = whoText;
      document.getElementById('taskDesc').value = descText;
      document.getElementById('taskStatus').value = statusText;

      editIndex = Array.from(taskAccordion.children).indexOf(item);
      taskForm.style.display = 'block';
    });
  }

  if (deleteBtn) {
    deleteBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to delete this task?')) {
        item.remove();
      }
    });
  }
}

function updateTaskInAccordion(task) {
  const item = taskAccordion.children[editIndex];
  const button = item.querySelector('.accordion-button');
  const badge = button.querySelector('.badge');

  button.childNodes[0].textContent = `${task.title} - ${task.who} `;

  badge.textContent = task.status;
  badge.className = `ms-auto badge ${task.status === 'Finished' ? 'bg-success' : 'bg-warning text-dark'}`;

  item.querySelector('.accordion-body p').innerHTML = `<strong>Description:</strong> ${task.desc}`;
  item.querySelector('.task-status').textContent = task.status;

  const actionsDiv = item.querySelector('.actions');
  if (task.status === 'Finished') {
    actionsDiv.innerHTML = '';
  } else {
    actionsDiv.innerHTML = `
      <button class="btn btn-success btn-sm finish-btn">Finish</button>
      <button class="btn btn-warning btn-sm edit-btn">Edit</button>
      <button class="btn btn-danger btn-sm delete-btn">Delete</button>
    `;
    attachButtonEvents(item);
  }

  editIndex = null;
}

function clearForm() {
  document.getElementById('taskTitle').value = '';
  document.getElementById('taskWho').value = '';
  document.getElementById('taskDesc').value = '';
  document.getElementById('taskStatus').value = 'Pending';
  editIndex = null;
}