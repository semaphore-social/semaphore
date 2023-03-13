import MediaAltDialog from '../components/MediaAltDialog.html'
import { showDialog } from './showDialog.js'

export default function showMediaAltDialog (description) {
  return showDialog(MediaAltDialog, {
    label: 'ASKASKLAALAAABEL',
    description
  })
}
