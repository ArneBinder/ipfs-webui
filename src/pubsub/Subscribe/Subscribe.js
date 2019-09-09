import React from 'react'
//import ReactFauxDOM from 'react-faux-dom'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'
//import { sleep, Logger, catchAndLog } from './../util'


//const Subscribe = ({ t }) => {
class Subscribe extends React.Component {

	state = {
		currentTopic: this.props.topic,
		nextTopic: null
	}

	getLogger = outEl => {
	  outEl.innerHTML = ''
	  return message => {
	    const container = document.createElement('div')
	    container.innerHTML = message
	    outEl.appendChild(container)
	    outEl.scrollTop = outEl.scrollHeight
		}
	}

	catchAndLog = (fn, log) => {
	  return async (...args) => {
	    try {
	      await fn(...args)
	    } catch (err) {
	      console.error(err)
	      log(`<span class="red">${err.message}</span>`)
	    }
	  }
	}

	onChange = (event) => {
    let val = event.target.value
    this.setState({ nextTopic: val })
  }

	subscribe = (e) => {
		let log = this.getLogger(this.props.log.current)
		let topic = this.props.doSubscribeTopic(this.state.currentTopic, this.state.nextTopic, log)
		this.setState({ currentTopic: topic })
		//this.catchAndLog(() => this.props.doSubscribeTopic(this.state.currentTopic, this.state.nextTopic, log), log)
		e.preventDefault()
	}

	render () {
		//const { t, topic } = this.props

		return (
		   <div className='ph3 mb3'>
		    <div className='fw2 tracked ttu f6 teal-muted mb2'>Subscribe to pubsub topic</div>
		    <input id='topic' onChange={this.onChange} ref={this.props.topic} className='dib w-50 ph1 pv2 monospace input-reset ba b--black-20 border-box' placeholder='e.g. books' />
		    <button id='subscribe' onClick={this.subscribe} className='dib ph3 pv2 input-reset ba b--black-20 border-box' >Subscribe</button>
		  </div>
	  )
	}
}

//export default subscribe('doConnectSwarm', withTranslation('pubsub')(Subscribe))
export default connect('doSubscribeTopic', withTranslation('peers')(Subscribe))
//export default withTranslation('pubsub')(Subscribe)
