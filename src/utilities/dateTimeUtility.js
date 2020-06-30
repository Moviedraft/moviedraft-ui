import { apiGet } from '../utilities/apiUtility.js'

export const getCurrentTime = async() => {
  return apiGet('games/time')
}
