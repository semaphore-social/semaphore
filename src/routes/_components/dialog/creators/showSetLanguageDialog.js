import SetLanguageDialog from '../components/SetLanguageDialog.html'
import { showDialog } from './showDialog.js'

export default function showSetLanguageDialog (realm) {
  return showDialog(SetLanguageDialog, {
    label: 'intl.setLanguage',
    title: 'intl.setLanguage',
    realm
  })
}
