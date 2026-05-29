const select = document.querySelector('.select')
const trigger = document.querySelector('.select-trigger')

select.addEventListener('click', () => {
  select.classList.toggle('open')
})

const modal = document.querySelector('.modal-container')
const modalForm = document.querySelector('.modal-form')
const addTaskBtn = document.querySelector('.add-task')
const modalCancelBtn = document.querySelector('.modal-btn.cancel')
const add = document.querySelector('.modal-btn.apply')

addTaskBtn.addEventListener('click', () => {
  modal.classList.add('open')
  setTimeout(() => {
    input.focus()
  }, 0)
})

modalCancelBtn.addEventListener('click', () => {
  modal.classList.remove('open')
  input.value = ''
})

modal.addEventListener('click', () => {
  modal.classList.remove('open')
  input.value = ''
})

add.addEventListener('click', () => {
  modal.classList.remove('open')
  if (!input.value.trim()) return
  const task = {
    id: Date.now(),
    text: input.value.trim(),
    completed: false,
    isEditing: false,
  }
  tasks.push(task)
  render(tasks)
  input.value = ''
})

modalForm.addEventListener('click', e => {
  e.stopPropagation()
})

const list = document.querySelector('.list')
const input = document.querySelector('.input-add')
let tasks = []

function render(arrTasks) {
  list.innerHTML = ''
  arrTasks.forEach(t => {
    const li = document.createElement('li')
    li.dataset.id = t.id
    li.classList.add('task')
    li.innerHTML = `<label class="label">
            <input class="input-check" type="checkbox" ${t.completed === true ? 'checked' : ''}/>
            <span class="checkmark"></span>
            ${
              t.isEditing
                ? `<input type="text" class="edit-input" value="${t.text}">`
                : `<div class="task-text">${t.text}</div>`
            }
          </label>
          <div class="task_action">
            <svg
              class="task_action redaction"
              width="18"
              height="18"
              viewBox="0 -1 18 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.5091 6.82736L12.9018 4.43468L12.9025 4.43398C13.2324 4.10414 13.3974 3.93916 13.4592 3.74885C13.5136 3.58133 13.5136 3.40088 13.4592 3.23337C13.3973 3.04292 13.2321 2.87769 12.9018 2.54738L11.4506 1.09625C11.1217 0.767352 10.9569 0.602571 10.7669 0.540824C10.5993 0.486392 10.4189 0.486392 10.2514 0.540824C10.0612 0.602613 9.8962 0.767585 9.5669 1.09695L9.5654 1.09837L7.17272 3.49106L0.5 10.1637V13.5H3.83636L10.5091 6.82736ZM7.17272 3.49106L10.5091 6.82736"
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <svg
              class="task_action delete"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M3.87426 7.61505C3.80724 6.74386 4.49607 6 5.36983 6H12.6302C13.504 6 14.1928 6.74385 14.1258 7.61505L13.6065 14.365C13.5464 15.1465 12.8948 15.75 12.1109 15.75H5.88907C5.10526 15.75 4.4536 15.1465 4.39348 14.365L3.87426 7.61505Z"
                stroke="currentColor" />
              <path d="M14.625 3.75H3.375" stroke="currentColor" stroke-linecap="round" />
              <path
                d="M7.5 2.25C7.5 1.83579 7.83577 1.5 8.25 1.5H9.75C10.1642 1.5 10.5 1.83579 10.5 2.25V3.75H7.5V2.25Z"
                stroke="currentColor" />
              <path d="M10.5 9V12.75" stroke="currentColor" stroke-linecap="round" />
              <path d="M7.5 9V12.75" stroke="currentColor" stroke-linecap="round" />
            </svg> 
              <div class="${t.isEditing ? 'task_action redaction_approval active' : 'task_action redaction_approval'}">
                <img class="img-action approve" src="img/Rectangle2.svg" />
                <img class="img-action cancel" src="img/close.svg" />
              </div>
          </div>`
    list.prepend(li)
  })
}

const undoBtn = document.querySelector('.undo-btn')
const progress = document.querySelector('.progress')
const count = document.querySelector('.undo-count')

const radius = 14
const circumference = 2 * Math.PI * radius
const totalTime = 5000

progress.style.strokeDasharray = circumference

let deleteTimeoutId = null
let rafId = null
let start = 0

