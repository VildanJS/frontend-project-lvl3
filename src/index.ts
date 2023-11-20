import './scss/styles.scss'
import 'bootstrap'

import i18next, { type i18n } from 'i18next'
import { getUrlThroughProxy } from '@/utils/proxy'
import { type State } from 'types'
import { createState } from '@/view'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'
import { sendRequestWithTimeout } from '@/utils/sendRequestWithTimeout'
import { validate } from 'validate'
import axios, { isAxiosError } from 'axios'
import { parser } from '@/utils/parser'
import { updateContent } from '@/view/render/updateContent'

const app = (i18n: i18n): void => {
    const initialState: State = {
        urls: [],
        posts: [],
        feeds: [],
        ui: {
            elements: {
                form: {
                    root: document.querySelector<HTMLFormElement>('.rss-form'),
                    input: document.querySelector<HTMLInputElement>('#url-input'),
                    addButton: document.querySelector<HTMLButtonElement>('#add'),
                },
                feedback: document.querySelector('.feedback'),
                posts: document.querySelector('.posts'),
                feeds: document.querySelector('.feeds'),
                i18n: document.querySelectorAll('[data-i18n]'),
                modal: {
                    root: document.querySelector('#modal'),
                    body: document.querySelector('.modal-body'),
                    title: document.querySelector('.modal-title'),
                    link: document.querySelector('.full-article'),
                },
            },
            feedback: 'validationErrors.noError',
            form: {
                isSubmitting: false,
                isValid: true
            },
            lng: 'ru',
        },
    }
    const state = createState(initialState, i18n)

    const { i18n: i18nElements } = initialState.ui.elements

    updateContent(i18n.t, i18nElements)

    const {root: form, input} = initialState.ui.elements.form
    input?.addEventListener('input', (e) => {
        const target = e.target as HTMLInputElement
        validate(target.value, state.urls)
            .then(() => {
                state.ui.form.isValid = true
                state.ui.feedback = 'validationErrors.noError'
            })
            .catch((err) => {
                state.ui.form.isValid = false
                state.ui.feedback = err.message
            })
    })

    form?.addEventListener('submit', (e) => {
        e.preventDefault()

        if (e.target === null) return
        const formData = new FormData(e.target as HTMLFormElement)
        const value = formData.get('url') as string

        if (state.ui.form.isValid) {
            state.ui.form.isSubmitting = true
            state.ui.feedback = 'networkErrors.pending'
            axios
                .get(getUrlThroughProxy(value))
                .then(({ data }) => {
                    const [feed, posts] = parser(data.contents)
                    state.urls.push(value)
                    state.feeds.unshift(feed)
                    state.posts.unshift(...posts)


                    state.urls.forEach((url) => {
                        sendRequestWithTimeout(
                            getUrlThroughProxy(url),
                            5000,
                            state,
                        )
                    })

                    state.ui.form.isSubmitting = false
                    state.ui.feedback = 'networkErrors.successful'
                })
                .catch((err) => {
                    state.ui.form.isSubmitting = false
                    state.ui.feedback = isAxiosError(err) ? 'networkErrors.networkErr' : err.message
                })
        }
    })

    const select = document.querySelector('#select')
    select?.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement
        state.ui.lng = target.value as 'ru' | 'en'
    })
}
const runApp = (): void => {
    const i18nextInstance = i18next.createInstance()

    i18nextInstance
        .init({
            lng: 'ru',
            debug: true,
            resources: {
                ru,
                en,
            },
        })
        .then(() => {
            app(i18nextInstance)
        })
        .catch((err) => err)
}



runApp()
