import { type Post } from 'utils/parseXmlData'
import { type Elements } from '@/types'

export const renderModal = (post: Post, elements: Elements): void => {
  const {link: modalLink, body: modalBody, title: modalTitle} = elements.modal

  if(modalLink == null || modalBody == null || modalTitle == null) return

  const {title, description, link} = post

  modalTitle.textContent = title ?? '';
  modalBody.textContent = description ?? '';
  modalLink.href = link ?? '';
}
