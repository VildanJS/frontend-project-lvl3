import { type Feed, type Post } from 'utils/parseXmlData'
import { type ValidationErrors, type NetworkErrors } from '@/view/render/updateContent'

export interface Data {
    contents: string
    status: Status
}

export interface Status {
    url: string
    content_type: string
    content_length: number
    http_code: number
    response_time: number
}

interface Ui {
    lng: 'ru' | 'en'
    form: {
        isValid: boolean
        isSubmitting: boolean
    }

    feedback: ValidationErrors | NetworkErrors
}

export interface Elements {
    posts: HTMLDivElement | null
    feeds: HTMLDivElement | null
    i18n: NodeListOf<Element> | null
    form: {
        root:  HTMLFormElement | null
        input: HTMLInputElement | null
        addButton: HTMLButtonElement | null,
    },
    feedback: HTMLParagraphElement | null
    modal: {
        root: HTMLDivElement | null
        title: HTMLHeadingElement | null
        body: HTMLParagraphElement | null
        link: HTMLAnchorElement | null
    }
}

export interface State {
    ui: Ui
    urls: string[]
    posts: Post[]
    feeds: Feed[]
}
