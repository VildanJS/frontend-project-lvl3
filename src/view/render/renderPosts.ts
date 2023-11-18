import { type i18n } from 'i18next'
import { type Post } from '@/utils/parser'
import { renderModal } from '@/view/render/renderModal'
import { type State } from '@/types'

export const renderPosts = (posts: Post[], i18n: i18n, state: State): void => {
    if (posts.length === 0) return
    const { posts: postsElement } = state.ui.elements
    if (postsElement != null) postsElement.innerHTML = ''
    const headingElement = document.createElement('h2')
    headingElement.setAttribute('data-i18n', 'posts')

    const listElement = document.createElement('ul')
    listElement.classList.add('list-group', 'mt-3')

    if (postsElement != null) {
        postsElement.appendChild(headingElement)
        postsElement.appendChild(listElement)
    }

    posts.forEach((post) => {
        const { title, link, id } = post
        const postElement = document.createElement('li')
        postElement.classList.add(
            'list-group-item',
            'd-flex',
            'justify-content-between',
            'align-items-start',
        )

        const linkElement = document.createElement('a')
        listElement.classList.add('fw-bold')
        linkElement.href = link ?? ''
        linkElement.setAttribute('data-id', id ?? '')
        linkElement.setAttribute('target', '_blank')
        linkElement.setAttribute('rel', 'noopener noreferrer')
        linkElement.textContent = title ?? ''

        linkElement.addEventListener('click', () => {
            linkElement.classList.remove('fw-bold')
            linkElement.classList.add('fw-normal', 'link-secondary')
        })

        const buttonElement = document.createElement('button')
        buttonElement.type = 'button'
        buttonElement.classList.add('btn', 'btn-outline-primary', 'btn-sm')
        buttonElement.textContent = i18n.t('buttons.read')
        buttonElement.setAttribute('data-id', id ?? '')
        buttonElement.setAttribute('data-bs-toggle', 'modal')
        buttonElement.setAttribute('data-bs-target', '#modal')
        buttonElement.addEventListener('click', (e) => {
            e.preventDefault()
            renderModal(post, state)
            linkElement.classList.remove('fw-bold')
            linkElement.classList.add('fw-normal', 'link-secondary')
        })

        postElement.appendChild(linkElement)
        postElement.appendChild(buttonElement)

        listElement.appendChild(postElement)
    })
}
