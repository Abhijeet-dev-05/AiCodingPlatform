import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { useSelector } from 'react-redux';
import axiosClient from '../utils/axiosClient';
import './UserDashboard.css';

/* ── Animated counter ──────────────────────────────────────────── */
function AnimatedCounter({ value, duration = 900 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value, duration]);
  return <span>{count.toLocaleString()}</span>;
}

/* ── SVG Donut chart ───────────────────────────────────────────── */
function DonutChart({ segments, size = 110 }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  if (!total) return (
    <div className="ud-donut-empty">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={size/2-10} fill="none"
          stroke="var(--ds-bg-overlay)" strokeWidth="18"/>
      </svg>
    </div>
  );
  const r = size / 2 - 10, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const arcs = segments.map(({ value, color, label }) => {
    const pct = value / total;
    const dash = pct * circ;
    const gap  = circ - dash;
    const el = (
      <circle key={label} cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="18"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={-offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
    );
    offset += dash;
    return el;
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={cx} cy={cy} r={r} fill="none"
        stroke="var(--ds-bg-overlay)" strokeWidth="18"/>
      {arcs}
    </svg>
  );
}

/* ── Bar chart row ─────────────────────────────────────────────── */
function BarRow({ label, value, max, color }) {
  return (
    <div className="ud-bar-row">
      <span className="ud-bar-label">{label}</span>
      <div className="ud-bar-track">
        <div className="ud-bar-fill" style={{
          width: max ? `${(value / max) * 100}%` : '0%',
          background: color,
          transition: 'width 1s ease',
        }}/>
      </div>
      <span className="ud-bar-val">{value}</span>
    </div>
  );
}

/* ── Heatmap ───────────────────────────────────────────────────── */
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function Heatmap({ data }) {
  const today   = new Date();
  const yearAgo = new Date(today);
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);

  const dateMap = {};
  (data || []).forEach(d => { dateMap[d.date] = d.count; });

  // Build week columns — each column is 7 days starting Sunday
  const weeks = [];
  const cur = new Date(yearAgo);
  cur.setDate(cur.getDate() - cur.getDay()); // rewind to Sunday
  while (cur <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const copy = new Date(cur);
      const ds = copy.toISOString().split('T')[0];
      week.push({
        date: ds,
        count: dateMap[ds] || 0,
        inRange: copy >= yearAgo && copy <= today,
        month: copy.getMonth(),
        day: copy.getDate(),
      });
      cur.setDate(cur.getDate() + 1);
    }
    weeks.push(week);
  }

  // Detect which week-index each month STARTS at (day===1 inside range)
  const monthStarts = {};
  weeks.forEach((week, wi) => {
    week.forEach(day => {
      if (day.inRange && day.day === 1 && monthStarts[day.month] === undefined) {
        monthStarts[day.month] = wi;
      }
    });
  });

  // Group weeks into month blocks for the gap treatment:
  // each block is { month, weeks[] }
  // A new block begins whenever the current week crosses into a new month
  const blocks = [];
  let currentMonth = null;
  weeks.forEach((week, wi) => {
    // Determine the dominant month in this week (the month of day 3 — mid-week)
    const midDay = week[3] || week[0];
    const wMonth = midDay.inRange ? midDay.month : null;

    if (wMonth !== currentMonth) {
      currentMonth = wMonth;
      blocks.push({ month: wMonth, weeks: [] });
    }
    blocks[blocks.length - 1].weeks.push({ week, wi });
  });

  const level = (c) => c === 0 ? 0 : c <= 2 ? 1 : c <= 4 ? 2 : c <= 6 ? 3 : 4;
  const total = (data || []).reduce((s, d) => s + d.count, 0);

  return (
    <div className="ud-heatmap-wrap">
      {/* Meta */}
      <div className="ud-heatmap-meta">
        <span className="ud-heatmap-total">
          <strong>{total}</strong> submissions in the last year
        </span>
        <div className="ud-heatmap-legend">
          <span>Less</span>
          {[0,1,2,3,4].map(l => (
            <div key={l} className={`ud-heatmap-cell ud-heatmap-cell--${l}`}/>
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Scrollable area */}
      <div className="ud-heatmap-scroll">
        <div className="ud-heatmap-outer">

          {/* Month label + week columns grouped by month */}
          <div className="ud-heatmap-blocks">
            {blocks.map((block, bi) => (
              <div key={bi} className="ud-heatmap-block">
                {/* Month label */}
                <div className="ud-heatmap-block-label">
                  {block.month !== null ? MONTH_NAMES[block.month] : ''}
                </div>
                {/* Week columns inside this month */}
                <div className="ud-heatmap-block-weeks">
                  {block.weeks.map(({ week, wi }) => (
                    <div key={wi} className="ud-heatmap-week">
                      {week.map((day, di) => (
                        <div
                          key={di}
                          className={`ud-heatmap-cell ud-heatmap-cell--${day.inRange ? level(day.count) : 'empty'}`}
                          title={day.inRange ? `${day.date}: ${day.count} submission${day.count !== 1 ? 's' : ''}` : ''}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Time ago ──────────────────────────────────────────────────── */
function timeAgo(d) {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  if (s < 604800)return `${Math.floor(s/86400)}d ago`;
  return new Date(d).toLocaleDateString();
}

/* ── Main component ────────────────────────────────────────────── */
export default function UserDashboard() {
  const { user } = useSelector((s) => s.auth);
  const [loading, setLoading]   = useState(true);
  const [stats, setStats]       = useState(null);
  const [heatmap, setHeatmap]   = useState([]);
  const [solved, setSolved]     = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [sr, hr, pr] = await Promise.all([
        axiosClient.get('/dashboard/stats'),
        axiosClient.get('/dashboard/heatmap'),
        axiosClient.get('/dashboard/solved-problems'),
      ]);
      setStats(sr.data.data);
      setHeatmap(hr.data.data);
      setSolved(pr.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return (
    <div className="ud-root">
      <div className="ud-loading">
        <div className="ud-spinner"/>
        <span>Loading your dashboard…</span>
      </div>
    </div>
  );

  const dc = stats?.difficultyCount || {};
  const lc = stats?.languageCount   || {};
  const tc = stats?.tagCount        || {};
  const maxTag = Math.max(...Object.values(tc), 1);

  const diffSegs = [
    { label:'Easy',   value: dc.easy   || 0, color:'var(--ds-success)' },
    { label:'Medium', value: dc.medium || 0, color:'var(--ds-warning)' },
    { label:'Hard',   value: dc.hard   || 0, color:'var(--ds-error)'   },
  ];
  const langSegs = Object.entries(lc).slice(0, 5).map(([k, v], i) => ({
    label: k, value: v,
    color: ['#38bdf8','#fbbf24','#4ade80','#a78bfa','#f472b6'][i],
  }));

  const levelLabel = (n) =>
    n >= 50 ? 'Expert' : n >= 20 ? 'Intermediate' : 'Beginner';

  const initials = user?.firstName?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="ud-root">

      {/* ── NAV ── */}
      <header className="ud-nav">
        <Link to="/" className="ud-back">
          <svg width="14" height="14" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Back
        </Link>
        <span className="ud-nav__title">My Dashboard</span>
        <button className="ud-refresh-btn" onClick={load} title="Refresh data">
          <svg width="14" height="14" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
          </svg>
        </button>
      </header>

      <main className="ud-body">

        {/* ── PROFILE HERO ── */}
        <div className="ud-profile">
          <div className="ud-profile__avatar">{initials}</div>
          <div className="ud-profile__info">
            <h2 className="ud-profile__name">{user?.firstName} {user?.lastName}</h2>
            <p className="ud-profile__email">{user?.emailId}</p>
            <div className="ud-profile__badges">
              {(stats?.currentStreak || 0) > 0 && (
                <span className="ud-badge ud-badge--fire">🔥 {stats.currentStreak} day streak</span>
              )}
              <span className="ud-badge ud-badge--level">⭐ {levelLabel(stats?.totalSolved || 0)}</span>
            </div>
          </div>
          <div className="ud-profile__quick">
            {[
              ['Solved',      stats?.totalSolved       || 0],
              ['Acceptance',  `${stats?.acceptanceRate || 0}%`],
              ['Best Streak', stats?.longestStreak     || 0],
            ].map(([label, val]) => (
              <div key={label} className="ud-profile__quick-stat">
                <span className="ud-profile__quick-val">
                  {typeof val === 'number' ? <AnimatedCounter value={val}/> : val}
                </span>
                <span className="ud-profile__quick-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── STAT CARDS ── */}
        <div className="ud-stats">
          {[
            { icon:'🎯', value: stats?.totalSolved      || 0,  label:'Problems Solved',     sub:`of ${stats?.totalProblems||0}`, color:'pink' },
            { icon:'🔥', value: stats?.currentStreak    || 0,  label:'Current Streak',      sub:'days coding',                   color:'amber'},
            { icon:'📝', value: stats?.totalSubmissions || 0,  label:'Total Submissions',   sub:'all time',                      color:'purple'},
            { icon:'✅', value: `${stats?.acceptanceRate||0}%`,label:'Acceptance Rate',     sub:'success rate',                  color:'green' },
            { icon:'💡', value: stats?.longestStreak    || 0,  label:'Longest Streak',      sub:'personal best',                 color:'blue' },
          ].map(({ icon, value, label, sub, color }) => (
            <div key={label} className={`ud-stat ud-stat--${color}`}>
              <div className="ud-stat__icon">{icon}</div>
              <div>
                <div className="ud-stat__val">
                  {typeof value === 'number' ? <AnimatedCounter value={value}/> : value}
                </div>
                <div className="ud-stat__label">{label}</div>
                <div className="ud-stat__sub">{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ── HEATMAP ── */}
        <div className="ud-card">
          <div className="ud-card__header">
            <h3 className="ud-card__title">📊 Contribution Activity</h3>
          </div>
          <div className="ud-card__body">
            <Heatmap data={heatmap}/>
          </div>
        </div>

        {/* ── CHARTS ROW ── */}
        <div className="ud-charts">

          {/* Difficulty donut */}
          <div className="ud-card">
            <div className="ud-card__header">
              <h3 className="ud-card__title">Problem Distribution</h3>
              <span className="ud-card__sub">by difficulty</span>
            </div>
            <div className="ud-card__body ud-donut-wrap">
              <div className="ud-donut-chart-area">
                <DonutChart segments={diffSegs} size={110}/>
                <div className="ud-donut-center">
                  <span className="ud-donut-total">{stats?.totalSolved || 0}</span>
                  <span className="ud-donut-sub">solved</span>
                </div>
              </div>
              <div className="ud-donut-legend">
                {diffSegs.map(({ label, value, color }) => (
                  <div key={label} className="ud-donut-legend-row">
                    <span className="ud-donut-legend-dot" style={{ background: color }}/>
                    <span className="ud-donut-legend-label">{label}</span>
                    <span className="ud-donut-legend-val">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Language donut */}
          <div className="ud-card">
            <div className="ud-card__header">
              <h3 className="ud-card__title">Languages Used</h3>
              <span className="ud-card__sub">by submissions</span>
            </div>
            <div className="ud-card__body ud-donut-wrap">
              <div className="ud-donut-chart-area">
                <DonutChart segments={langSegs} size={110}/>
                <div className="ud-donut-center">
                  <span className="ud-donut-total">{Object.values(lc).reduce((a,b)=>a+b,0)}</span>
                  <span className="ud-donut-sub">total</span>
                </div>
              </div>
              <div className="ud-donut-legend">
                {langSegs.map(({ label, value, color }) => (
                  <div key={label} className="ud-donut-legend-row">
                    <span className="ud-donut-legend-dot" style={{ background: color }}/>
                    <span className="ud-donut-legend-label">{label}</span>
                    <span className="ud-donut-legend-val">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skills bars */}
          <div className="ud-card ud-card--wide">
            <div className="ud-card__header">
              <h3 className="ud-card__title">Skills Mastery</h3>
              <span className="ud-card__sub">by topic</span>
            </div>
            <div className="ud-card__body">
              <div className="ud-bars">
                {Object.entries(tc).slice(0, 8).map(([tag, count]) => (
                  <BarRow key={tag} label={tag} value={count} max={maxTag}
                    color="var(--ds-gradient)"/>
                ))}
                {Object.keys(tc).length === 0 && (
                  <p className="ud-empty-text">Solve tagged problems to see mastery data.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ── SOLVED PROBLEMS ── */}
        <div className="ud-card">
          <div className="ud-card__header">
            <h3 className="ud-card__title">🎯 Solved Problems</h3>
            <span className="ud-card__badge">{solved.length}</span>
          </div>
          <div className="ud-card__body ud-card__body--no-pad">
            {solved.length === 0 ? (
              <div className="ud-empty">
                <span className="ud-empty__icon">💡</span>
                <p className="ud-empty__text">No problems solved yet. Start with an easy one!</p>
                <Link to="/" className="ud-empty__link">Browse Problems →</Link>
              </div>
            ) : (
              <div className="ud-solved-list">
                {solved.map((p) => (
                  <Link key={p.id} to={`/problem/${p.id}`} className="ud-solved-row">
                    <div className="ud-solved-row__check">
                      <svg width="11" height="11" fill="none" stroke="currentColor"
                        strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <span className="ud-solved-row__title">{p.title}</span>
                    <div className="ud-solved-row__meta">
                      <span className={`ud-diff ud-diff--${p.difficulty?.toLowerCase()}`}>
                        {p.difficulty}
                      </span>
                      <span className="ud-tag">{p.tags}</span>
                    </div>
                    <span className="ud-solved-row__time">{timeAgo(p.solvedAt)}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── ACHIEVEMENTS ── */}
        {stats?.badges?.length > 0 && (
          <div className="ud-card">
            <div className="ud-card__header">
              <h3 className="ud-card__title">🏆 Achievements</h3>
            </div>
            <div className="ud-card__body">
              <div className="ud-achievements">
                {stats.badges.map((b) => (
                  <div key={b.id} className="ud-achievement">
                    <span className="ud-achievement__icon">{b.icon}</span>
                    <span className="ud-achievement__name">{b.name}</span>
                    <span className="ud-achievement__desc">{b.description}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
