import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Services from './pages/Services';
import Providers from './pages/Providers';
import Users from './pages/Users';
// import Bookings from './pages/Bookings';
import Login from './pages/Login';
import PrivateRoute from './components/Auth/ProtectedRoute';


function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="categories" element={<Categories />} />
              <Route path="services" element={<Services />} />
              <Route path="providers" element={<Providers />} />
              <Route path="users" element={<Users />} />
              {/* <Route path="bookings" element={<Bookings />} /> */}
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer position="top-right" />
    </Provider>
  );
}

export default App;