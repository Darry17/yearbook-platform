import React from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Yearbook from './components/Yearbook';
import Transaction from './components/Transaction';
import Configure from './components/Configure';
import CreateBatch from './components/CreateBatch';
import AddBatch from './components/AddBatch';
import EditProfile from './components/EditProfile';
import YearbookProfileForm from './components/YearbookProfileForm';
import Accounts from './components/Accounts';
import Records from './components/Records';
import SearchAndDelete from './components/SearchAndDelete';
import UserProfile from './components/UserProfile'; // Import UserProfile component
import Analytics from './components/Analytics'; // Import Analytics component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/main" element={<MainLayout />}>
          <Route path="yearbook" element={<Yearbook />} />
          <Route path="transaction" element={<Transaction />} />
          <Route path="configure" element={<Configure />} />
          <Route path="configure/create" element={<CreateBatch />} />
          <Route path="configure/add" element={<YearbookProfileForm />} />
          <Route path="configure/delete" element={<SearchAndDelete />} />
          <Route path="configure/edit" element={<EditProfile />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="records" element={<Records />} />
          <Route path="analytics" element={<Analytics />} /> {/* Add Analytics Route */}
        </Route>
        
        {/* New Route for User Profile */}
        <Route path="/user-profile/:profile_id" element={<UserProfile />} />
        
        {/* Redirect base path to /main/yearbook */}
        <Route path="/" element={<Navigate to="/main/yearbook" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
