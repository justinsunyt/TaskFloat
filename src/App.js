import React from 'react'
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import './App.css'
import Forum from './Components/Forum'
import ForumDetail from './Components/ForumDetail'
import ClassDetail from './Components/ClassDetail'
import Nav from './Components/Nav'
import Login from './Components/Login'
import Class from './Components/Class'
import Profile from './Components/Profile'
import {AuthProvider} from './Auth'
import PrivateRoute from './PrivateRoute'


function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Nav />
          <br />
          <Switch>
            
            <PrivateRoute path="/" exact component={Forum} />
            <Route path="/login" component={Login}/>} 
            <PrivateRoute path="/post/:id" component={ForumDetail}/>
            <PrivateRoute path="/class/:id" exact component={ClassDetail}/>
            <PrivateRoute path="/class" exact component={Class}/>
            <PrivateRoute path="/profile" component={Profile}/>
            
          </Switch>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App