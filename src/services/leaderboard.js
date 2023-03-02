import { apiURL } from './config'

export const findLeaderboardBy = async ({ teamId }) => {
  try {
    const response = await fetch(`${apiURL}/leaderboard/${teamId}`)
    const teamStats = await response.json()
    return teamStats
  } catch (e) {
    return []
  }
}

export const getLeaderboard = async () => {
  try {
    const response = await fetch(`${apiURL}/leaderboard`)
    const leaderboard = await response.json()
    return leaderboard
  } catch (e) {
    return []
  }
}
