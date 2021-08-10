import './App.css';
import Login from './components/Login';
import Main from './components/Main';
import { Route, Switch, BrowserRouter} from "react-router-dom";


function App() {


  return (
    <div className="App">
      <Switch>
      <Route exact path="/" component ={Login}/>
      <Route path="/main" component ={Main}/>
      </Switch>
      
    </div>
  );
}

export default App;
