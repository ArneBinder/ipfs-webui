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

/*bundle.catchAndLog = (fn, log) => {
  return async (...args) => {
    try {
      await fn(...args)
    } catch (err) {
      console.error(err)
      log(`<span class="red">${err.message}</span>`)
    }
  }
}*/

bundle.doSubscribeTopic = (topic, nextTopic, log) => async ({ dispatch, getIpfs }) => {
  const ipfs = getIpfs()
  //let peerId = null
  // TODO: get peerId
  await ipfs.id(function (err, identity) {
    if (err) {
      throw err
    }
    console.log(identity.id)
    //return identity.id
  })

  // DEBUG
  ipfs.pubsub.ls((err, topics) => {
    if (err) {
      return console.error('failed to get list of subscription topics', err)
    }
    console.log('current subscriptions:')
    console.log(topics)
  })

  //const peerId = 'Qmc9jLqTwvdaSzcnhQknM6djjks8kyDC6asUCC6kMackYs'


  if (!nextTopic) throw new Error('Missing topic name')
  if (!ipfs) throw new Error('Connect to a node first')

  const lastTopic = topic

  // BUG: causes error
  /*if (lastTopic) {
    topic = null
    log(`Unsubscribing from topic ${lastTopic}`)
    await ipfs.pubsub.unsubscribe(lastTopic)
  }*/

  log(`Subscribing to ${nextTopic}...`)
  try {
    await ipfs.pubsub.subscribe(nextTopic, msg => {
      //log(nextTopic)
      //log(msg)
      //log('TEST0')
      const from = msg.from
      const seqno = msg.seqno.toString('hex')
      //if (from === peerId) return console.log(`Ignoring message ${seqno} from self`)
      log(`Message ${seqno} from ${from}:`)
      try {
        log(JSON.stringify(msg.data.toString(), null, 2))
      } catch (_) {
        log(msg.data.toString('hex'))
      }
      topic = nextTopic
    }, {
      onError: (err, fatal) => {
        if (fatal) {
          console.error(err)
          //log(`<span class="red">${err.message}</span>`)
          topic = null
          log('Resubscribing in 5s... (not implemented)')
          //setTimeout(bundle.catchAndLog(() => bundle.doSubscribeTopic(nextTopic), log), 5000)
        } else {
          console.warn(err)
        }
      }
    })
  } catch (err) {
    return dispatch({
      type: 'PUBSUB_SUBSCRIBE_FAILED',
      payload: { nextTopic, error: err }
    })
  }

  //topic = nextTopic
  //log(`<span class="green">Success!</span>`)
  //return topic
  dispatch({ type: 'PUBSUB_SUBSCRIBE_FINISHED', payload: { topic } })
}

bundle.doSend = (msg, topic, log) => async ({ dispatch, getIpfs }) => {
  const ipfs = getIpfs()

  if (!msg) throw new Error('Missing message')
  if (!topic) throw new Error('Subscribe to a topic first')
  if (!ipfs) throw new Error('Connect to a node first')

  log(`Sending message to ${topic}...`)
  await ipfs.pubsub.publish(topic, msg)
  //log(`<span class="green">Success!</span>`)
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
