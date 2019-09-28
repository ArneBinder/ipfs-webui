import React from 'react'
//import ReactFauxDOM from 'react-faux-dom'
//import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'

//const Console = ({ t, log}) => {
class Console extends React.Component {

	constructor(props){
		super(props)
		//console.log(props)
		this.logRef = React.createRef()

	}

	componentDidMount(){
		//this.props.state.log = this.getLogger(this.props.state.logRef.current)
		this.props.setLog(this.getLogger(this.logRef.current));
		//console.log(this.props.state.log)
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

	render () {

		//const { state } = this.props

		return (
	   <div className='ph3 mb3'>
	    <div className='fw2 tracked ttu f6 teal-muted mb2'>Console</div>
	    <div id='console' ref={this.logRef} className='f7 db w-100 ph1 pv2 monospace input-reset ba b--black-20 border-box overflow-scroll' style={{height: '300em'}} >
	    </div>
	  </div>
	  )
	}
}

export default withTranslation('pubsub')(Console)
