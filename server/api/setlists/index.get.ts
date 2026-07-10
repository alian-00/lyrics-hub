import { listSetlists } from '../../utils/setlists'

export default defineEventHandler(async () => {
  return listSetlists()
})
