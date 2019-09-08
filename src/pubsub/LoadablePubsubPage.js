import Loadable from 'react-loadable'
import ComponentLoader from '../loader/ComponentLoader.js'

const LoadablePubsubPage = Loadable({
  loader: () => import('./PubsubPage'),
  loading: ComponentLoader
})

export default LoadablePubsubPage
