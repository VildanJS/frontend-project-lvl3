import './scss/styles.scss'
import 'bootstrap'

import i18next, { type i18n } from 'i18next'
import { getUrlThroughProxy } from '@/utils/proxy'
import { type State } from './types'
import { createState } from '@/view'
import ru from '@/locales/ru.json'
import en from '@/locales/en.json'
import { sendRequestWithTimeout } from '@/utils/sendRequestWithTimeout'
import { validate } from '@/validator'
import axios, { isAxiosError } from 'axios'
import { parser } from '@/utils/parser'
import { updateContent } from '@/view/render/updateContent'

const rootElement = document.querySelector('#app') as HTMLDivElement
rootElement.innerHTML = `
<div class='m-0 position-absolute align-self-end'>
  <select id='select' class='form-select text-white bg-dark' aria-label='Default select example'>
    <option value='ru' selected>Русский</option>
    <option value='en'>English</option>
  </select>
</div>
<div class='d-flex flex-column min-vh-100'>
  <div class='modal fade' id='modal' tabindex='-1' role='dialog' aria-labelledby='modal' aria-hidden='true'>
      <div class='modal-dialog' role='document'>
          <div class='modal-content'>
              <div class='modal-header'><h5 class='modal-title'></h5>
                  <button type='button' class='btn-close close' data-bs-dismiss='modal' aria-label='Close'></button>
              </div>
              <div class='modal-body text-break'></div>
              <div class='modal-footer'><a data-i18n='buttons.read' class='btn btn-primary full-article' href='#' role='button' target='_blank'
                                           rel='noopener noreferrer'></a>
                  <button data-i18n='buttons.close' type='button'  class='btn btn-secondary' data-bs-dismiss='modal'></button>
              </div>
          </div>
      </div>
  </div>
  
  <main class='flex-grow-1'>
      <section class='container-fluid  bg-dark p-5' >
          <div class='row'>
              <div class='col-md-10 col-lg-8 mx-auto text-white'>
                  <h1 data-i18n='text.head' class='display-3 mb-0'>RSS агрегатор</h1>
                  <p data-i18n='text.description' class='lead'>Начните читать RSS сегодня! Это легко, это красиво.</p>
                  <form action='' class='rss-form text-body'>
                      <div class='row'>
                          <div class='col'>
                              <div class='form-floating'>
                              <input id='url-input' 
                              autofocus required 
                              name='url' aria-label='url' 
                              class='form-control w-100'  placeholder='ссылка RSS' 
                              autocomplete='off'>
                              <label data-i18n='text.placeholder' for='url-input'>Ссылка RSS</label></div>
                          </div>
                          <div class='col-auto'>
                              <button id='add' data-i18n='buttons.add' type='submit' aria-label='add' class='h-100 btn btn-lg btn-primary px-sm-5'>Добавить</button>
                          </div>
                      </div>
                  </form>
                  <p data-i18n='text.example' data-bs-theme='dark' class='example mt-2 mb-0 text-muted'></p>
                  <p data-i18n='validationErrors.noError' class='feedback m-0 position-absolute small text-danger'></p></div>
          </div>
      </section>
      <section class='container-fluid container-xxl p-5'>
          <div class='row'>
              <div class='col-md-10 col-lg-8 order-1 mx-auto posts'></div>
              <div class='col-md-10 col-lg-4 mx-auto order-0 order-lg-1 feeds'></div>
          </div>
      </section>
  </main>
  
  <footer class='footer border-top py-3 mt-5 bg-light'>
      <div class='container-xl'>
        <div class='text-center' data-i18n='copyright'></div>
      </div>
  </footer>
</div>
`

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
            .then((res) => {
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

runApp()
