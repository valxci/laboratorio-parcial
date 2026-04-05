import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router';
import { AppProvider } from './context/App';

import Landing from './app/Landing';
import RoleSelection from './app/RoleSelection';
import SignUp from './app/SignUp';
import StoreSignUp from './app/StoreSignUp';
import Login from './app/Login';
import ClientDashboard from './app/client/ClientDashboard';
import StoreDetail from './app/client/StoreDetail';
import StoreDashboard from './app/store/StoreDashboard';
import Cart from './app/client/Cart';
import ClientOrders from './app/client/ClientOrders';
import DeliveryDashboard from './app/delivery/DeliveryDashboard';
import './style.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/role" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/store" element={<StoreSignUp />} />
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client/store/:storeId" element={<StoreDetail />} />
          <Route path="/client/cart" element={<Cart />} />
          <Route path="/client/orders" element={<ClientOrders />} />
          <Route path="/store" element={<StoreDashboard />} />
          <Route path="/delivery" element={<DeliveryDashboard />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

ReactDOM.createRoot(document.getElementById('app')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
