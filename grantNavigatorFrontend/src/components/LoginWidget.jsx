import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../store';

export default function LoginWidget() {
  const dispatch = useDispatch();
  const { user, availableUsers } = useSelector((state) => state.auth);

  return (
    <div className="d-flex align-items-center gap-2 bg-light border p-2 rounded">
      <span className="small text-muted fw-bold">Aktiv profil:</span>
      <select 
        className="form-select form-select-sm" 
        value={user?.id || ''} 
        onChange={(e) => dispatch(setUser(e.target.value))}
        style={{ width: 'auto' }}
      >
        {availableUsers.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name} ({u.role})
          </option>
        ))}
      </select>
    </div>
  );
}