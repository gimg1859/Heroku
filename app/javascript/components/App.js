import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './Home'
import About from './About'
import Register from './Register'
import Deportes from './Deportes'
import Eventos from './Eventos'
import Unirse from './Unirse'
import Contra from './Contra'
import Perfil from './Perfil'
class App extends React.Component{
  render(){
    return(
      <div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/contra" component={Contra} />
        <Route exact path="/about" component={About} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/deportes" component={Deportes} />
        <Route exact path="/eventos" component={Eventos} />
        <Route exact path="/unirse" component={Unirse} />
        <Route exact path="/perfil" component={Perfil} />
      </Switch>
    </div>
    )
  }
}

export default App
