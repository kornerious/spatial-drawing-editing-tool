import React, { PureComponent } from 'react'
import { Provider } from 'react-redux'
import store from '../../store'
import EditingTool from '../EditingTool/EditingTool'
import './App.scss'

export default class App extends PureComponent {
  render() {
    return (
      <Provider store={store}>
        <div id="container">
          <EditingTool />
        </div>
      </Provider>
    )
  }
}
