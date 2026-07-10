import { listSongs } from '../../utils/songs'

export default defineEventHandler(async () => {
  return listSongs()
})
