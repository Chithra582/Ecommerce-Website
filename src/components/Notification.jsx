import { useApp } from '../contexts/AppContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = { success: CheckCircle, danger: AlertCircle, info: Info, warning: AlertTriangle };
const colors = { success: 'var(--success)', danger: 'var(--danger)', info: 'var(--info)', warning: 'var(--warning)' };

export default function Notification() {
  const { notification, dispatch } = useApp();
  if (!notification) return null;
  const Icon = icons[notification.type] || Info;
  return (
    <div className="toast-wrap">
      <div className={`toast ${notification.type}`}>
        <Icon size={18} color={colors[notification.type]} style={{ flexShrink: 0 }} />
        <span style={{ flex: 1, fontSize: '0.9rem', fontWeight: 500 }}>{notification.message}</span>
        <button onClick={() => dispatch({ type: 'CLEAR_NOTIFICATION' })} style={{ background: 'none', color: 'var(--text3)', display: 'flex' }}>
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
