import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const DB_PATH = path.join(process.cwd(), './db/')
const TEAMS = await readFile(`${DB_PATH}/teams.json`, 'utf-8').then(JSON.parse)

const URLS = {
  leaderBoard: 'https://kingsleague.pro/estadisticas/clasificacion/',
}

const scrape = async (url) => {
  const res = await fetch(url)
  const html = await res.text()

  return cheerio.load(html)
}

const getLeaderBoard = async () => {
  const $ = await scrape(URLS.leaderBoard)
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

  const getTeamFromName = ({ name }) => TEAMS.find((team) => team.name === name)

  const leaderBoardSelectorEntries = Object.entries(LEADERBOARD_SELECTORS)

  let leaderBoard = []
  $rows.each((_, el) => {
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

    leaderBoard.push({ ...leaderBoardForTeam, team })
  })
  return leaderBoard
}

const leaderBoard = await getLeaderBoard()

await writeFile(
  `${DB_PATH}/leaderboard.json`,
  JSON.stringify(leaderBoard, null, 2),
  'utf-8'
)
