import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'

const STATICS_PATH = path.join(process.cwd(), './assets/static/presidents/')
const DB_PATH = path.join(process.cwd(), './db/')
const RAW_PRESIDENTS = await readFile(
  `${DB_PATH}/raw_presidents.json`,
  'utf-8'
).then(JSON.parse)

const presidents = await Promise.all(
  RAW_PRESIDENTS.map(async (presidentInfo) => {
    const { slug: id, title, _links: links } = presidentInfo
    const { rendered: name } = title
    const { 'wp:attachment': attachment } = links
    const { href: image } = attachment[0]

    const responseImageEndpoint = await fetch(image)
    const data = await responseImageEndpoint.json()
    const [imageInfo] = data
    const {
      guid: { rendered: imageUrl },
    } = imageInfo

    const fileExtension = imageUrl.split('.').at(-1)

    const responseImage = await fetch(imageUrl)
    const arrayBuffer = await responseImage.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const imageFileName = `${id}.${fileExtension}`

    await writeFile(`${STATICS_PATH}/${imageFileName}`, buffer)

    return { id, name, image: imageFileName, teamId: 0 }
  })
)

await writeFile(
  `${DB_PATH}/presidents.json`,
  JSON.stringify(presidents, null, 2),
  'utf-8'
)
