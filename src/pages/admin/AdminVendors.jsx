import { useApp } from '../../contexts/AppContext';
import { CheckCircle, XCircle, Clock, MapPin, Star } from 'lucide-react';
import { formatCurrency, timeAgo } from '../../utils/ai';

export default function AdminVendors() {
  const { vendors, dispatch, notify } = useApp();

  const update = (vendorId, status) => {
    dispatch({ type: 'UPDATE_VENDOR_STATUS', payload: { vendorId, status } });
    notify(`Vendor ${status === 'approved' ? 'approved' : 'rejected'}!`, status === 'approved' ? 'success' : 'danger');
  };

  const pending = vendors.filter(v => v.status === 'pending');
  const approved = vendors.filter(v => v.status === 'approved');
  const rejected = vendors.filter(v => v.status === 'rejected');

  const VendorCard = ({ vendor }) => (
    <div className="card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <img src={vendor.avatar} alt="" style={{ width: 48, height: 48, borderRadius: '50%', border: '2px solid var(--border2)', flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700 }}>{vendor.name}</span>
            {vendor.badge && <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>{vendor.badge}</span>}
            <span className={`badge badge-${vendor.status === 'approved' ? 'success' : vendor.status === 'pending' ? 'warning' : 'danger'}`}>{vendor.status}</span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text3)', marginBottom: '0.5rem' }}>Owner: {vendor.owner} · {vendor.email}</div>
          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.82rem', color: 'var(--text2)', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={12} />{vendor.location}</span>
            {vendor.rating > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Star size={12} color="var(--warning)" />{vendor.rating}</span>}
            {vendor.totalSales > 0 && <span>Sales: {formatCurrency(vendor.totalSales)}</span>}
            <span>Joined: {vendor.joinDate}</span>
          </div>
          {vendor.description && <p style={{ fontSize: '0.82rem', color: 'var(--text3)', marginTop: '0.5rem', fontStyle: 'italic' }}>{vendor.description}</p>}
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
          {vendor.status !== 'approved' && (
            <button className="btn btn-success btn-sm" onClick={() => update(vendor.id, 'approved')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle size={14} /> Approve
            </button>
          )}
          {vendor.status !== 'rejected' && (
            <button className="btn btn-danger btn-sm" onClick={() => update(vendor.id, 'rejected')} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <XCircle size={14} /> Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.25rem' }}>Vendor Management</h1>
      <p className="text-muted mb-4">{vendors.length} total vendors · {pending.length} pending approval</p>

      {pending.length > 0 && (
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Clock size={18} color="var(--warning)" />
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Pending Approval ({pending.length})</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {pending.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>
        </section>
      )}

      <section style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <CheckCircle size={18} color="var(--success)" />
          <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Approved Vendors ({approved.length})</h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {approved.map(v => <VendorCard key={v.id} vendor={v} />)}
        </div>
      </section>

      {rejected.length > 0 && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <XCircle size={18} color="var(--danger)" />
            <h2 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Rejected ({rejected.length})</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {rejected.map(v => <VendorCard key={v.id} vendor={v} />)}
          </div>
        </section>
      )}
    </div>
  );
}
