import React from 'react'
//import ReactFauxDOM from 'react-faux-dom'
import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'

class Send extends React.Component {

	state = {
		message: null
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

	onChange = (event) => {
    let val = event.target.value
    this.setState({ message: val })
  }

	send = (e) => {
		let log = this.getLogger(this.props.log.current)
		this.props.doSend(this.state.message, this.props.topic.current.value, log)
		//this.setState({ currentTopic: topic })
		e.preventDefault()
	}

	render () {
		//const { t } = this.props
		return (
	   <div className='ph3 mb3'>
	    <div className='fw2 tracked ttu f6 teal-muted mb2'>Send pubsub message</div>
	    <input id='message' onChange={this.onChange} className='dib w-50 ph1 pv2 monospace input-reset ba b--black-20 border-box' />
	    <button id='send' onClick={this.send} className='dib ph3 pv2 input-reset ba b--black-20 border-box'>Send</button>
	  </div>
	  )
	}
}



//export default withTranslation('pubsub')(Send)
export default connect('doSend', withTranslation('peers')(Send))
