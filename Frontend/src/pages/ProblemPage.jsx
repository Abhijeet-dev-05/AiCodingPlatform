import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams, Link } from 'react-router';
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from '../components/ChatAi';
import Editorial from '../components/Editorial';
import CodeReview from '../components/CodeReview';
import SolutionsTab from '../components/SolutionsTab';
import './ProblemPage.css';

const LANG_DISPLAY = { cpp:'C++', java:'Java', javascript:'JavaScript', python:'Python' };
const LANGUAGES    = ['javascript','java','cpp','python'];

export default function ProblemPage() {
  const { problemId }         = useParams();
  const editorRef             = useRef(null);

  const [problem,             setProblem]             = useState(null);
  const [lang,                setLang]                = useState('javascript');
  const [code,                setCode]                = useState('');
  const [loading,             setLoading]             = useState(true);
  const [running,             setRunning]             = useState(false);
  const [submitting,          setSubmitting]          = useState(false);
  const [runResult,           setRunResult]           = useState(null);
  const [submitResult,        setSubmitResult]        = useState(null);
  const [latestSubmissionId,  setLatestSubmissionId]  = useState(null);
  const [leftTab,             setLeftTab]             = useState('description');
  const [rightTab,            setRightTab]            = useState('code');
  const [videoEditorial,      setVideoEditorial]      = useState(null);
  const [videoLoading,        setVideoLoading]        = useState(false);

  /* fetch problem */
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axiosClient.get(`/problem/problemById/${problemId}`);
        setProblem(data);
        setCode(getStartCode(data, lang));
      } catch {
        setCode('// Error loading problem');
      } finally {
        setLoading(false);
      }
    })();
  }, [problemId]);

  /* fetch video editorial */
  useEffect(() => {
    if (leftTab === 'editorial' && !videoEditorial && !videoLoading) {
      setVideoLoading(true);
      axiosClient.get(`/video/get/${problemId}`)
        .then(({ data }) => setVideoEditorial(data.exists ? data.video : null))
        .catch(() => setVideoEditorial(null))
        .finally(() => setVideoLoading(false));
    }
  }, [leftTab, problemId]);

  /* language change */
  useEffect(() => {
    if (problem) setCode(getStartCode(problem, lang));
  }, [lang, problem]);

  function getStartCode(p, language) {
    const displayLang = LANG_DISPLAY[language];
    return (
      p.startCode?.find(sc => sc.language?.toLowerCase() === displayLang?.toLowerCase()) ||
      p.startCode?.find(sc => sc.language?.toLowerCase() === language?.toLowerCase()) ||
      p.startCode?.[0]
    )?.initialCode || '// Write your solution here\n';
  }

  const handleRun = async () => {
    setRunning(true); setRunResult(null);
    try {
      const { data } = await axiosClient.post(`/submission/run/${problemId}`, { code, language: lang });
      setRunResult(data);
    } catch {
      setRunResult({ success: false, error: 'Failed to run code' });
    } finally {
      setRunning(false);
      setRightTab('testcase');
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true); setSubmitResult(null);
    try {
      const { data } = await axiosClient.post(`/submission/submit/${problemId}`, { code, language: lang });
      setSubmitResult(data);
      if (data.submissionId) setLatestSubmissionId(data.submissionId);
    } catch {
      setSubmitResult({ accepted: false, error: 'Submission failed' });
    } finally {
      setSubmitting(false);
      setRightTab('result');
    }
  };

  if (loading) return (
    <div className="pp-loading">
      <div className="pp-spinner" />
      <span>Loading problem…</span>
    </div>
  );

  const LEFT_TABS  = ['description','editorial','solutions','submissions','ai-tutor'];
  const RIGHT_TABS = ['code','testcase','result','code-review'];

  const tabLabel = (t) => ({
    'ai-tutor'  : '🤖 AI Tutor',
    'code-review': '🔍 Review',
    'testcase'  : 'Test Cases',
    'description': 'Description',
    'editorial' : 'Editorial',
    'solutions' : 'Solutions',
    'submissions': 'Submissions',
    'code'      : 'Code',
    'result'    : 'Result',
  }[t] ?? t);

  return (
    <div className="pp-root">

      {/* ── TOP BAR ── */}
      <header className="pp-topbar">
        <Link to="/" className="pp-topbar__back">
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5"
            strokeLinecap="round" viewBox="0 0 24 24">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          Problems
        </Link>

        <Link to="/" className="pp-topbar__logo">CodeArena</Link>

        <div className="pp-topbar__right">
          {problem && (
            <>
              <span className={`pp-diff pp-diff--${problem.difficulty}`}>{problem.difficulty}</span>
              <span className="pp-tag">{problem.tags}</span>
            </>
          )}
        </div>
      </header>

      {/* ── SPLIT PANEL ── */}
      <div className="pp-split">

        {/* ── LEFT PANEL — Problem Info ── */}
        <div className="pp-panel pp-panel--left">
          <div className="pp-tabs" role="tablist">
            {LEFT_TABS.map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={leftTab === t}
                className={`pp-tab ${leftTab === t ? 'pp-tab--active' : ''}`}
                onClick={() => setLeftTab(t)}
              >
                {tabLabel(t)}
              </button>
            ))}
          </div>

          <div className="pp-content">
            {problem && (
              <>
                {/* Description */}
                {leftTab === 'description' && (
                  <>
                    <h1 className="pp-problem-title">{problem.title}</h1>
                    <div className="pp-meta">
                      <span className={`pp-diff pp-diff--${problem.difficulty}`}>{problem.difficulty}</span>
                      <span className="pp-tag">{problem.tags}</span>
                    </div>
                    <p className="pp-description">{problem.description}</p>

                    {problem.visibleTestCases?.length > 0 && (
                      <>
                        <h3 className="pp-examples-title">Examples</h3>
                        {problem.visibleTestCases.map((tc, idx) => (
                          <div key={idx} className="pp-example">
                            <div className="pp-example__heading">Example {idx + 1}</div>
                            <div className="pp-example__row">
                              <span className="pp-example__key">Input</span>
                              <span className="pp-example__val">{tc.input}</span>
                            </div>
                            <div className="pp-example__row">
                              <span className="pp-example__key">Output</span>
                              <span className="pp-example__val">{tc.output}</span>
                            </div>
                            {tc.explanation && (
                              <div className="pp-example__row">
                                <span className="pp-example__key">Explanation</span>
                                <span className="pp-example__val">{tc.explanation}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}

                {/* Editorial */}
                {leftTab === 'editorial' && (
                  videoLoading ? (
                    <div className="pp-editorial-loading">
                      <div className="pp-spinner" />
                      <span>Loading video editorial…</span>
                    </div>
                  ) : videoEditorial ? (
                    <Editorial
                      secureUrl={videoEditorial.secureUrl}
                      thumbnailUrl={videoEditorial.thumbnailUrl}
                      duration={videoEditorial.duration}
                      problemTitle={problem?.title}
                    />
                  ) : (
                    <div className="pp-no-video">
                      <div className="pp-no-video__icon">🎬</div>
                      <h3 className="pp-no-video__title">Video Coming Soon</h3>
                      <p className="pp-no-video__desc">
                        We're working on a comprehensive video walkthrough for this problem. Check back soon!
                      </p>
                    </div>
                  )
                )}

                {leftTab === 'solutions'    && <SolutionsTab solutions={problem.referenceSolution} />}
                {leftTab === 'submissions'  && <SubmissionHistory problemId={problemId} />}
                {leftTab === 'ai-tutor'     && <ChatAi problem={problem} />}
              </>
            )}
          </div>
        </div>

        {/* ── RIGHT PANEL — Code Editor ── */}
        <div className="pp-panel pp-panel--right">
          <div className="pp-tabs" role="tablist">
            {RIGHT_TABS.map(t => (
              <button
                key={t}
                role="tab"
                aria-selected={rightTab === t}
                className={`pp-tab ${rightTab === t ? 'pp-tab--active' : ''}`}
                onClick={() => setRightTab(t)}
              >
                {tabLabel(t)}
              </button>
            ))}
          </div>

          {/* Code Editor */}
          {rightTab === 'code' && (
            <div className="pp-editor-wrap">
              {/* Language buttons */}
              <div className="pp-lang-bar">
                {LANGUAGES.map(l => (
                  <button
                    key={l}
                    className={`pp-lang-btn ${lang === l ? 'pp-lang-btn--active' : ''}`}
                    onClick={() => setLang(l)}
                  >
                    {LANG_DISPLAY[l]}
                  </button>
                ))}
              </div>

              {/* Monaco */}
              <div className="pp-monaco">
                <Editor
                  height="100%"
                  width="100%"
                  language={lang === 'cpp' ? 'cpp' : lang}
                  value={code}
                  onChange={(v) => setCode(v || '')}
                  onMount={(e) => { editorRef.current = e; }}
                  theme="vs-dark"
                  options={{
                    fontSize: 13,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontLigatures: true,
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                    lineNumbers: 'on',
                    renderLineHighlight: 'line',
                    cursorBlinking: 'smooth',
                    smoothScrolling: true,
                    padding: { top: 14, bottom: 14 },
                    scrollbar: { verticalScrollbarSize: 4 },
                  }}
                />
              </div>

              {/* Action bar */}
              <div className="pp-action-bar">
                <button className="pp-console-btn" onClick={() => setRightTab('testcase')}>
                  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" viewBox="0 0 24 24">
                    <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
                  </svg>
                  Console
                </button>
                <div className="pp-action-bar__right">
                  <button
                    className="pp-run-btn"
                    onClick={handleRun}
                    disabled={running || submitting}
                  >
                    {running ? (
                      <><span style={{width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.2)',borderTopColor:'currentColor',animation:'ds-spin 0.65s linear infinite',display:'inline-block'}} /> Running…</>
                    ) : (
                      <><svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg> Run</>
                    )}
                  </button>
                  <button
                    className="pp-submit-btn"
                    onClick={handleSubmit}
                    disabled={running || submitting}
                  >
                    {submitting ? (
                      <><span style={{width:12,height:12,borderRadius:'50%',border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'white',animation:'ds-spin 0.65s linear infinite',display:'inline-block'}} /> Submitting…</>
                    ) : (
                      <><svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Submit</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Test Results */}
          {rightTab === 'testcase' && (
            <div className="pp-results">
              <h3 className="pp-results__title">Test Results</h3>
              {runResult ? (
                <div className={`pp-result-alert pp-result-alert--${runResult.success ? 'success' : 'error'}`}>
                  <p className="pp-result-alert__heading">
                    {runResult.success ? '✅ All Tests Passed' : '❌ Some Tests Failed'}
                  </p>
                  {(runResult.runtime || runResult.memory) && (
                    <div className="pp-result-stats">
                      {runResult.runtime && <span className="pp-result-stat"><strong>Runtime:</strong> {runResult.runtime}s</span>}
                      {runResult.memory  && <span className="pp-result-stat"><strong>Memory:</strong> {runResult.memory} KB</span>}
                    </div>
                  )}
                  {runResult.testCases && (
                    <div className="pp-tc-list">
                      {runResult.testCases.map((tc, i) => {
                        const passed = tc.status_id === 3;
                        return (
                          <div key={i} className={`pp-tc pp-tc--${passed ? 'passed' : 'failed'}`}>
                            <div className="pp-tc__row">
                              <span className="pp-tc__key">Input</span>
                              <span className="pp-tc__val">{tc.stdin}</span>
                            </div>
                            <div className="pp-tc__row">
                              <span className="pp-tc__key">Expected</span>
                              <span className="pp-tc__val">{tc.expected_output}</span>
                            </div>
                            <div className="pp-tc__row">
                              <span className="pp-tc__key">Output</span>
                              <span className="pp-tc__val">{tc.stdout}</span>
                            </div>
                            <span className="pp-tc__status">{passed ? '✓ Passed' : '✗ Failed'}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ) : (
                <div className="pp-empty">
                  <div className="pp-empty__emoji">🧪</div>
                  <p className="pp-empty__text">Click <strong>Run</strong> to test your code</p>
                </div>
              )}
            </div>
          )}

          {/* Submission Result */}
          {rightTab === 'result' && (
            <div className="pp-results">
              <h3 className="pp-results__title">Submission Result</h3>
              {submitResult ? (
                <div className={`pp-result-alert pp-result-alert--${submitResult.accepted ? 'success' : 'error'}`}>
                  <p className="pp-result-alert__heading">
                    {submitResult.accepted ? '🎉 Accepted!' : `❌ ${submitResult.error || 'Wrong Answer'}`}
                  </p>
                  <div className="pp-result-stats">
                    <span className="pp-result-stat">
                      <strong>Tests:</strong> {submitResult.passedTestCases}/{submitResult.totalTestCases}
                    </span>
                    {submitResult.runtime && (
                      <span className="pp-result-stat"><strong>Runtime:</strong> {submitResult.runtime}s</span>
                    )}
                    {submitResult.memory && (
                      <span className="pp-result-stat"><strong>Memory:</strong> {submitResult.memory} KB</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="pp-empty">
                  <div className="pp-empty__emoji">🚀</div>
                  <p className="pp-empty__text">Click <strong>Submit</strong> to submit your solution</p>
                </div>
              )}
            </div>
          )}

          {/* Code Review */}
          {rightTab === 'code-review' && (
            <CodeReview
              problemId={problemId}
              code={code}
              language={lang}
              latestSubmissionId={latestSubmissionId || submitResult?.submissionId}
            />
          )}
        </div>
      </div>
    </div>
  );
}
