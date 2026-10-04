import { 
  useFetchMatchedGrantsQuery, 
  useSaveGrantMutation 
} from '../store';

// Hjælpefunktion til at forklare match-logikken pædagogisk
const getMatchDetails = (score) => {
  if (score >= 100) {
    return {
      label: 'Direkte Match',
      badgeClass: 'bg-success',
      description: 'Matcher din virksomheds specifikke DB07-branchekode 100%'
    };
  }
  if (score >= 85) {
    return {
      label: 'Relateret Match',
      badgeClass: 'bg-primary',
      description: 'Matcher din overordnede brancesektor'
    };
  }
  return {
    label: 'Generel Støtte',
    badgeClass: 'bg-secondary',
    description: 'Bred støtteordning åben for flere erhvervsbrancher'
  };
};

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
          const grant = m.grant || m;
          const grantId = grant.id || m.grantId;
          const matchInfo = getMatchDetails(m.matchScore ?? 0);

          const grantUrl = 
            grant.directLink || 
            grant.DirectLink || 
            grant.url || 
            grant.link;

          return (
            <div key={grantId || index} className="col-md-6">
              <div className="card h-100 shadow-sm border-start border-4 border-primary">
                <div className="card-body d-flex flex-column justify-content-between">
                  <div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h4 className="h6 card-title fw-bold mb-0">
                        {grant.title || 'Uden titel'}
                      </h4>
                      <span className={`badge ${matchInfo.badgeClass}`}>
                        {matchInfo.label}
                      </span>
                    </div>
                    
                    <p className="small text-muted mb-2">Udbyder: {grant.provider || 'Ukendt'}</p>

                    {/* Tydelig forklaring på match-grundlaget */}
                    <div className="bg-light p-2 rounded mb-3 border-start border-3 border-info">
                      <p className="mb-0 text-dark" style={{ fontSize: '0.8rem' }}>
                        💡 <strong>Match-grundlag:</strong> {matchInfo.description}
                      </p>
                    </div>

                    <p className="card-text small">{grant.description || ''}</p>
                  </div>
                  
                  <div className="mt-3 pt-2 border-top">
                    <div className="fw-bold text-success mb-2">
                      {grant.maxAmount ? `Op til ${grant.maxAmount.toLocaleString('da-DK')} DKK` : 'Variabelt beløb'}
                    </div>
                    
                    <div className="d-flex gap-2">
                      {grantUrl && (
                        <a 
                          href={grantUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-sm btn-outline-secondary flex-grow-1 text-center"
                        >
                          Gå til fond ↗
                        </a>
                      )}
                      <button 
                        onClick={() => handleSave(grantId)} 
                        className="btn btn-sm btn-primary flex-grow-1"
                        disabled={isSaving || !grantId}
                      >
                        Gem Fond
                      </button>
                    </div>
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