function cancelPendingDelete() {
  if (deleteTimeoutId !== null) {
    clearTimeout(deleteTimeoutId)
    deleteTimeoutId = null
  }
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  undoBtn.classList.remove('open')
}

function updateTimer() {
  const elapsed = Date.now() - start
  const remaining = Math.max(totalTime - elapsed, 0)
  const percent = remaining / totalTime

  progress.style.strokeDashoffset = circumference * (1 - percent)
  count.textContent = String(Math.ceil(remaining / 1000))

  if (remaining > 0) {
    rafId = requestAnimationFrame(updateTimer)
  } else {
    rafId = null
  }
}

function startDeleteTimer(taskId) {
  cancelPendingDelete()

  start = Date.now()
  undoBtn.classList.add('open')

  deleteTimeoutId = setTimeout(() => {
    tasks = tasks.filter(t => t.id !== taskId)
    render(tasks)
    cancelPendingDelete()
  }, totalTime)

  updateTimer()
}

list.addEventListener('click', e => {
  if (e.target.closest('.task_action.delete')) {
    const taskId = Number(e.target.closest('.task').dataset.id)
    startDeleteTimer(taskId)
    const tasksTemp = tasks.filter(t => t.id !== taskId)
    render(tasksTemp)
  }

  if (e.target.matches('input[type="checkbox"]')) {
    const taskId = Number(e.target.closest('.task').dataset.id)
    const task = tasks.find(t => t.id === taskId)
    task.completed = !task.completed
    render(tasks)
  }

  if (e.target.closest('.redaction')) {
    const taskId = Number(e.target.closest('.task').dataset.id)
    const task = tasks.find(t => t.id === taskId)
    task.isEditing = !task.isEditing
    render(tasks)
    const redactionTask = document.querySelector(`[data-id="${taskId}"]`)
    const editInput = redactionTask.querySelector('.edit-input')
    editInput.focus()
    const len = editInput.value.length
    editInput.setSelectionRange(len, len)
  }

  if (e.target.closest('.img-action.approve')) {
    const taskId = Number(e.target.closest('.task').dataset.id)
    const task = tasks.find(t => t.id === taskId)
    const redactionTask = document.querySelector(`[data-id="${taskId}"]`)
    const editInput = redactionTask.querySelector('.edit-input')
    task.text = editInput.value.trim()
    task.isEditing = !task.isEditing
    render(tasks)
  }

  if (e.target.closest('.img-action.cancel')) {
    const taskId = Number(e.target.closest('.task').dataset.id)
    const task = tasks.find(t => t.id === taskId)
    task.isEditing = !task.isEditing
    render(tasks)
  }
})

undoBtn.addEventListener('click', () => {
  cancelPendingDelete()
  render(tasks)
})

const selectDropdown = document.querySelector('.select__dropdown')
const selected = document.querySelector('.selected')

function getFilteredTasks(currentFilter) {
  if (currentFilter === 'Complete') {
    return tasks.filter(t => t.completed)
  }
  if (currentFilter === 'Incomplete') {
    return tasks.filter(t => !t.completed)
  }
  return tasks
}

selectDropdown.addEventListener('click', e => {
  const item = e.target.closest('.select__item')
  selected.textContent = item.textContent
  const filteredTask = getFilteredTasks(item.textContent)
  showTasks(filteredTask)
})

const searchInput = document.querySelector('.input.search')
let searchValue = ''
searchInput.addEventListener('input', e => {
  searchValue = e.target.value
  toSearchTask()
})

function toSearchTask() {
  const searchedTasks = tasks.filter(task => {
    return task.text.toLowerCase().includes(searchValue.toLowerCase())
  })
  showTasks(searchedTasks)
}

function showTasks(listTasks) {
  if (listTasks.length === 0) {
    list.innerHTML = `
  <li class="list-empty">
    <img
      class="list-empty__img"
      src="img/Detective-check-footprint 1.png"
      alt="No tasks found"
    />
    Empty...
  </li>`
  } else render(listTasks)
}

const theme = document.querySelector('.theme')
const themeIcon = theme.querySelector('img')

theme.addEventListener('click', () => {
  document.body.classList.toggle('dark')
  const isDark = document.body.classList.contains('dark')
  themeIcon.src = isDark ? 'img/moon.svg' : 'img/sun.svg'
  themeIcon.alt = isDark ? 'moon' : 'sun'
})
