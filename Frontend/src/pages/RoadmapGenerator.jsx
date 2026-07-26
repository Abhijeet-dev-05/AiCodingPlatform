import { useMemo, useState, useEffect } from "react";
import { NavLink } from "react-router";
import axiosClient from "../utils/axiosClient";
import {
  ArrowLeft,
  Sparkles,
  GraduationCap,
  Zap,
  Rocket,
  Award,
  Lightbulb,
  Wrench,
  BookOpen,
  Target,
  Clock,
  TrendingUp,
  DollarSign,
  MapPin,
  Briefcase,
  Code,
  Database,
  Globe,
  Server,
  Star,
  Download,
  Share2,
  ChevronDown,
  ChevronUp,
  Check,
  Loader2,
  AlertCircle,
  Layers,
  FileText,
  Users,
  Heart,
  MessageSquare
} from 'lucide-react';
import "./RoadmapGenerator.css";

const CAREER_SUGGESTIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "DevOps Engineer",
  "Cloud Engineer",
  "Mobile App Developer",
  "AI/ML Engineer",
  "Cybersecurity Analyst",
  "Product Manager",
];

const toArray = (value) => (Array.isArray(value) ? value : []);

const formatRoadmap = (raw) => {
  if (!raw || typeof raw !== "object") return null;

  const phases = toArray(raw.learning_phases);
  const safePhases = [0, 1, 2].map((idx) => {
    const phase = phases[idx] || {};
    return {
      phase_name: phase.phase_name || ["Beginner", "Intermediate", "Advanced"][idx],
      duration: phase.duration || "TBD",
      skills_to_learn: toArray(phase.skills_to_learn).map((skill) => ({
        skill_name: skill?.skill_name || "Core Skill",
        concepts: toArray(skill?.concepts),
        tools: toArray(skill?.tools),
        resources: toArray(skill?.resources),
        practice_projects: toArray(skill?.practice_projects),
      })),
    };
  });

  return {
    career_name: raw.career_name || "Roadmap",
    career_overview: raw.career_overview || "",
    who_is_this_for: raw.who_is_this_for || "",
    estimated_timeline: raw.estimated_timeline || "",
    salary_range_india: raw.salary_range_india || "",
    salary_range_global: raw.salary_range_global || "",
    learning_phases: safePhases,
    real_world_projects: toArray(raw.real_world_projects).map((project) => ({
      name: project?.name || "Project",
      description: project?.description || "",
      key_features: toArray(project?.key_features),
      tech_stack: toArray(project?.tech_stack),
    })),
    certifications: toArray(raw.certifications),
    internship_guidance: raw.internship_guidance || "",
    portfolio_guidance: raw.portfolio_guidance || "",
    interview_preparation: {
      technical_topics: toArray(raw.interview_preparation?.technical_topics),
      system_design_topics: toArray(raw.interview_preparation?.system_design_topics),
      behavioral_preparation: toArray(raw.interview_preparation?.behavioral_preparation),
    },
    career_growth_path: toArray(raw.career_growth_path),
    common_mistakes_to_avoid: toArray(raw.common_mistakes_to_avoid),
    final_advice: raw.final_advice || "",
  };
};

// Phase icons mapping
const PHASE_ICONS = {
  "Beginner": "seed",
  "Intermediate": "trending",
  "Advanced": "rocket"
};

// Progress steps for loading
const LOADING_STEPS = [
  { id: 1, label: "Analyzing career path", icon: Target },
  { id: 2, label: "Building learning phases", icon: GraduationCap },
  { id: 3, label: "Curating projects", icon: Rocket },
  { id: 4, label: "Preparing interview prep", icon: MessageSquare },
];

