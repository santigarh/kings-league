import { apiURL } from './config'

export const findPresidentBy = async ({ id }) => {
  try {
    const response = await fetch(`${apiURL}/presidents/${id}`)
    const president = await response.json()

    return president
  } catch (e) {
    //enviar error en reporte de errores
    return null
  }
}
