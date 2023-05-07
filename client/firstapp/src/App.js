import {io} from 'socket.io-client'
import {createBrowserRouter,createRoutesFromElements, Route, Outlet, RouterProvider} from 'react-router-dom'
import Whole from './Whole';
import Auth  from './Auth';
import Register from './Regester';
import CreateContact from './CreateContact';
import { useState } from 'react';
import VideoCall from './VideoCall';
import VoiceCall from './VoiceCall';
const socket= io('http://localhost:4000')

function App() {
    const [isOnline,setIsOnline]= useState()
    
    const routes= createBrowserRouter(
        createRoutesFromElements(
            <Route exact path='/' element={<Root/>}>
                <Route index element={<Auth  isOnline={isOnline} setIsOnline={setIsOnline} />}></Route>
                <Route exact path='/register' element={<Register/>}></Route>
                <Route exact path='/addcontacts' element={<CreateContact />}></Route>
                <Route exact path='/contacts' element={<Whole socket={socket} isOnline={isOnline} setIsOnline={setIsOnline} />}></Route>
                <Route exact path='/call' element={<VideoCall socket={socket}/>}></Route>
                <Route exact path='/Voicecall' element={<VoiceCall socket={socket}/>}></Route>
                
            </Route>
        )

    )
  return (
    
        <div className="App">
            <RouterProvider router={routes}></RouterProvider>
        </div>
  );
}

const Root = ()=> {
    return (
        
            <Outlet/>
        
    )
}

export default App;
