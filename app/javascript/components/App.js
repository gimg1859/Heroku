import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Register from './Register'
import Deportes from './Deportes'
import Eventos from './Eventos'

class App extends React.Component{
  render(){
    return(
      <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/deportes" component={Deportes} />
        <Route exact path="/eventos" component={Eventos} />
      </Switch>
    </div>
    )
  }
}

export default App
