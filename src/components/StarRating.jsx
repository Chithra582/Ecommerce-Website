import { Star } from 'lucide-react';

export function StarRating({ rating, count, size = 14 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
      <div className="stars">
        {[1,2,3,4,5].map(i => (
          <Star key={i} size={size} fill={i <= Math.round(rating) ? 'currentColor' : 'none'} className={i <= Math.round(rating) ? '' : 'star-empty'} />
        ))}
      </div>
      <span style={{ fontSize: '0.8rem', color: 'var(--text2)', fontWeight: 600 }}>{rating?.toFixed(1)}</span>
      {count !== undefined && <span style={{ fontSize: '0.75rem', color: 'var(--text3)' }}>({count})</span>}
    </div>
  );
}

export function InteractiveStars({ value, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.25rem', cursor: 'pointer' }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={24} fill={i <= value ? '#FFB800' : 'none'} color={i <= value ? '#FFB800' : 'var(--text3)'} onClick={() => onChange(i)} style={{ transition: 'transform 0.1s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.2)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
      ))}
    </div>
  );
}
