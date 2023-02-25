export const isDevelopment = import.meta.env.Mode !== 'production'

export const apiURL = isDevelopment
  ? 'http://localhost:8787'
  : 'https://kinsgleague.santigarh-77.workers.dev'
