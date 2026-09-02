import { 
  useFetchMatchedGrantsQuery, 
  useSaveGrantMutation 
} from '../store';

export default function MatchedGrantsList({ company }) {
  const { data: matches, isFetching, error } = useFetchMatchedGrantsQuery(
    company?.cvrNumber, 
    { skip: !company?.cvrNumber }
  );

  const [saveGrant, { isLoading: isSaving }] = useSaveGrantMutation();

  const handleSave = async (grantId) => {
    try {
      await saveGrant({ cvrNumber: company.cvrNumber, grantId }).unwrap();
      alert('Fonden er gemt som favorit!');
    } catch (err) {
      alert('Fejl ved gemning (måske er den allerede gemt).');
    }
  };

  if (!company) {
    return (
      <div className="alert alert-info">
        Indtast et CVR-nummer ovenfor for at se matchede støtteordninger.
      </div>
    );
  }

  if (isFetching) {
    return <div className="text-center py-4">Beregner støttematch mod DB07 branchen...</div>;
  }

  if (error) {
    return <div className="alert alert-warning">Kunne ikke hente matchede fonde.</div>;
  }

  return (
    <div>
      <div className="bg-light p-3 rounded mb-4 border">
        <h2 className="h4 mb-1">{company.companyName}</h2>
        <p className="text-muted mb-0">
          Branchekode: <strong>{company.industryCode}</strong> — {company.industryText}
        </p>
      </div>

      <h3 className="h5 mb-3">Relevante Fonde ({matches?.length || 0})</h3>

      <div className="row g-3">
        {matches?.map((m, index) => {
          // Håndterer om objektet indeholder m.grant eller om egenskaberne ligger direkte på m
          const grant = m.grant || m;
          const grantId = grant.id || m.grantId;

          return (
            <div key={grantId || index} className="col-md-6">
              <div className="card h-100 shadow-sm border-start border-4 border-primary">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="h6 card-title fw-bold mb-0">
                      {grant.title || 'Uden titel'}
                    </h4>
                    <span className={`badge ${m.matchScore === 100 ? 'bg-success' : 'bg-primary'}`}>
                      {m.matchScore ?? 0}% Match
                    </span>
                  </div>
                  <p className="small text-muted mb-2">Udbyder: {grant.provider || 'Ukendt'}</p>
                  <p className="card-text small">{grant.description || ''}</p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                    <span className="fw-bold text-success">
                      {grant.maxAmount ? `Op til ${grant.maxAmount.toLocaleString('da-DK')} DKK` : 'Variabelt beløb'}
                    </span>
                    <button 
                      onClick={() => handleSave(grantId)} 
                      className="btn btn-sm btn-outline-primary"
                      disabled={isSaving || !grantId}
                    >
                      Gem Fond
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}