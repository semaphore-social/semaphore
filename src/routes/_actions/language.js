import { store } from '../_store/store.js'

export function setLanguage (realm, language) {
  store.setComposeData(realm, { language })
}
