import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { CareerFinder } from "./pages/CareerFinder";
import { CareerFinderManual } from "./pages/CareerFinderManual";
import { CareerFinderResume } from "./pages/CareerFinderResume";
import { CareerResults } from "./pages/CareerResults";
import { CareerDetails } from "./pages/CareerDetails";
import { Profile } from "./pages/Profile";
import { SavedCareers } from "./pages/SavedCareers";
import { Chatbot } from "./pages/Chatbot";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { AdminPanel } from "./pages/AdminPanel";

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/finder' element={<CareerFinder />} />
            <Route path='/finder/manual' element={<CareerFinderManual />} />
            <Route path='/finder/resume' element={<CareerFinderResume />} />
            <Route path='/finder/results' element={<CareerResults />} />
            <Route path='/career/:id' element={<CareerDetails />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/saved-careers' element={<SavedCareers />} />
            <Route path='/chat' element={<Chatbot />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/admin' element={<AdminPanel />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
