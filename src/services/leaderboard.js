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
