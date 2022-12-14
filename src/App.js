import './App.css';
import { useState } from 'react'

import LoginPage from './pages/Login/login.page'
import Homepage from './pages/Home/home.page'
// import ScheduleTaskPage from './pages/ScheduleTask/scheduletask.page';
// import UserManagementPage from './pages/User/usermanagement.page';

// import AddUserComponent from './components/addUser/addUser.component'
// import Topbar from './components/Topbar/topbar.component';
// import AddUserComponent from './components/addUser/addUser.component'

// import { Routes, Route } from "react-router-dom";

function App() {

  const [isLogin, setLoginStatus] = useState(false)
  const [loginUser, setLoginUser] = useState("")
  const [apikey, setKey] = useState(null)

  return (
    <div className="App">
      {/* <Topbar isLogin={isLogin} loginUser={loginUser}/> */}
      <LoginPage setLoginStatus={setLoginStatus} isLogin={isLogin} setKey={setKey} setLoginUser={setLoginUser}/>
      <Homepage apikey={apikey} isLogin={isLogin}/>
      {/* <Routes>

        <Route path="/" element={<LoginPage setLoginStatus={setLoginStatus} isLogin={isLogin} setKey={setKey} setLoginUser={setLoginUser} />} />
        <Route index path="/home" element={<Homepage apikey={apikey} isLogin={isLogin}/>}/> */}
        {/* <Route path="/scheduletask" element={<ScheduleTaskPage isLogin={isLogin} />} />
        <Route path="/user-management" element={<UserManagementPage />} />
        <Route path="/user-management/add-user" element={<AddUserComponent/>} /> */}
      {/* </Routes> */}
    </div>
  );
}

export default App;
