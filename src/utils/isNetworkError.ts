import { type AxiosError } from 'axios'

export const isNetworkError = (err: AxiosError): boolean => {
  return err.isAxiosError && (err.response == null);
}
