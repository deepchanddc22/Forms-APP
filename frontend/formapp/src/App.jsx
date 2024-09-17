import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home'; // Import the Home component
import Layout from './components/Layout';
import FormBuilder from './pages/FormBuilder';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute component


const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Private route for the Home page */}
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
          />

          <Route
            path="/form-builder"
            element={
              <PrivateRoute>
                <FormBuilder />
              </PrivateRoute>
            }
          />

      </Routes>
    </Layout>
    </Router >
  );
};

export default App;
