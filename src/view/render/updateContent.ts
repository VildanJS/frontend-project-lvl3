import type ru from '@/locales/ru.json'

type UnionToIntersection<U> = (
    U extends unknown ? (k: U) => void : never
) extends (k: infer I) => void
    ? I
    : never
const keySeparator = '.'
export type RecursiveKeyOf<TObj extends Record<string, unknown>> = {
    [TKey in keyof TObj & (string | number)]: TObj[TKey] extends unknown[]
        ? `${TKey}`
        : TObj[TKey] extends Record<string, unknown>
        ? `${TKey}${typeof keySeparator}${RecursiveKeyOf<TObj[TKey]>}`
        : `${TKey}`
}[keyof TObj & (string | number)]

export type FlattenTypedKey = UnionToIntersection<typeof ru.translation>
export type TranslationKey = RecursiveKeyOf<FlattenTypedKey>
export type ValidationErrors =
    `validationErrors${typeof keySeparator}${keyof typeof ru.translation.validationErrors}`
export type NetworkErrors =
    `networkErrors${typeof keySeparator}${keyof typeof ru.translation.networkErrors}`

export function updateContent(
    t: any,
    elements: NodeListOf<Element> | null,
): void {
    const NAME = 'VildanJS'

    elements?.forEach((element) => {
        const attributeValue = element.getAttribute(
            'data-i18n',
        ) as TranslationKey
        if (attributeValue != null) {
            if (attributeValue === 'copyright') {
                element.innerHTML = t('copyright', { name: NAME })
            } else {
                element.textContent = t(attributeValue)
            }
        }
    })
}
