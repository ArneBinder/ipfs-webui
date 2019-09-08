import { createAsyncResourceBundle, createSelector } from 'redux-bundler'
import ms from 'milliseconds'

const bundle = createAsyncResourceBundle({
  name: 'peers',
  actionBaseType: 'PEERS',
  getPromise: ({ getIpfs }) => getIpfs().swarm.peers({ verbose: true }),
  staleAfter: ms.seconds(10),
  persist: false,
  checkIfOnline: false
})

bundle.selectPeersCount = createSelector(
  'selectPeers',
  (peers) => {
    if (!Array.isArray(peers)) return 0
    return peers.length
  }
)

bundle.doConnectSwarm = addr => async ({ dispatch, getIpfs }) => {
  dispatch({ type: 'SWARM_CONNECT_STARTED', payload: { addr } })
  const ipfs = getIpfs()

  try {
    await ipfs.swarm.connect(addr)
  } catch (err) {
    return dispatch({
      type: 'SWARM_CONNECT_FAILED',
      payload: { addr, error: err }
    })
  }

  dispatch({ type: 'SWARM_CONNECT_FINISHED', payload: { addr } })
}

bundle.doSubscribeTopic = (topic, nextTopic, log) => async ({ dispatch, getIpfs }) => {
  const ipfs = getIpfs()
  /* TODO: get peerId
  ipfs.id(function (err, identity) {
    if (err) {
      throw err
    }
    console.log(identity.id)
  })
  */


  if (!nextTopic) throw new Error('Missing topic name')
  if (!ipfs) throw new Error('Connect to a node first')

  const lastTopic = topic

  if (topic) {
    topic = null
    log(`Unsubscribing from topic ${lastTopic}`)
    await ipfs.pubsub.unsubscribe(lastTopic)
  }

  log(`Subscribing to ${nextTopic}...`)

  await ipfs.pubsub.subscribe(nextTopic, msg => {
    //console.log('TEST0')
    const from = msg.from
    console.log(from)
    const seqno = msg.seqno.toString('hex')
    //if (from === peerId) return console.log(`Ignoring message ${seqno} from self`)
    log(`Message ${seqno} from ${from}:`)
    try {
      log(JSON.stringify(msg.data.toString(), null, 2))
    } catch (_) {
      log(msg.data.toString('hex'))
    }
  }, {
    onError: (err, fatal) => {
      if (fatal) {
        console.error(err)
        log(`<span class="red">${err.message}</span>`)
        topic = null
        log('Resubscribing in 5s... (not implemented)')
        //setTimeout(catchAndLog(() => subscribe(nextTopic), log), 5000)
      } else {
        console.warn(err)
      }
    }
  })

  topic = nextTopic
  log(`<span class="green">Success!</span>`)
  return topic
}

bundle.doSend = (msg, topic, log) => async ({ dispatch, getIpfs }) => {
  const ipfs = getIpfs()

  if (!msg) throw new Error('Missing message')
  if (!topic) throw new Error('Subscribe to a topic first')
  if (!ipfs) throw new Error('Connect to a node first')

  log(`Sending message to ${topic}...`)
  await ipfs.pubsub.publish(topic, msg)
  log(`<span class="green">Success!</span>`)
}

// Update the peers if they are stale (appTime - lastSuccess > staleAfter)
bundle.reactPeersFetchWhenIdle = createSelector(
  'selectPeersShouldUpdate',
  'selectIpfsConnected',
  (shouldUpdate, ipfsConnected) => {
    if (shouldUpdate && ipfsConnected) {
      return { actionCreator: 'doFetchPeers' }
    }
  }
)

// Get the peers frequently when we're on the peers page
bundle.reactPeersFetchWhenActive = createSelector(
  'selectAppTime',
  'selectRouteInfo',
  'selectPeersRaw',
  'selectIpfsConnected',
  (appTime, routeInfo, peersInfo, selectIpfsReady, ipfsConnected) => {
    const lastSuccess = peersInfo.lastSuccess || 0
    if (routeInfo.url === '/peers' && ipfsConnected && !peersInfo.isLoading && appTime - lastSuccess > ms.seconds(5)) {
      return { actionCreator: 'doFetchPeers' }
    }
  }
)

export default bundle
