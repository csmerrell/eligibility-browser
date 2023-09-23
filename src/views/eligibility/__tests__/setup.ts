import { createPinia } from 'pinia'

export const pinia = createPinia()

export const global = {
  plugins: [pinia]
}
export default pinia
