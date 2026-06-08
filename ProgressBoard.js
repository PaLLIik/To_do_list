const row = document.querySelector('.row')
const card = document.querySelector('.card')
const backdrop = document.querySelector('#backdrop')
const progress = document.querySelector('#progress')
const formBtn = document.querySelector('.form-btn')
const formModal = document.querySelector('.form-modal')
const form = document.querySelector('.form')

const T_KEY = 'TECHS'

const content = getState()

formModal.addEventListener('change', (e) => {
  const data = e.target.dataset
  const tech = content.find(t => t.id == data.id)
  tech.done = e.target.checked
  saveState()
  update()
})

row.addEventListener('click', (e) => {
  const data = e.target.dataset
  const tech = content.find(t => t.id == data.id)
  if(!tech) return
  openModal(tech)
  formModal.classList.add('open')
})

function openModal(tech) {
  const checked = tech.done ? 'checked' : ''
formModal.innerHTML = `
<h2>${tech.title}</h2>
<p>${tech.description}</p>
<hr />
<div>
  <input type="checkbox" id="done" ${checked} data-id="${tech.id}" />
  <label for="done" class="check-label">Выучил</label>
</div>
`
}

backdrop.addEventListener('click', () => {
  formModal.classList.remove('open')
})

function toCard(obj) {
  const doneClass = obj.done ? 'done' : ''
  return `
<div class="card ${doneClass}" data-id="${obj.id}">
  <h3 data-id="${obj.id}">${obj.title}</h3>
  </div>`
}

function updateCards() {
  if (content.length === 0) {
    row.innerHTML = `<p class="empty">Пока пусто, добавте что изучать</p>`
  } else {
    row.innerHTML = content.map(toCard).join('')
  }
}


function countProgressPercent() {
  if (content.length === 0) return 0
  const doneCount = content.reduce((acc, item)=> {
    if (item.done) acc++ 
    return acc
  }, 0)
  return Math.round((100 * doneCount) / content.length)
}

function updateProgress() {

  let backgroundColor
  const percent = countProgressPercent()
  
  if(percent <= 35) {
    backgroundColor = '#e75a5a'
  } else if(percent > 35 && percent <= 70) {
    backgroundColor = '#f99415'
  } else {
    backgroundColor = '#73ba3c'
  }

  progress.style.background = backgroundColor
  progress.textContent = percent ? percent + '%' : ''
  progress.style.width = percent + '%'
}

function update() {
  updateCards()
  updateProgress()
}

form.addEventListener('submit', (e)=> {
e.preventDefault()

const {title, description} = e.target

  const titleClass =  !title.value ? 'invalid' : ''
  title.classList = titleClass
  const descriptionClass =  !description.value ? 'invalid' : ''
  description.classList = descriptionClass
  
  if (!title.value || !description.value) return

const newTech = {
  id: Date.now(),
  title: title.value,
  description: description.value,
  done: false
}
content.push(newTech)
title.value = ''
description.value= ''
saveState()
update()
})

function saveState () {
  localStorage.setItem(T_KEY, JSON.stringify(content))
}

function getState () {
  const row = localStorage.getItem(T_KEY)
  return JSON.parse(row) || []
}

update()
localStorage.clear();