import { useState } from 'react';
import CvrSearch from './components/CvrSearch';
import MatchedGrantsList from './components/MatchedGrantsList';

function App() {
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <div className="container py-4" style={{ maxWidth: '900px' }}>
      <header className="pb-3 mb-4 border-bottom">
        <h1 className="h2 text-primary fw-bold">GrantNavigator</h1>
        <p className="text-muted mb-0">
          Match danske virksomheder med tilgængelige støtteordninger via CVR og DB07 branchekoder.
        </p>
      </header>

      <main>
        <CvrSearch onCompanyFound={(company) => setSelectedCompany(company)} />
        <MatchedGrantsList company={selectedCompany} />
      </main>
    </div>
  );
}

export default App;