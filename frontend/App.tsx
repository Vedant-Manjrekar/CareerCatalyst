import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";
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
import { CareerFinderDirect } from "./pages/CareerFinderDirect";

function App() {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path='/finder' element={<ProtectedRoute><CareerFinder /></ProtectedRoute>} />
            <Route path='/finder/manual' element={<ProtectedRoute><CareerFinderManual /></ProtectedRoute>} />
            <Route path='/finder/resume' element={<ProtectedRoute><CareerFinderResume /></ProtectedRoute>} />
            <Route path='/finder/direct' element={<ProtectedRoute><CareerFinderDirect /></ProtectedRoute>} />
            <Route path='/finder/results' element={<ProtectedRoute><CareerResults /></ProtectedRoute>} />
            <Route path='/career/:id' element={<ProtectedRoute><CareerDetails /></ProtectedRoute>} />
            <Route path='/saved-career/:id' element={<ProtectedRoute><CareerDetails /></ProtectedRoute>} />
            <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path='/saved-careers' element={<ProtectedRoute><SavedCareers /></ProtectedRoute>} />
            <Route path='/chat' element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
            <Route path='/admin' element={<ProtectedRoute adminOnly={true}><AdminPanel /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
}

export default App;
