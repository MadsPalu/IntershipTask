import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, NavLink } from 'react-router-dom';
import CvrSearch from './components/CvrSearch';
import MatchedGrantsList from './components/MatchedGrantsList';
import SavedGrantsList from './components/SavedGrantsList';
import LoginWidget from './components/LoginWidget';
import { grantNavigatorApi } from './store';

function App() {
  const dispatch = useDispatch();
  const activeUser = useSelector((state) => state.auth.user);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    // Nulstiller cachen sikkert ved skift af profil
    if (grantNavigatorApi?.util?.resetApiState) {
      dispatch(grantNavigatorApi.util.resetApiState());
    }

    if (activeUser?.cvrNumber) {
      setSelectedCompany({
        cvrNumber: activeUser.cvrNumber,
        companyName: activeUser.name,
        industryCode: '949900',
        industryText: 'Virksomhedsprofil'
      });
    } else {
      setSelectedCompany(null);
    }
  }, [activeUser, dispatch]);

  return (
    <div className="container py-4" style={{ maxWidth: '950px' }}>
      <header className="pb-3 mb-4 border-bottom">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h1 className="h2 text-primary fw-bold mb-0">GrantNavigator</h1>
            <p className="text-muted small mb-0">B2B Bæredygtighedsportal & Fondsmatch</p>
          </div>
          <LoginWidget />
        </div>

        <nav className="nav nav-pills">
          <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Søg støtte
          </NavLink>
          <NavLink to="/saved" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            Gemte fonde
          </NavLink>
        </nav>
      </header>

      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <CvrSearch onCompanyFound={(company) => setSelectedCompany(company)} />
                <MatchedGrantsList company={selectedCompany} />
              </>
            } 
          />
          <Route 
            path="/saved" 
            element={<SavedGrantsList company={selectedCompany} />} 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;