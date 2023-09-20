import { Claimant, type RawClaimant } from '../model/Claimant'

export const getClaimants = () => {
  const currUrl = new URL(import.meta.url)
  /**
   * Use Fetch API to simulate retrieving a file from an actual served endpoint.
   *   currUrl points to this app's localhost environment.
   *
   * Since localhost urls can vary, there's a fallback `import` inside the catch statement,
   *   which wouldn't be necessary if we were in a real environment with a real server.
   *
   * If a fetch fails in a real environment, we try again up to a threshold of times, before reporting an error.
   * */
  return fetch(
    `${currUrl.protocol}//${currUrl.hostname}${
      currUrl.port ? ':' + currUrl.port : ''
    }/api-data.json`
  )
    .then((response) => {
      // Check if the request was successful
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json() // Parse the JSON response
    })
    .then((data) => {
      return data
    })
    .catch(async () => {
      console.warn('Fetch failed to find the sample data file. Importing it directly as a fallback')
      let claimants
      await import('@/../public/api-data.json').then((response) => {
        claimants = response.default
      })
      return claimants
    })
}

export const parseClaimants = (getClaimantsPromise: Promise<RawClaimant[]>) => {
  return getClaimantsPromise.then((claimants) => {
    return claimants.map((rawClaimant) => {
      return new Claimant(rawClaimant)
    })
  })
}

export const getParsedClaimants = () => {
  return parseClaimants(getClaimants()).then((parsedClaimants) => {
    return parsedClaimants
  })
}
