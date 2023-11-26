import { type i18n } from 'i18next'
import {
    type NetworkErrors,
    type ValidationErrors,
} from '@/view/render/updateContent'
import { type Elements } from '@/types'

export const renderFeedback = (
    value: ValidationErrors | NetworkErrors,
    i18n: i18n,
    elements: Elements,
): void => {
    const { feedback } = elements

    if (feedback === null) return

    feedback.innerHTML = i18n.t(value)

    if (
        value === 'validationErrors.noError' ||
        value === 'networkErrors.successful' ||
        value === 'networkErrors.pending'
    ) {
        feedback.classList.remove('text-danger')
        feedback.classList.add('text-success')
    } else {
        feedback.classList.remove('text-success')
        feedback.classList.add('text-danger')
    }
}
