import * as cheerio from 'cheerio'
import { logError, logSuccess, logInfo } from './log.js'
import { writeDBFile } from '../db/index.js'
import { getLeaderboard } from './leaderboard.js'
import { getMvpList } from './mvp.js'
import { getTopScoresList } from './top_scorer.js'
import { getAssists } from './top_assists.js'

export const SCRAPINGS = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: getLeaderboard,
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvpList,
  },
  top_scorers: {
    url: 'https://kingsleague.pro/estadisticas/goles/',
    scraper: getTopScoresList,
  },
  top_assists: {
    url: 'https://kingsleague.pro/estadisticas/asistencias/',
    scraper: getAssists,
  },
}

export const cleanText = (text) =>
  text
    .replace(/\t|\n|\s:/g, '')
    .replace(/.*:/g, ' ')
    .trim()

export async function scrape(url) {
  const res = await fetch(url)
  const html = await res.text()
  return cheerio.load(html)
}

export async function scrapeAndSave(name) {
  const start = performance.now()
  try {
    const { scraper, url } = SCRAPINGS[name]

    const $ = await scrape(url)
    logInfo(`Scrapping [${name}] list.. `)
    const content = await scraper($)
    await writeDBFile(name, content)
    logSuccess(`[${name}]  written successfully`)
  } catch (e) {
    logError(`Error scrapin [${name}]`)
    logError(e)
  } finally {
    const end = performance.now()
    const time = (end - start) / 100
    logInfo(`[${name}] scraped in ${time} seconds`)
  }
}
