import onChange from 'on-change'
import { type i18n } from 'i18next'
import { type Elements, type State } from '@/types'
import { renderPosts } from '@/view/render/renderPosts'
import { renderFeeds } from '@/view/render/renderFeeds'
import { renderFeedback } from '@/view/render/renderFeedback'
import {
    type ValidationErrors,
    updateContent,
} from '@/view/render/updateContent'
import { type Feed, type Post } from 'utils/parseXmlData'
import { renderForm } from '@/view/render/renderForm'

export const createState = (state: State, i18n: i18n, elements: Elements): State => {
    return onChange(state, (path, value) => {
        switch (path) {
            case 'ui.lng':
                i18n.changeLanguage(value as string)
                    .then((t) => {
                        updateContent(t, elements.i18n)
                    })
                    .catch((e) => e.message)
                break
            case 'ui.feedback':
                renderFeedback(value as ValidationErrors, i18n, elements)
                break
            case 'ui.form.isSubmitting':
            case 'ui.form.isValid':
                renderForm(value as boolean, i18n, elements, path)
                break
            case 'posts':
                renderPosts(value as Post[], i18n, elements)
                break
            case 'feeds':
                renderFeeds(value as Feed[], i18n, elements)
        }
    })
}
