export const findLeaderboardBy = async ({ teamId }) => {
  try {
    const response = await fetch(
      `https://kinsgleague.santigarh-77.workers.dev/leaderboard/${teamId}`
    )
    const teamStats = await response.json()
    return teamStats
  } catch (e) {
    return []
  }
}
