const accordionContainer = document.querySelector('.accordion-container')

accordionContainer.addEventListener('click', e => {
  const btn = e.target.closest('.accordion-btn')

  if (!btn) return

  const item = btn.closest('.accordion-item')
  const accordionContent = item.querySelector('.accordion-content')
  const activeItem = accordionContainer.querySelector('.accordion-item.active')

  if(activeItem && activeItem !== item) {
const activeContent = activeItem.querySelector('.accordion-content')
    activeContent.style.height =  activeContent.scrollHeight + 'px'
    requestAnimationFrame(() => {
      activeContent.style.height = '0'
    })
    activeItem.classList.remove('active')
  }

  if (item.classList.contains('active')) {
    accordionContent.style.height =  accordionContent.scrollHeight + 'px'

    requestAnimationFrame(() => {
      accordionContent.style.height = '0'
    })
    item.classList.remove('active')
  } else {
    item.classList.add('active')
    accordionContent.style.height =  accordionContent.scrollHeight + 'px'
  }
})
