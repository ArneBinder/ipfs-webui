import React from 'react'
//import ReactFauxDOM from 'react-faux-dom'
//import { connect } from 'redux-bundler-react'
import { withTranslation } from 'react-i18next'

const Console = ({ t, log}) => {

	return (
   <div className='ph3 mb3'>
    <div className='fw2 tracked ttu f6 teal-muted mb2'>Console</div>
    <div id='console' ref={log} className='f7 db w-100 ph1 pv2 monospace input-reset ba b--black-20 border-box overflow-scroll' style={{height: '300em'}} >
    </div>
  </div>
  )
}

export default withTranslation('pubsub')(Console)
