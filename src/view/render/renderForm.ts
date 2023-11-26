import { type Elements } from '@/types'
import { type i18n } from 'i18next'

export const renderForm = (
    value: boolean,
    i18n: i18n,
    elements: Elements,
    path: string,
): void => {
    const {
        root: formElement,
        input: inputElement,
        addButton: submitButton,
    } = elements.form

    if (formElement === null || inputElement === null || submitButton === null)
        return

    switch (path) {
        case 'ui.form.isValid':
            if (!value) {
                inputElement.classList.add('is-invalid')
            } else {
                inputElement.classList.remove('is-invalid')
            }
            break
        case 'ui.form.isSubmitting':
            if (value) {
                inputElement.setAttribute('readonly', String(true))
                formElement.setAttribute('disabled', String(true))
                submitButton.setAttribute('disabled', String(true))
            } else {
                inputElement.removeAttribute('readonly')
                formElement.removeAttribute('disabled')
                submitButton.removeAttribute('disabled')

                formElement.reset()
                inputElement.focus()
            }
            break
    }
}
