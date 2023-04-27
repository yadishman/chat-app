
import {createBrowserRouter,createRoutesFromElements, Route, Outlet, RouterProvider} from 'react-router-dom'
import Whole from './Whole';
import Auth  from './Auth';
import Register from './Regester';
import CreateContact from './CreateContact';
import { useState } from 'react';
function App() {
    
    
    const routes= createBrowserRouter(
        createRoutesFromElements(
            <Route exact path='/' element={<Root/>}>
                <Route index element={<Auth  />}></Route>
                <Route exact path='/register' element={<Register/>}></Route>
                <Route exact path='/addcontacts' element={<CreateContact />}></Route>
                <Route exact path='/contacts' element={<Whole  />}></Route>
                
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
