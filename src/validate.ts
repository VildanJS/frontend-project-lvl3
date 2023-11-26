import * as yup from 'yup'

export const validate = (text: string, urls: string[]): Promise<string> => {

  const urlSchema = yup
    .string()
    .required()
    .url()
    .notOneOf(urls?.map((url) => url))


  return urlSchema.validate(text)

}