function RoadmapGenerator() {
  const [career, setCareer] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [activePhase, setActivePhase] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0);
  const [expandedSkills, setExpandedSkills] = useState({});
  const [showSkeleton, setShowSkeleton] = useState(false);

  // Simulate loading progress
  useEffect(() => {
    if (loading) {
      setShowSkeleton(true);
      const interval = setInterval(() => {
        setCurrentLoadingStep((prev) => (prev < 4 ? prev + 1 : prev));
      }, 800);
      return () => clearInterval(interval);
    } else {
      setCurrentLoadingStep(0);
      setShowSkeleton(false);
    }
  }, [loading]);

  const activePhaseData = useMemo(() => {
    if (!roadmap) return null;
    return roadmap.learning_phases[activePhase] || roadmap.learning_phases[0];
  }, [roadmap, activePhase]);

  const roadmapMetrics = useMemo(() => {
    if (!roadmap) return null;
    const totalSkills = roadmap.learning_phases.reduce(
      (count, phase) => count + phase.skills_to_learn.length,
      0,
    );
    return {
      phases: roadmap.learning_phases.length,
      skills: totalSkills,
      projects: roadmap.real_world_projects.length,
      certs: roadmap.certifications.length,
    };
  }, [roadmap]);

  const toggleSkillExpand = (phaseIdx, skillIdx) => {
    const key = `${phaseIdx}-${skillIdx}`;
    setExpandedSkills((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const generateRoadmap = async () => {
    const selectedCareer = career.trim();
    if (!selectedCareer) {
      setError("Enter a career path to generate your roadmap.");
      return;
    }

    setError("");
    setLoading(true);
    setRoadmap(null);
    setActivePhase(0);
    setExpandedSkills({});

    try {
      const response = await axiosClient.post("/career/roadmap", { career: selectedCareer });
      if (!response?.data?.success || !response?.data?.data) {
        throw new Error("Invalid roadmap response");
      }

      const formatted = formatRoadmap(response.data.data);
      if (!formatted) {
        throw new Error("Unable to parse roadmap data");
      }

      setRoadmap(formatted);
    } catch (err) {
      console.error("Roadmap generation failed", err);
      setError(err?.response?.data?.message || "Failed to generate roadmap. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPhaseIcon = (phaseName) => {
    switch (phaseName?.toLowerCase()) {
      case "beginner":
        return <Star size={20} />;
      case "intermediate":
        return <TrendingUp size={20} />;
      case "advanced":
        return <Rocket size={20} />;
      default:
        return <GraduationCap size={20} />;
    }
  };

  return (
    <div className="roadmap-shell">
      {/* Animated Background Glows */}
      <div className="roadmap-glow roadmap-glow-one" />
      <div className="roadmap-glow roadmap-glow-two" />

      {/* Floating Particles */}
      <div className="roadmap-particles">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="roadmap-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${15 + Math.random() * 10}s`,
            }}
          />
        ))}
      </div>

      <main className="roadmap-main-container">
        {/* Back Button + Hero Header */}
        <div className="roadmap-page-header">
          <NavLink to="/" className="roadmap-dashboard-back-link">
            ← Back to Home
          </NavLink>
          <div className="roadmap-hero-title-block">
            <h1 className="roadmap-dashboard-title">
              <span className="roadmap-title-icon">✨</span>
              Career Roadmap Studio
            </h1>
            <p className="roadmap-dashboard-subtitle">Generate a complete, structured IT career roadmap</p>
          </div>
        </div>

        <section className="roadmap-hero">
          <div className="roadmap-input-card">
          <div className="roadmap-input-row">
            <input
              type="text"
              className="roadmap-input"
              value={career}
              onChange={(e) => setCareer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateRoadmap()}
              placeholder="Type a career, e.g. Full Stack Developer"
              disabled={loading}
            />
            <button className="roadmap-generate-btn" onClick={generateRoadmap} disabled={loading}>
              <span className="roadmap-generate-btn-content">
                {loading ? (
                  <>
                    <Loader2 size={16} className="roadmap-spinner-small" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    Generate
                  </>
                )}
              </span>
            </button>
          </div>

          <div className="roadmap-suggestion-row">
            {CAREER_SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                className="roadmap-suggestion-chip"
                onClick={() => setCareer(item)}
                disabled={loading}
              >
                {item}
              </button>
            ))}
          </div>

          {error ? (
            <p className="roadmap-error">
              <AlertCircle size={14} style={{ marginRight: '6px' }} />
              {error}
            </p>
          ) : null}
        </div>
        </section>
      </main>

      {/* Loading State with Progress Steps */}
      {loading ? (
        <section className="roadmap-loading-card">
          <div className="roadmap-loading-content">
            <div className="roadmap-loading-header">
              <div className="roadmap-spinner" />
              <p className="roadmap-loading-text">
                Building your personalized roadmap...
              </p>
            </div>

            <div className="roadmap-progress-steps">
              {LOADING_STEPS.map((step, idx) => {
                const StepIcon = step.icon;
                const isCompleted = currentLoadingStep > idx + 1;
                const isActive = currentLoadingStep === idx + 1;
                return (
                  <div
                    key={step.id}
                    className={`roadmap-progress-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                  >
                    <div className="roadmap-progress-icon">
                      {isCompleted ? <Check size={12} /> : <StepIcon size={12} />}
                    </div>
                    <span className="roadmap-progress-label">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Skeleton Loader */}
      {showSkeleton && !roadmap ? (
        <div className="roadmap-skeleton">
          <div className="roadmap-skeleton-metrics">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="roadmap-skeleton-card">
                <div className="roadmap-skeleton-line short" />
                <div className="roadmap-skeleton-line medium" />
              </div>
            ))}
          </div>
          <div className="roadmap-skeleton-card">
            <div className="roadmap-skeleton-line long" />
            <div className="roadmap-skeleton-line medium" />
            <div className="roadmap-skeleton-line short" />
          </div>
          <div className="roadmap-skeleton-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="roadmap-skeleton-card">
                <div className="roadmap-skeleton-line medium" />
                <div className="roadmap-skeleton-line long" />
                <div className="roadmap-skeleton-line short" />
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Empty State */}
      {!loading && !roadmap ? (
        <section className="roadmap-empty-hero">
          <h2>
            <Target size={24} style={{ marginRight: '10px' }} />
            Pick a Career Goal and Generate
          </h2>
          <p>
            You will get a full plan with phase-wise topics, tools, projects, certifications, internship guidance,
            and interview prep in one structured view.
          </p>
          <div className="roadmap-empty-pill-row">
            <span><GraduationCap size={14} /> Beginner to Advanced Phases</span>
            <span><Rocket size={14} /> Project-Centric Learning</span>
            <span><Target size={14} /> Interview Ready Path</span>
          </div>
        </section>
      ) : null}

      {/* Roadmap Content */}
      {roadmap && roadmapMetrics ? (
        <main className="roadmap-content">
          {/* Metrics Strip */}
          <section className="roadmap-metrics-strip">
            <div className="roadmap-metric-card phases">
              <div className="roadmap-metric-icon">
                <GraduationCap size={16} />
              </div>
              <span className="roadmap-label">Phases</span>
              <strong>{roadmapMetrics.phases}</strong>
            </div>
            <div className="roadmap-metric-card skills">
              <div className="roadmap-metric-icon">
                <Zap size={16} />
              </div>
              <span className="roadmap-label">Core Skills</span>
              <strong>{roadmapMetrics.skills}</strong>
            </div>
            <div className="roadmap-metric-card projects">
              <div className="roadmap-metric-icon">
                <Rocket size={16} />
              </div>
              <span className="roadmap-label">Projects</span>
              <strong>{roadmapMetrics.projects}</strong>
            </div>
            <div className="roadmap-metric-card certs">
              <div className="roadmap-metric-icon">
                <Award size={16} />
              </div>
              <span className="roadmap-label">Certifications</span>
              <strong>{roadmapMetrics.certs}</strong>
            </div>
          </section>

          {/* Overview Panel */}
          <section className="roadmap-panel roadmap-overview-panel">
            <div className="roadmap-overview-head">
              <h2>
                <Briefcase size={28} />
                {roadmap.career_name}
              </h2>
              <p>{roadmap.career_overview}</p>
            </div>

            <div className="roadmap-overview-grid">
              <div className="roadmap-stat-card">
                <div className="roadmap-stat-icon">
                  <Clock size={14} />
                  <span className="roadmap-label">Timeline</span>
                </div>
                <strong>{roadmap.estimated_timeline || "TBD"}</strong>
              </div>
              <div className="roadmap-stat-card">
                <div className="roadmap-stat-icon">
                  <DollarSign size={14} />
                  <span className="roadmap-label">Salary India</span>
                </div>
                <strong>{roadmap.salary_range_india || "TBD"}</strong>
              </div>
              <div className="roadmap-stat-card">
                <div className="roadmap-stat-icon">
                  <Globe size={14} />
                  <span className="roadmap-label">Salary Global</span>
                </div>
                <strong>{roadmap.salary_range_global || "TBD"}</strong>
              </div>
            </div>

            {roadmap.who_is_this_for ? (
              <div className="roadmap-audience-card">
                <span className="roadmap-label">
                  <Users size={12} style={{ marginRight: '6px' }} />
                  Who Is This For
                </span>
                <p>{roadmap.who_is_this_for}</p>
              </div>
            ) : null}
          </section>

          {/* Learning Phases Section */}
          <section className="roadmap-panel">
            <div className="roadmap-section-head">
              <h3>
                <GraduationCap size={20} />
                Learning Phases
              </h3>
            </div>

            {/* Timeline Navigation */}
            <div className="roadmap-phase-timeline">
              {roadmap.learning_phases.map((phase, idx) => (
                <div key={`timeline-${idx}`} style={{ display: 'contents' }}>
                  <div
                    className={`roadmap-timeline-node ${activePhase === idx ? 'active' : ''}`}
                    onClick={() => setActivePhase(idx)}
                  >
                    <div className="roadmap-timeline-circle">
                      {getPhaseIcon(phase.phase_name)}
                    </div>
                    <span className="roadmap-timeline-label">{phase.phase_name}</span>
                    <span className="roadmap-timeline-duration">{phase.duration || "TBD"}</span>
                  </div>
                  {idx < roadmap.learning_phases.length - 1 && (
                    <div className={`roadmap-timeline-connector ${activePhase > idx ? 'active' : ''}`} />
                  )}
                </div>
              ))}
            </div>

            {/* Phase Rail (Alternative) */}
            <div className="roadmap-phase-rail">
              {roadmap.learning_phases.map((phase, idx) => (
                <button
                  key={`${phase.phase_name}-rail-${idx}`}
                  className={`roadmap-rail-step ${activePhase === idx ? "active" : ""}`}
                  onClick={() => setActivePhase(idx)}
                >
                  <span className="roadmap-rail-index">{idx + 1}</span>
                  <div className="roadmap-rail-text">
                    <strong>{phase.phase_name}</strong>
                    <small>{phase.duration || "TBD"}</small>
                  </div>
                </button>
              ))}
            </div>

            {/* Phase Tabs (Mobile) */}
            <div className="roadmap-phase-tabs">
              {roadmap.learning_phases.map((phase, idx) => (
                <button
                  key={`${phase.phase_name}-${idx}`}
                  className={`roadmap-phase-tab ${activePhase === idx ? "active" : ""}`}
                  onClick={() => setActivePhase(idx)}
                >
                  <span>{phase.phase_name}</span>
                  <small>{phase.duration || "TBD"}</small>
                </button>
              ))}
            </div>

            {/* Skills Grid */}
            {activePhaseData ? (
              <div className="roadmap-skill-grid">
                {activePhaseData.skills_to_learn.length > 0 ? (
                  activePhaseData.skills_to_learn.map((skill, idx) => {
                    const isExpanded = expandedSkills[`${activePhase}-${idx}`];
                    return (
                      <article className="roadmap-skill-card" key={`${skill.skill_name}-${idx}`}>
                        <h4>
                          <Code size={16} />
                          {skill.skill_name}
                        </h4>

                        {/* Concepts */}
                        <div className="roadmap-list-block">
                          <span>
                            <Lightbulb size={12} />
                            Concepts
                          </span>
                          <ul>
                            {skill.concepts.length > 0 ? (
                              skill.concepts.slice(0, isExpanded ? undefined : 3).map((concept, cidx) => (
                                <li key={`${concept}-${cidx}`}>{concept}</li>
                              ))
                            ) : (
                              <li>No concepts listed.</li>
                            )}
                            {skill.concepts.length > 3 && !isExpanded && (
                              <li style={{ color: 'var(--pink)', cursor: 'pointer' }}>
                                +{skill.concepts.length - 3} more...
                              </li>
                            )}
                          </ul>
                        </div>

                        {/* Tools */}
                        <div className="roadmap-chip-block">
                          <span>
                            <Wrench size={12} />
                            Tools
                          </span>
                          <div>
                            {skill.tools.length > 0 ? (
                              skill.tools.map((tool, tidx) => (
                                <em key={`${tool}-${tidx}`} className="roadmap-chip">
                                  {tool}
                                </em>
                              ))
                            ) : (
                              <em className="roadmap-chip muted">No tools listed</em>
                            )}
                          </div>
                        </div>

                        {/* Expandable Resources & Projects */}
                        <div className="roadmap-expandable">
                          <div
                            className={`roadmap-expand-header ${isExpanded ? 'expanded' : ''}`}
                            onClick={() => toggleSkillExpand(activePhase, idx)}
                          >
                            <span>{isExpanded ? 'Show less' : 'Show resources & projects'}</span>
                            {isExpanded ? <ChevronUp size={16} className="roadmap-expand-icon" /> : <ChevronDown size={16} className="roadmap-expand-icon" />}
                          </div>
                          <div className={`roadmap-expand-content ${isExpanded ? 'expanded' : ''}`}>
                            <div className="roadmap-list-block">
                              <span>
                                <BookOpen size={12} />
                                Resources
                              </span>
                              <ul>
                                {skill.resources.length > 0 ? (
                                  skill.resources.map((resource, ridx) => (
                                    <li key={`${resource}-${ridx}`}>{resource}</li>
                                  ))
                                ) : (
                                  <li>No resources listed.</li>
                                )}
                              </ul>
                            </div>

                            <div className="roadmap-list-block">
                              <span>
                                <Target size={12} />
                                Practice Projects
                              </span>
                              <ul>
                                {skill.practice_projects.length > 0 ? (
                                  skill.practice_projects.map((project, pidx) => (
                                    <li key={`${project}-${pidx}`}>{project}</li>
                                  ))
                                ) : (
                                  <li>No projects listed.</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })
                ) : (
                  <div className="roadmap-empty">No skills listed for this phase.</div>
                )}
              </div>
            ) : null}
          </section>

          {/* Real-World Projects */}
          <section className="roadmap-panel">
            <div className="roadmap-section-head">
              <h3>
                <Rocket size={20} />
                Real-World Projects
              </h3>
            </div>

            <div className="roadmap-project-grid">
              {roadmap.real_world_projects.length > 0 ? (
                roadmap.real_world_projects.map((project, idx) => (
                  <article className="roadmap-project-card" key={`${project.name}-${idx}`}>
                    <h4>
                      <Layers size={16} />
                      {project.name}
                    </h4>
                    <p>{project.description || "No description provided."}</p>

                    <div className="roadmap-list-block">
                      <span>
                        <Target size={12} />
                        Key Features
                      </span>
                      <ul>
                        {project.key_features.length > 0 ? (
                          project.key_features.slice(0, 4).map((feature, fidx) => (
                            <li key={`${feature}-${fidx}`}>{feature}</li>
                          ))
                        ) : (
                          <li>No key features listed.</li>
                        )}
                        {project.key_features.length > 4 && (
                          <li style={{ color: 'var(--pink)' }}>
                            +{project.key_features.length - 4} more features
                          </li>
                        )}
                      </ul>
                    </div>

                    <div className="roadmap-chip-block">
                      <span>
                        <Wrench size={12} />
                        Tech Stack
                      </span>
                      <div>
                        {project.tech_stack.length > 0 ? (
                          project.tech_stack.map((tech, tidx) => (
                            <em className="roadmap-chip" key={`${tech}-${tidx}`}>
                              {tech}
                            </em>
                          ))
                        ) : (
                          <em className="roadmap-chip muted">No stack listed</em>
                        )}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="roadmap-empty">No real-world projects returned.</div>
              )}
            </div>
          </section>

          {/* Certifications & Career Growth */}
          <section className="roadmap-grid-two">
            <article className="roadmap-panel">
              <div className="roadmap-section-head">
                <h3>
                  <Award size={20} />
                  Certifications
                </h3>
              </div>
              <ul className="roadmap-simple-list">
                {roadmap.certifications.length > 0 ? (
                  roadmap.certifications.map((item, idx) => (
                    <li key={`${item}-${idx}`}>
                      <Award size={12} style={{ color: 'var(--green)', marginRight: '6px' }} />
                      {item}
                    </li>
                  ))
                ) : (
                  <li>No certifications listed.</li>
                )}
              </ul>
            </article>

            <article className="roadmap-panel">
              <div className="roadmap-section-head">
                <h3>
                  <TrendingUp size={20} />
                  Career Growth Path
                </h3>
              </div>
              <div className="roadmap-growth-row">
                {roadmap.career_growth_path.length > 0 ? (
                  roadmap.career_growth_path.map((step, idx) => (
                    <div className="roadmap-growth-step" key={`${step}-${idx}`}>
                      <span>{idx + 1}</span>
                      <p>{step}</p>
                    </div>
                  ))
                ) : (
                  <div className="roadmap-empty">No growth path listed.</div>
                )}
              </div>
            </article>
          </section>

          {/* Internship & Portfolio Guidance */}
          <section className="roadmap-grid-two">
            <article className="roadmap-panel">
              <div className="roadmap-section-head">
                <h3>
                  <Briefcase size={20} />
                  Internship Guidance
                </h3>
              </div>
              <p className="roadmap-paragraph">{roadmap.internship_guidance || "No guidance provided."}</p>
            </article>

            <article className="roadmap-panel">
              <div className="roadmap-section-head">
                <h3>
                  <FileText size={20} />
                  Portfolio Guidance
                </h3>
              </div>
              <p className="roadmap-paragraph">{roadmap.portfolio_guidance || "No guidance provided."}</p>
            </article>
          </section>

          {/* Interview Preparation */}
          <section className="roadmap-panel">
            <div className="roadmap-section-head">
              <h3>
                <MessageSquare size={20} />
                Interview Preparation
              </h3>
            </div>
            <div className="roadmap-grid-three">
              <div>
                <h4>
                  <Code size={16} />
                  Technical Topics
                </h4>
                <ul className="roadmap-simple-list">
                  {roadmap.interview_preparation.technical_topics.length > 0 ? (
                    roadmap.interview_preparation.technical_topics.map((topic, idx) => (
                      <li key={`${topic}-${idx}`}>{topic}</li>
                    ))
                  ) : (
                    <li>No technical topics listed.</li>
                  )}
                </ul>
              </div>
              <div>
                <h4>
                  <Server size={16} />
                  System Design Topics
                </h4>
                <ul className="roadmap-simple-list">
                  {roadmap.interview_preparation.system_design_topics.length > 0 ? (
                    roadmap.interview_preparation.system_design_topics.map((topic, idx) => (
                      <li key={`${topic}-${idx}`}>{topic}</li>
                    ))
                  ) : (
                    <li>No system design topics listed.</li>
                  )}
                </ul>
              </div>
              <div>
                <h4>
                  <Heart size={16} />
                  Behavioral Preparation
                </h4>
                <ul className="roadmap-simple-list">
                  {roadmap.interview_preparation.behavioral_preparation.length > 0 ? (
                    roadmap.interview_preparation.behavioral_preparation.map((topic, idx) => (
                      <li key={`${topic}-${idx}`}>{topic}</li>
                    ))
                  ) : (
                    <li>No behavioral topics listed.</li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          {/* Common Mistakes & Final Advice */}
          <section className="roadmap-grid-two">
            <article className="roadmap-panel">
              <div className="roadmap-section-head">
                <h3>
                  <AlertCircle size={20} />
                  Common Mistakes To Avoid
                </h3>
              </div>
              <ul className="roadmap-simple-list">
                {roadmap.common_mistakes_to_avoid.length > 0 ? (
                  roadmap.common_mistakes_to_avoid.map((item, idx) => (
                    <li key={`${item}-${idx}`}>{item}</li>
                  ))
                ) : (
                  <li>No common mistakes listed.</li>
                )}
              </ul>
            </article>

            <article className="roadmap-panel roadmap-final-advice">
              <div className="roadmap-section-head">
                <h3>
                  <Sparkles size={20} />
                  Final Advice
                </h3>
              </div>
              <p>{roadmap.final_advice || "No final advice provided."}</p>
            </article>
          </section>

          {/* Action Buttons */}
          <div className="roadmap-actions">
            <button className="roadmap-action-btn" onClick={() => window.print()}>
              <Download size={16} />
              Export Roadmap
            </button>
            <button className="roadmap-action-btn primary" onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}>
              <Share2 size={16} />
              Share Roadmap
            </button>
          </div>
        </main>
      ) : null}
    </div>
  );
}

export default RoadmapGenerator;
