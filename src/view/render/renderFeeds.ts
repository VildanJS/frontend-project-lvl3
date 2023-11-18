import { type Feed } from '@/utils/parser'
import { type i18n } from 'i18next'
import { type State } from '@/types'

export const renderFeeds = (feeds: Feed[], i18n: i18n, state: State): void => {
    if (feeds.length === 0) return
    const feedsElement = state.ui.elements.feeds
    if (feedsElement != null) feedsElement.innerHTML = ''

    const headingElement = document.createElement('h2')
    headingElement.setAttribute('data-i18n', 'feeds')

    const listElement = document.createElement('ul')
    listElement.classList.add('list-group', 'mt-3')

    if (feedsElement != null) {
        feedsElement.appendChild(headingElement)
        feedsElement.appendChild(listElement)
    }

    feeds.forEach(({ title, description }) => {
        const feedElement = document.createElement('li')
        feedElement.classList.add('list-group-item')

        const titleElement = document.createElement('h4')

        titleElement.textContent = title ?? ''

        const descriptionElement = document.createElement('p')
        descriptionElement.classList.add('text-black-50')
        descriptionElement.textContent = description ?? ''

        feedElement.appendChild(titleElement)
        feedElement.appendChild(descriptionElement)
        listElement.appendChild(feedElement)
    })
}
