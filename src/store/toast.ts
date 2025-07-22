import { atom } from 'nanostores'

interface ToastItem {
  id: string,
  icon?: string,
  content: string,
  delay?: number
}

const MAX_TOAST_ITEMS = 3
export const toastItems = atom<ToastItem[]>([])

export const addToastItem = ({id, icon, content, delay }: ToastItem) => {
  if (!id || !content) {
    throw new Error('Missing parameters. Toast item requires id and the content.')
  }

  const clone = toastItems.get().slice()
  clone.unshift({ id, content, icon: icon || 'info' })

  // Ensure it does not have more than the max number of items.
  toastItems.set(clone.slice(0, MAX_TOAST_ITEMS))
  setTimeout(() => {
    removeToastItem(id)
  }, delay || 2000)
}

export const removeToastItem = (id: string) => {
  toastItems.set(toastItems.get().filter(item => item.id !== id))
}

export const clearToast = () => {
  toastItems.set([])
}
