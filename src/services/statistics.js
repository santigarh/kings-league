import { apiURL } from './config'

export const getTopStatistics = async () => {
  try {
    const response = await fetch(`${apiURL}/top-statistics`)
    const topStatistics = await response.json()
    return topStatistics
  } catch (e) {
    return []
  }
}

export const getTopScorers = async () => {
  try {
    const response = await fetch(`${apiURL}/top-scorers`)
    const topScorers = await response.json()
    return topScorers
  } catch (e) {
    return []
  }
}

export const getTopAssists = async () => {
  try {
    const response = await fetch(`${apiURL}/top-assists`)
    const topAssists = await response.json()
    return topAssists
  } catch (e) {
    return []
  }
}

export const getMvps = async () => {
  try {
    const response = await fetch(`${apiURL}/mvp`)
    const mvps = await response.json()
    return mvps
  } catch (e) {
    return []
  }
}

export const getFirstPlayersStatistics = async () => {
  const topStatistics = await getTopStatistics()
  if (!topStatistics) return null
  const { mvp, topScorers, topAssists } = topStatistics
  const [firstMVP] = mvp
  const [firstTopScorer] = topScorers
  const [firstTopAssister] = topAssists

  return {
    mvp: firstMVP,
    topScorer: firstTopScorer,
    topAssister: firstTopAssister,
  }
}
