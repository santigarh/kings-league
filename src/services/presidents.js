export const findPresidentBy = async ({ id }) => {
  try {
    const response = await fetch(
      `https://kinsgleague.santigarh-77.workers.dev/presidents/${id}`
    )
    const president = await response.json()

    return president
  } catch (e) {
    //enviar error en reporte de errores
    return null
  }
}
