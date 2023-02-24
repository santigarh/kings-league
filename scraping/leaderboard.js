import { TEAMS, PRESIDENTS } from '../db/index.js'

export const getLeaderboard = async ($) => {
  const $rows = $('table tbody tr')

  const LEADERBOARD_SELECTORS = {
    team: { selector: '.fs-table-text_3', typeOf: 'string' },
    victories: { selector: '.fs-table-text_4', typeOf: 'number' },
    loses: { selector: '.fs-table-text_5', typeOf: 'number' },
    scoredGoals: { selector: '.fs-table-text_6', typeOf: 'number' },
    concededGoals: { selector: '.fs-table-text_7', typeOf: 'number' },
    yellowCards: { selector: '.fs-table-text_8', typeOf: 'number' },
    redCards: { selector: '.fs-table-text_9', typeOf: 'number' },
  }

  const getTeamFromName = ({ name }) => {
    const { presidentId, ...restOfTeam } = TEAMS.find(
      (team) => team.name === name
    )
    const president = PRESIDENTS.find(
      (president) => president.id === presidentId
    )

    return { ...restOfTeam, president }
  }

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  let leaderboard = []
  $rows.each((index, el) => {
    const leaderBoardEntries = leaderBoardSelectorEntries.map(
      ([key, { selector, typeOf }]) => {
        const cleanedValue = $(el).find(selector).text().trim()
        const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue
        return [key, value]
      }
    )

    const { team: teamName, ...leaderBoardForTeam } =
      Object.fromEntries(leaderBoardEntries)
    const team = getTeamFromName({ name: teamName })

    leaderboard.push({ ...leaderBoardForTeam, team, rank: index + 1 })
  })
  return leaderboard
}
