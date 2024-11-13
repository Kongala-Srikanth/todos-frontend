import {Switch, Route, Redirect} from 'react-router-dom'

import SignUp from './components/SignUp';
import Login from './components/Login'
import Profile from './components/Profile';
import Todos from './components/Todos';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Switch>
      <ProtectedRoute exact path='/login' component={Login} />
      <ProtectedRoute exact path='/signup' component={SignUp} />
      <ProtectedRoute exact path='/' component={Todos} />
      <ProtectedRoute exact path='/profile' component={Profile} />
    </Switch>
  );
}

export default App;
