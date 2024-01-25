import { store } from '../_store/store.js'
import { goto } from '../../../__sapper__/client.js'

export function addLanguage () {
  const { languages, newLanguage } = store.get()
  languages.push(newLanguage.toLowerCase().trim())
  store.set({ languages })
  store.save()
  goto('/settings/languages')
}

export function resetNewLanguage() {
  const newLanguage = ''
  store.set({ newLanguage })
  store.save()
}
