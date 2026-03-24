import React, { useState, lazy, Suspense, useEffect } from 'react'
import "../src/App.css"
import Nav from '../src/Component/Nav'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Modal from './Component/Modal'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import { useDispatch } from 'react-redux'
import { setactiveuser, setlogoutuser } from './Utils/userSlice'
import { fetchWatchlist } from './Utils/watchlistSlice'

const Home = lazy(() => import('./Page/Home'));
const Coin = lazy(() => import('./Page/Coin'));

const App = () => {
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        dispatch(setactiveuser({
          uid: currentUser.uid,
          email: currentUser.email,
        }));
        dispatch(fetchWatchlist(currentUser.uid));
      } else {
        dispatch(setlogoutuser());
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  const openmodal = () => {
    setModal(true);
    document.body.classList.add('active-modal');
  }
  const closemodal = () => {
    setModal(false);
    document.body.classList.remove('active-modal');

  }
  return (
    <div className='w-screen h-screen bg-[#14161a]'>
      <Router>
        <Nav openmodal={openmodal} />
        <Routes>
          <Route exact path="/" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Home />
            </Suspense>
          }></Route>
          <Route exact path="/coins/:id" element={
            <Suspense fallback={<div>Loading...</div>}>
              <Coin />
            </Suspense>
          }></Route>
        </Routes>
      </Router>
      {modal && <Modal openmodal={openmodal} closemodal={closemodal} modal={modal} />}
    </div>
  )
}
export default App

