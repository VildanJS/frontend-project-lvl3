import * as yup from 'yup'

export const validate = (text: string, urls: string[]): Promise<string> => {
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

  const urlSchema = yup
    .string()
    .required()
    .url()
    .notOneOf(urls?.map((url) => url))


  return urlSchema.validate(text)

}
