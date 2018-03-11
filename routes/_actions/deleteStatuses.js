import { getIdsThatRebloggedThisStatus, getNotificationIdsForStatuses } from './statuses'
import { store } from '../_store/store'
import { scheduleIdleTask } from '../_utils/scheduleIdleTask'
import { database } from '../_database/database'
import forEach from 'lodash/forEach'
import isEqual from 'lodash/isEqual'

function filterItemIdsFromTimelines (instanceName, timelineFilter, idFilter) {
  let keys = ['timelineItemIds', 'itemIdsToAdd']

  keys.forEach(key => {
    let timelineData = store.getAllTimelineData(instanceName, key)
    forEach(timelineData, (ids, timelineName) => {
      if (!timelineFilter(timelineName)) {
        return
      }
      let filteredIds = ids.filter(idFilter)
      if (!isEqual(ids, filteredIds)) {
        store.setForTimeline(instanceName, timelineName, {
          [key]: filteredIds
        })
      }
    })
  })
}

function deleteStatusIdsFromStore (instanceName, idsToDelete) {
  let idsToDeleteSet = new Set(idsToDelete)
  let idWasNotDeleted = id => !idsToDeleteSet.has(id)
  let notNotificationTimeline = timelineName => timelineName !== 'notifications'

  filterItemIdsFromTimelines(instanceName, notNotificationTimeline, idWasNotDeleted)
}

function deleteNotificationIdsFromStore (instanceName, idsToDelete) {
  let idsToDeleteSet = new Set(idsToDelete)
  let idWasNotDeleted = id => !idsToDeleteSet.has(id)
  let isNotificationTimeline = timelineName => timelineName === 'notifications'

  filterItemIdsFromTimelines(instanceName, isNotificationTimeline, idWasNotDeleted)
}

async function deleteStatusesAndNotifications (instanceName, statusIdsToDelete, notificationIdsToDelete) {
  deleteStatusIdsFromStore(instanceName, statusIdsToDelete)
  deleteNotificationIdsFromStore(instanceName, notificationIdsToDelete)
  await database.deleteStatusesAndNotifications(instanceName, statusIdsToDelete, notificationIdsToDelete)
}

async function doDeleteStatus (instanceName, statusId) {
  console.log('deleting statusId', statusId)
  let rebloggedIds = await getIdsThatRebloggedThisStatus(instanceName, statusId)
  let statusIdsToDelete = Array.from(new Set([statusId].concat(rebloggedIds).filter(Boolean)))
  let notificationIdsToDelete = Array.from(new Set(await getNotificationIdsForStatuses(instanceName, statusIdsToDelete)))
  await deleteStatusesAndNotifications(instanceName, statusIdsToDelete, notificationIdsToDelete)
}

export function deleteStatus (instanceName, statusId) {
  scheduleIdleTask(() => {
    /* no await */ doDeleteStatus(instanceName, statusId)
  })
}
