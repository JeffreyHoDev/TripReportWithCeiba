import './App.css';
import { useState } from 'react'

import LoginPage from './pages/Login/login.page'
import Homepage from './pages/Home/home.page'

function App() {

  const [isLogin, setLoginStatus] = useState(false)
  const [apikey, setKey] = useState(null)

  return (
    <div className="App">
      <LoginPage setLoginStatus={setLoginStatus} isLogin={isLogin} setKey={setKey} />
      <Homepage apikey={apikey} isLogin={isLogin}/>
    </div>
  );
}

export default App;
