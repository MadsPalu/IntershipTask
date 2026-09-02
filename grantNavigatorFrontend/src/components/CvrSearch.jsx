import { useState } from 'react';
import { useLookupCompanyMutation } from '../store';

function CvrSearch({ onCompanyFound }) {
  const [cvrInput, setCvrInput] = useState('');
  const [lookupCompany, { isLoading, error }] = useLookupCompanyMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvrInput.trim()) return;

    try {
      const companyData = await lookupCompany(cvrInput).unwrap();
      onCompanyFound(companyData);
    } catch (err) {
      console.error('Kunne ikke hente CVR data:', err);
    }
  };

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h3 className="h5 mb-3">Slå virksomhed op på CVR</h3>
      <form onSubmit={handleSubmit} className="d-flex gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Indtast CVR-nummer (f.eks. 37793132)"
          value={cvrInput}
          onChange={(e) => setCvrInput(e.target.value)}
        />
        <button type="submit" className="btn btn-primary min-w-120" disabled={isLoading}>
          {isLoading ? 'Søger...' : 'Søg CVR'}
        </button>
      </form>

      {error && (
        <div className="alert alert-danger mt-3 mb-0 py-2">
          Kunne ikke finde virksomheden. Tjek at CVR-nummeret er korrekt, og at .NET API'en kører.
        </div>
      )}
    </div>
  );
}

export default CvrSearch;