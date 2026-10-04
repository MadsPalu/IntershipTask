import { 
  useFetchSavedGrantsQuery, 
  useUnsaveGrantMutation 
} from '../store';

export default function SavedGrantsList({ company }) {
  const { data: savedList, isFetching, error } = useFetchSavedGrantsQuery(
    company?.cvrNumber, 
    { skip: !company?.cvrNumber }
  );

  const [unsaveGrant, { isLoading: isUnsaving }] = useUnsaveGrantMutation();

  const handleUnsave = async (grantId) => {
    try {
      await unsaveGrant({ cvrNumber: company.cvrNumber, grantId }).unwrap();
    } catch (err) {
      alert('Kunne ikke fjerne fonden.');
    }
  };

  // Åbner browserens print/PDF-dialog
  const handlePrint = () => {
    window.print();
  };

  if (!company) {
    return (
      <div className="alert alert-info">
        Slå en virksomhed op under "Søg støtte" for at se gemte favoritter.
      </div>
    );
  }

  if (isFetching) {
    return <div className="text-center py-4">Henter gemte fonde...</div>;
  }

  if (error) {
    return <div className="alert alert-warning">Kunne ikke hente gemte fonde.</div>;
  }

  return (
    <div>
      {/* CSS-regler der kun gælder under print / PDF-eksportering */}
      <style>{`
        @media print {
          /* Skjul navigation, knapper og interaktive elementer */
          header, nav, .no-print, button {
            display: none !important;
          }
          /* Gør printet pænt og læsbart på et A4-ark */
          body {
            background: #fff !important;
            color: #000 !important;
          }
          .container {
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-card {
            border: 1px solid #ddd !important;
            page-break-inside: avoid;
            margin-bottom: 12px !important;
            padding: 12px !important;
          }
        }
      `}</style>

      {/* Header og Print-knap */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="h5 mb-0">Gemte Fonde for {company.companyName}</h3>
          <p className="text-muted small mb-0">
            Branchekode: <strong>{company.industryCode}</strong> — {company.industryText}
          </p>
        </div>

        {savedList?.length > 0 && (
          <button 
            onClick={handlePrint} 
            className="btn btn-sm btn-outline-secondary no-print d-flex align-items-center gap-1"
          >
            <span>🖨️</span> Eksporter som PDF
          </button>
        )}
      </div>

      {savedList?.length === 0 ? (
        <p className="text-muted">Ingen gemte fonde endnu.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {savedList?.map((item) => {
            const grant = item.grant || item;
            const grantUrl = 
              grant.directLink || 
              grant.DirectLink || 
              grant.url || 
              grant.link;

            return (
              <div 
                key={item.id || grant.id} 
                className="card print-card shadow-sm border"
              >
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h4 className="h6 fw-bold mb-0">{grant.title}</h4>
                    <button
                      onClick={() => handleUnsave(grant.id)}
                      className="btn btn-sm btn-outline-danger no-print"
                      disabled={isUnsaving}
                    >
                      Fjern
                    </button>
                  </div>

                  <p className="small text-muted mb-2">Udbyder: {grant.provider}</p>
                  <p className="card-text small text-secondary mb-3">{grant.description}</p>

                  <div className="d-flex justify-content-between align-items-center pt-2 border-top">
                    <span className="fw-bold text-success small">
                      {grant.maxAmount 
                        ? `Op til ${grant.maxAmount.toLocaleString('da-DK')} DKK` 
                        : 'Variabelt beløb'}
                    </span>

                    {grantUrl && (
                      <a 
                        href={grantUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="small text-decoration-none no-print"
                      >
                        Åbn ansøgningsside ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}