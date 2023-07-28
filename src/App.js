import React, { Component } from 'react';

import './App.css';
import { NavbarComp } from './components/NavbarComp';
import { Route, Routes } from 'react-router-dom';
import ConnectedWallet from './components/ConnectedWallet';
import SendMatic from './components/SendMatic';
import Home from './components/Home';
import SendToken from './components/SendToken';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavbarComp/>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/connected' element={<ConnectedWallet/>}/>
          <Route path='/sendmatic' element={<SendMatic/>}/>
          <Route path='/sendtoken' element={<SendToken/>}/>
        </Routes>
      </div>
    );
  }
}

export default App;
