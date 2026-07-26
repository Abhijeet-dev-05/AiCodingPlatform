import { useEffect, useState, useCallback } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";
import "./HomePage.css";

// ── Icons (inline SVG so no extra deps) ────────────────────────────────────
const Icon = {
  Check: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  BarChart: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="18" y="3" width="4" height="18"/><rect x="10" y="8" width="4" height="13"/><rect x="2" y="13" width="4" height="8"/>
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Clock: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Map: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
    </svg>
  ),
  Brain: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M12 2a5 5 0 0 1 5 5c1.66 0 3 1.34 3 3a3 3 0 0 1-1.5 2.6A3 3 0 0 1 17 16a3 3 0 0 1-5 0 3 3 0 0 1-5 0 3 3 0 0 1-1.5-2.4A3 3 0 0 1 4 10c0-1.66 1.34-3 3-3a5 5 0 0 1 5-5z"/>
    </svg>
  ),
  Briefcase: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    </svg>
  ),
  Mic: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="9" y="2" width="6" height="11" rx="3"/><path d="M19 10a7 7 0 0 1-14 0"/><line x1="12" y1="19" x2="12" y2="22"/>
    </svg>
  ),
  User: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  Dashboard: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  ),
  Settings: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  LogOut: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Chevron: () => (
    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  ),
  Menu: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Close: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Circle: () => (
    <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="9"/><path d="M8.7 9.5h6.6M8.7 12.5h4.4" strokeLinecap="round"/>
    </svg>
  ),
  Percent: () => (
    <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="19" y1="5" x2="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
    </svg>
  ),
};

const TAGS = ['array','linkedlist','graph','dp','string','sliding-window','two-pointers','hashing','stack','queue','tree','binary-tree','bst','heap','sorting','searching','binary-search'];
const PER_PAGE = 8;

