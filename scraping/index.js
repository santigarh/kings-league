import fetch from 'node-fetch'
import * as cheerio from 'cheerio'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'

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
    leaderBoard.push(Object.fromEntries(leaderBoardEntries))
  })
  return leaderBoard
}

const leaderBoard = await getLeaderBoard()

const filePath = path.join(process.cwd(), 'db/leaderBoard.json')
await writeFile(filePath, JSON.stringify(leaderBoard, null, 2), 'utf-8')
