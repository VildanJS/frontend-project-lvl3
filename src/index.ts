import './scss/styles.scss'
import 'bootstrap'

import axios, { isAxiosError } from 'axios'
import i18next, { type i18n } from 'i18next'
import * as yup from 'yup'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'
import { type Elements, type State } from 'types'

import { getUrlThroughProxy } from '@/utils/getUrlThroughProxy'
import { createState } from '@/view'
import { sendRequestWithTimeout } from '@/utils/sendRequestWithTimeout'
import { validate } from '@/validate'
import { parseXmlData } from '@/utils/parseXmlData'
import { updateContent } from '@/view/render/updateContent'


const app = (i18n: i18n): void => {
    const elements: Elements = {
        form: {
            root: document.querySelector<HTMLFormElement>('.rss-form'),
                input: document.querySelector<HTMLInputElement>(
                '#url-input',
            ),
                addButton:
            document.querySelector<HTMLButtonElement>('#add'),
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
    }
    const initialState: State = {
        urls: [],
        posts: [],
        feeds: [],
        ui: {
            feedback: 'validationErrors.noError',
            form: {
                isSubmitting: false,
                isValid: true,
            },
            lng: 'ru',
        },
    }
    const state = createState(initialState, i18n, elements)

    const { i18n: i18nElements } = elements

    updateContent(i18n.t, i18nElements)

    const { root: form, input } = elements.form
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
        const value = formData.get('url')
        if (state.ui.form.isValid) {
            state.ui.form.isSubmitting = true
            state.ui.feedback = 'networkErrors.pending'
            if(value !== null) {
                axios
                    .get(String(getUrlThroughProxy(value)))
                    .then(({ data }) => {
                        const [feed, posts] = parseXmlData(data.contents)
                        state.urls.push(String(value))
                        state.feeds.unshift(feed)
                        state.posts.unshift(...posts)

                        state.urls.forEach((url) => {
                            sendRequestWithTimeout(
                                String(getUrlThroughProxy(url)),
                                5000,
                                state,
                            )
                        })

                        state.ui.form.isSubmitting = false
                        state.ui.feedback = 'networkErrors.successful'
                    })
                    .catch((err) => {
                        state.ui.form.isSubmitting = false
                        state.ui.feedback = isAxiosError(err)
                            ? 'networkErrors.networkErr'
                            : err.message
                    })
            }

        }
    })

    const select = document.querySelector('#select')
    select?.addEventListener('change', (e) => {
        const target = e.target as HTMLSelectElement
        state.ui.lng = target.value as 'ru' | 'en'
    })
}
const runApp = (): void => {
    yup.setLocale({
        mixed: {
            default: () => 'validationErrors.invalidRss',
            notOneOf: () => 'validationErrors.duplicate',
            required: () => 'validationErrors.empty'
        },
        string: {
            url: () => 'validationErrors.urlValidError',
        },
    });

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