export default function HomePage() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const [problems, setProblems] = useState([]);
  const [solved, setSolved] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ difficulty: 'all', tag: 'all', status: 'all' });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosClient.get('/problem/getAllProblems');
        setProblems(Array.isArray(data) ? data : []);
      } catch { setProblems([]); }
      finally { setLoading(false); }
    })();
    if (user) {
      axiosClient.get('/problem/problemSolvedByUser')
        .then(({ data }) => setSolved(Array.isArray(data) ? data : []))
        .catch(() => setSolved([]));
    }
  }, [user]);

  const isSolved = (p) => solved.some((s) => s._id === p._id);

  const filtered = problems.filter((p) => {
    if (filters.difficulty !== 'all' && p.difficulty !== filters.difficulty) return false;
    if (filters.tag !== 'all' && p.tags !== filters.tag) return false;
    if (filters.status === 'solved'   && !isSolved(p)) return false;
    if (filters.status === 'unsolved' &&  isSolved(p)) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  useEffect(() => setPage(1), [search, filters]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const solvedCount     = solved.length;
  const totalCount      = problems.length;
  const remaining       = totalCount - solvedCount;
  const completionRate  = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;
  const initials        = user?.firstName?.[0]?.toUpperCase() ?? '?';

  const setFilter = (key, val) => setFilters((f) => ({ ...f, [key]: val }));

  return (
    <div className="hp-root" onClick={() => { menuOpen && setMenuOpen(false); mobileNavOpen && setMobileNavOpen(false); }}>

      {/* ── NAVBAR ── */}
      <nav className="hp-nav">
        <NavLink to="/" className="hp-nav__logo">CodeArena</NavLink>

        <div className="hp-nav__center">
          <span className={`hp-nav__link hp-nav__link--solved`}>
            <Icon.Check /> {solvedCount}/{totalCount} Solved
          </span>
          <NavLink to="/visualizer" className="hp-nav__link hp-nav__link--viz">
            <Icon.BarChart /> Visualizer
          </NavLink>
          <NavLink to="/roadmap" className="hp-nav__link hp-nav__link--road">
            <Icon.Map /> Roadmap
          </NavLink>
          <NavLink to="/review" className="hp-nav__link hp-nav__link--review">
            <Icon.Brain /> Review Queue
          </NavLink>
          <NavLink to="/career" className="hp-nav__link hp-nav__link--career">
            <Icon.Briefcase /> Career Guide
          </NavLink>
          <NavLink to="/ai-interview" className="hp-nav__link hp-nav__link--ai">
            <Icon.Mic /> AI Interview
          </NavLink>
        </div>

        <div className="hp-nav__right">
          {/* Hamburger — mobile only */}
          <button
            className="hp-hamburger"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileNavOpen}
            onClick={(e) => { e.stopPropagation(); setMobileNavOpen((v) => !v); setMenuOpen(false); }}
          >
            {mobileNavOpen ? <Icon.Close /> : <Icon.Menu />}
          </button>

          <div
            className={`hp-user-menu ${menuOpen ? 'hp-user-menu--open' : ''}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="hp-user-btn" onClick={() => setMenuOpen((v) => !v)}>
              <span className="hp-user-avatar">{initials}</span>
              {user?.firstName}
              <span className="hp-chevron"><Icon.Chevron /></span>
            </button>

            {menuOpen && (
              <ul className="hp-dropdown">
                <li>
                  <NavLink to="/dashboard" className="hp-dropdown__item" onClick={() => setMenuOpen(false)}>
                    <Icon.Dashboard /> My Dashboard
                  </NavLink>
                </li>
                {user?.role === 'admin' && (
                  <li>
                    <NavLink to="/admin" className="hp-dropdown__item" onClick={() => setMenuOpen(false)}>
                      <Icon.Settings /> Admin Panel
                    </NavLink>
                  </li>
                )}
                <li><div className="hp-dropdown__divider" /></li>
                <li>
                  <button
                    className="hp-dropdown__item hp-dropdown__item--danger"
                    onClick={() => { dispatch(logoutUser()); setSolved([]); setMenuOpen(false); }}
                  >
                    <Icon.LogOut /> Sign Out
                  </button>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>

      {/* ── MOBILE NAV DRAWER ── */}
      {mobileNavOpen && (
        <div className="hp-mobile-nav" onClick={(e) => e.stopPropagation()}>
          <span className={`hp-nav__link hp-nav__link--solved`}>
            <Icon.Check /> {solvedCount}/{totalCount} Solved
          </span>
          <NavLink to="/visualizer" className="hp-nav__link hp-nav__link--viz" onClick={() => setMobileNavOpen(false)}>
            <Icon.BarChart /> Visualizer
          </NavLink>
          <NavLink to="/roadmap" className="hp-nav__link hp-nav__link--road" onClick={() => setMobileNavOpen(false)}>
            <Icon.Map /> Roadmap
          </NavLink>
          <NavLink to="/review" className="hp-nav__link hp-nav__link--review" onClick={() => setMobileNavOpen(false)}>
            <Icon.Brain /> Review Queue
          </NavLink>
          <NavLink to="/career" className="hp-nav__link hp-nav__link--career" onClick={() => setMobileNavOpen(false)}>
            <Icon.Briefcase /> Career Guide
          </NavLink>
          <NavLink to="/ai-interview" className="hp-nav__link hp-nav__link--ai" onClick={() => setMobileNavOpen(false)}>
            <Icon.Mic /> AI Interview
          </NavLink>
        </div>
      )}

      {/* ── MAIN ── */}
      <main className="hp-main">

        {/* Welcome */}
        <div className="hp-welcome">
          <h1 className="hp-welcome__title">
            Welcome back, <span className="hp-welcome__name">{user?.firstName}</span>
          </h1>
          <p className="hp-welcome__sub">Keep the streak going — every problem solved is a step closer to your dream job.</p>
        </div>

        {/* Stats */}
        <div className="hp-stats">
          <div className="hp-stat">
            <div className="hp-stat__icon hp-stat__icon--solved"><Icon.Check /></div>
            <div>
              <div className="hp-stat__value">{solvedCount}</div>
              <div className="hp-stat__label">Solved</div>
            </div>
          </div>
          <div className="hp-stat">
            <div className="hp-stat__icon hp-stat__icon--total"><Icon.BarChart /></div>
            <div>
              <div className="hp-stat__value">{totalCount}</div>
              <div className="hp-stat__label">Total</div>
            </div>
          </div>
          <div className="hp-stat">
            <div className="hp-stat__icon hp-stat__icon--rate"><Icon.Percent /></div>
            <div>
              <div className="hp-stat__value">{completionRate}%</div>
              <div className="hp-stat__label">Complete</div>
            </div>
          </div>
          <div className="hp-stat">
            <div className="hp-stat__icon hp-stat__icon--remain"><Icon.Clock /></div>
            <div>
              <div className="hp-stat__value">{remaining}</div>
              <div className="hp-stat__label">Remaining</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="hp-progress">
          <span className="hp-progress__label">Overall Progress</span>
          <div className="hp-progress__track">
            <div className="hp-progress__fill" style={{ width: `${completionRate}%` }} />
          </div>
          <span className="hp-progress__pct">{completionRate}%</span>
        </div>

        {/* Toolbar */}
        <div className="hp-toolbar">
          <div className="hp-search">
            <span className="hp-search__icon"><Icon.Search /></span>
            <input
              className="hp-search__input"
              placeholder="Search problems…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select className="hp-filter" value={filters.status} onChange={(e) => setFilter('status', e.target.value)}>
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
            <option value="unsolved">Unsolved</option>
          </select>

          <select className="hp-filter" value={filters.difficulty} onChange={(e) => setFilter('difficulty', e.target.value)}>
            <option value="all">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select className="hp-filter" value={filters.tag} onChange={(e) => setFilter('tag', e.target.value)}>
            <option value="all">All Tags</option>
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <span className="hp-results-pill">{filtered.length} Result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="hp-loading">
            <div className="hp-spinner" />
            <span className="hp-loading__text">Loading problems…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="hp-empty">
            <svg className="hp-empty__icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <h3 className="hp-empty__title">No problems found</h3>
            <p className="hp-empty__desc">Try adjusting your search or filters</p>
            <button
              style={{ marginTop: 12, padding: '7px 18px', background: 'var(--ds-brand-dim)', border: '1px solid var(--ds-brand-border)', borderRadius: 'var(--ds-radius-md)', color: 'var(--ds-brand)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => { setFilters({ difficulty: 'all', tag: 'all', status: 'all' }); setSearch(''); }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="hp-table">
              <div className="hp-table__header">
                <span className="hp-table__th">#</span>
                <span className="hp-table__th">Title</span>
                <span className="hp-table__th">Status</span>
                <span className="hp-table__th">Difficulty</span>
                <span className="hp-table__th">Tag</span>
              </div>
              {paginated.map((p, idx) => (
                <div key={p._id} className="hp-row">
                  <span className="hp-row__num">{(page - 1) * PER_PAGE + idx + 1}</span>
                  <div className="hp-row__title-wrap">
                    <NavLink to={`/problem/${p._id}`} className="hp-row__link">{p.title}</NavLink>
                  </div>
                  <div>
                    {isSolved(p) && (
                      <span className="hp-row__solved-chip">
                        <svg width="9" height="9" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
                        Solved
                      </span>
                    )}
                  </div>
                  <span className={`hp-diff hp-diff--${p.difficulty}`}>{p.difficulty}</span>
                  <span className="hp-tag">{p.tags}</span>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="hp-pagination">
                <button className="hp-page-btn" onClick={() => setPage((v) => v - 1)} disabled={page === 1}>← Prev</button>
                <span className="hp-page-info">Page {page} of {totalPages}</span>
                <button className="hp-page-btn" onClick={() => setPage((v) => v + 1)} disabled={page === totalPages}>Next →</button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
