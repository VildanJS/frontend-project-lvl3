import { type Post } from '@/utils/parser'
import { type State } from '@/types'

export const renderModal = (post: Post, state: State): void => {
  const {link: modalLink, body: modalBody, title: modalTitle} = state.ui.elements.modal

  if(modalLink == null || modalBody == null || modalTitle == null) return

  const {title, description, link} = post

  modalTitle.textContent = title ?? '';
  modalBody.textContent = description ?? '';
  modalLink.href = link ?? '';
}
