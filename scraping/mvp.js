import { writeDBFile, TEAMS } from '../db/index.js'
import { URLS, scrape } from './utils.js'

const MVP_SELECTORS = {
  team: { selector: '.fs-table-text_3', typeOf: 'string' },
  playerName: { selector: '.fs-table-text_4', typeOf: 'string' },
  gamesPlayed: { selector: '.fs-table-text_5', typeOf: 'number' },
  mvps: { selector: '.fs-table-text_6', typeOf: 'number' },
}

const getMvpList = async () => {
  const $ = await scrape(URLS.mvp)
  const $rows = $('table tbody tr')

  const getImageFromTeam = ({ name }) => {
    const { image } = TEAMS.find((team) => team.name === name)
    return image
  }

  const mvpSelectroEntries = Object.entries(MVP_SELECTORS)

  let mvpList = []
  $rows.each((index, el) => {
    const mvpEntries = mvpSelectroEntries.map(([key, { selector, typeOf }]) => {
      const cleanedValue = $(el).find(selector).text().trim()
      const value = typeOf === 'number' ? Number(cleanedValue) : cleanedValue

      return [key, value]
    })

    const { team: teamName, ...mvpData } = Object.fromEntries(mvpEntries)
    const image = getImageFromTeam({ name: teamName })

    mvpList.push({ ranking: index + 1, ...mvpData, team: teamName, image })
  })
  return mvpList
}

const mvpList = await getMvpList()

await writeDBFile('mvpList', mvpList)
