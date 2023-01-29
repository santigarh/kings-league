import * as cheerio from 'cheerio'
import { logError, logSuccess, logInfo } from './log.js'
import { writeDBFile } from '../db/index.js'
import { getLeaderBoard } from './leaderboard.js'
import { getMvpList } from './mvp.js'

export const SCRAPINGS = {
  leaderboard: {
    url: 'https://kingsleague.pro/estadisticas/clasificacion/',
    scraper: getLeaderBoard,
  },
  mvp: {
    url: 'https://kingsleague.pro/estadisticas/mvp/',
    scraper: getMvpList,
  },
}

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
