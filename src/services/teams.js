export const getAllTeams = async () => {
  try {
    const response = await fetch(
      'https://kinsgleague.santigarh-77.workers.dev/teams'
    )
    const teams = await response.json()

    return teams
  } catch (e) {
    //enviar error en reporte de errores
    return []
  }
}
