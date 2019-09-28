import React from 'react'
import { connect } from 'redux-bundler-react'
import { Helmet } from 'react-helmet'
import { withTranslation } from 'react-i18next'
//import ReactJoyride from 'react-joyride'
//import withTour from '../components/tour/withTour'
//import { peersTour } from '../lib/tours'

// Components
import Box from '../components/box/Box'
//import WorldMap from './WorldMap/WorldMap'
//import PeersTable from './PeersTable/PeersTable'
import Subscribe from './Subscribe/Subscribe'
import Send from './Send/Send'
import Console from './Console/Console'
import AddConnection from '../peers/AddConnection/AddConnection'

//let logRef = React.createRef()
//let topic = React.createRef()


/*const getLogger = outEl => {
  outEl.innerHTML = ''
  return message => {
    const container = document.createElement('div')
    container.innerHTML = message
    outEl.appendChild(container)
    outEl.scrollTop = outEl.scrollHeight
  }
}

let log = getLogger(logRef.current)*/
class PubsubPage extends React.Component {
//const PubsubPage = ({ t, toursEnabled, handleJoyrideCallback }) => (
	constructor(props) {
		super(props)
		//this.logRef = React.createRef()
		this.state = {
			topic: null,
			log: null
			//logRef: React.createRef()
		}
	}

	setLogCallback = (log) => {
		this.setState({log: log})
	}
	setTopicCallback = (topic)=> {
		this.setState({topic: topic})
	}

	render () {
		const { t } = this.props

		return (
		  <div data-id='PubsubPage'>
		    <Helmet>
		      <title>{t('title')} - IPFS</title>
		    </Helmet>

		    <div className='flex justify-end mb3'>
		      <AddConnection />
		    </div>

		    <Box className='pt3 ph3 pb4'>
		      <Subscribe log={this.state.log} setTopic={this.setTopicCallback}/>
		      <Send log={this.state.log} topic={this.state.topic}/>
		      <Console setLog={this.setLogCallback} />
		    </Box>

		  </div>
		)
	}
}

export default connect(
  'selectToursEnabled',
  withTranslation('pubsub')(PubsubPage)
)
