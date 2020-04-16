import React from 'react'
import { Redirect } from '@reach/router'
import moment from 'moment'

class PrivateRoute extends React.Component {
  render() {
    const { component: Component, location, ...rest } = this.props

    if (localStorage.getItem('CouchSportsToken') == null || moment() > moment(localStorage.getItem('CouchSportsTokenExpiry'))) {
      localStorage.clear()
      return <Redirect to='/' noThrow />
    }

    return <Component {...rest} />
  }
}

export default PrivateRoute
