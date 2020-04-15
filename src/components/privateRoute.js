import React from 'react'
import { Redirect } from '@reach/router'

class PrivateRoute extends React.Component {
  render() {
    const { component: Component, location, ...rest } = this.props

    if (localStorage.getItem('CouchSportsToken') == null) {
      return <Redirect to='/' noThrow />
    }

    return <Component {...rest} />
  }
}

export default PrivateRoute
