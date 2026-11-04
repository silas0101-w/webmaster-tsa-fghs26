import { useCallback, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { ApiError, apiRequest } from '../lib/api'
import { ArrowRight, Check, CheckCircle2, Film, LockKeyhole, Menu, X } from 'lucide-react'
import LessonModal, { type LessonViewMode } from '../components/LessonModal'
import ProgressPage from '../components/ProgressPage'
import BadgesPage, { buildBadgeCatalog } from '../components/BadgesPage'
import { modules, levelForXp, type Lesson, type Module } from '../data/content'
import '../App.css'

type Progress = {
  xp: number
  lessons: string[]
  badges: string[]
  videoProgress: Record<string, number>
}

const STORAGE_KEY = 'spark-ai-learning-progress'
const emptyProgress: Progress = { xp: 0, lessons: [], badges: [], videoProgress: {} }

function sanitizeVideoProgress(raw: unknown): Record<string, number> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {}
  const out: Record<string, number> = {}
  for (const [key, val] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof val === 'number' && Number.isFinite(val)) {
      out[key] = Math.max(0, Math.min(100, Math.round(val)))
    }
  }
  return out
}

function readProgress(): Progress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return emptyProgress
    const parsed = JSON.parse(saved) as Partial<Progress>
    return {
      xp: Number(parsed.xp) || 0,
      lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [],
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      videoProgress: sanitizeVideoProgress(parsed.videoProgress),
    }
  } catch {
    return emptyProgress
  }
}

export default function Home() {
  const pathname = useLocation().pathname
  const isCoursesPage = pathname === '/courses'
  const isProgressPage = pathname === '/progress'
  const isBadgesPage = pathname === '/badges'
  const { user, logout } = useAuth()
  const userId = user?.userId
  // Guest progress lives in localStorage under STORAGE_KEY. Signed-in progress lives on the
  // server and is never written to the guest key, so signing out restores the guest's own
  // notebook instead of leaking the account's progress onto a shared device.
  const [progress, setProgress] = useState<Progress>(() => (userId ? emptyProgress : readProgress()))
  const [sessionUserId, setSessionUserId] = useState(userId)
  const [loadedUserId, setLoadedUserId] = useState<string | null>(null)
  const [syncError, setSyncError] = useState<string | null>(null)
  if (sessionUserId !== userId) {
    // Account changed (sign in/out) — reset during render so no effect sees mixed state.
    setSessionUserId(userId)
    setLoadedUserId(null)
    setSyncError(null)
    setProgress(userId ? emptyProgress : readProgress())
  }
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [lessonViewMode, setLessonViewMode] = useState<LessonViewMode>('both')
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0)
  const [quizMode, setQuizMode] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<{ questionIndex: number; answer: number }[]>([])
  const [mobileNav, setMobileNav] = useState(false)

  const level = levelForXp(progress.xp)
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0)
  const completedCount = progress.lessons.length
  const overall = Math.round((completedCount / totalLessons) * 100)

  useEffect(() => {
    if (!userId) localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress, userId])

  useEffect(() => {
    let cancelled = false
    if (!userId) return
    apiRequest<Partial<Progress>>('/api/progress')
      .then(saved => {
        if (cancelled) return
        setProgress({
          xp: Number(saved.xp) || 0,
          lessons: Array.isArray(saved.lessons) ? saved.lessons : [],
          badges: Array.isArray(saved.badges) ? saved.badges : [],
          videoProgress: sanitizeVideoProgress(saved.videoProgress),
        })
        // Only enable saving after a successful load, so a failed load never overwrites server progress.
        setLoadedUserId(userId)
      })
      .catch(error => {
        if (cancelled) return
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          logout()
          return
        }
        console.error('Could not load saved progress:', error)
        setSyncError('Could not reach the progress server. Changes in this session will not be saved to your account.')
      })
    return () => {
      cancelled = true
    }
  }, [userId, logout])

  useEffect(() => {
    if (!userId || loadedUserId !== userId) return
    apiRequest('/api/progress', { method: 'POST', body: JSON.stringify({ progress }) })
      .then(() => setSyncError(null))
      .catch(error => {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          logout()
          return
        }
        console.error('Could not save progress:', error)
        setSyncError('Your latest progress has not been saved to your account yet.')
      })
  }, [progress, loadedUserId, userId, logout])

  useEffect(() => {
    if (!activeModule) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveModule(null)
        setActiveLesson(null)
        setQuizMode(false)
        setVideoPlaying(false)
        setActiveSegmentIndex(0)
      }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [activeModule])

  const updateVideoProgress = useCallback((lessonId: string, percent: number) => {
    const clamped = Math.max(0, Math.min(100, Math.round(percent)))
    setProgress(current => {
      if ((current.videoProgress[lessonId] ?? 0) === clamped) return current
      return {
        ...current,
        videoProgress: {
          ...current.videoProgress,
          [lessonId]: clamped,
        },
      }
    })
  }, [])

  function selectLesson(lesson: Lesson | null) {
    setActiveLesson(lesson)
    setVideoPlaying(false)
    setActiveSegmentIndex(0)
  }

  function startModule(module: Module, lesson?: Lesson, initialViewMode: LessonViewMode = 'both') {
    setActiveModule(module)
    selectLesson(lesson ?? module.lessons.find(item => !progress.lessons.includes(item.id)) ?? module.lessons[0])
    setLessonViewMode(initialViewMode)
    setQuizMode(false)
    setQuestionIndex(0)
    setSelectedAnswer(null)
    setQuizScore(0)
    setQuizFinished(false)
    setQuizAnswers([])
  }

  function closeLearning() {
    setActiveModule(null)
    selectLesson(null)
    setQuizMode(false)
  }

  function completeLesson() {
    if (!activeLesson || !activeModule) return
    const next = activeModule.lessons[activeModule.lessons.findIndex(item => item.id === activeLesson.id) + 1]
    if (next) selectLesson(next)
    else {
      selectLesson(null)
      setQuizMode(true)
    }
  }

  function previousLesson() {
    if (!activeLesson || !activeModule) return
    const currentIndex = activeModule.lessons.findIndex(item => item.id === activeLesson.id)
    if (currentIndex > 0) selectLesson(activeModule.lessons[currentIndex - 1])
  }

  function answerQuestion() {
    if (!activeModule || selectedAnswer === null) return
    const isCorrect = selectedAnswer === activeModule.quiz[questionIndex].answer
    const newScore = quizScore + (isCorrect ? 1 : 0)
    setQuizScore(newScore)

    const newAnswers = [...quizAnswers, { questionIndex, answer: selectedAnswer }]
    setQuizAnswers(newAnswers)

    if (questionIndex + 1 < activeModule.quiz.length) {
      setQuestionIndex(questionIndex + 1)
      setSelectedAnswer(null)
    } else {
      setQuizFinished(true)
      const passingScore = Math.ceil(activeModule.quiz.length * 0.75)
      if (newScore >= passingScore) {
        setProgress(current => {
          const newLessons = activeModule.lessons.filter(lesson => !current.lessons.includes(lesson.id))
          const lessonXp = newLessons.reduce((sum, lesson) => sum + lesson.xp, 0)
          const earnedNewBadge = !current.badges.includes(activeModule.badge.id)
          if (newLessons.length === 0 && !earnedNewBadge) return current
          return {
            ...current,
            xp: current.xp + lessonXp + (earnedNewBadge ? 100 : 0),
            lessons: [...current.lessons, ...newLessons.map(lesson => lesson.id)],
            badges: earnedNewBadge ? [...current.badges, activeModule.badge.id] : current.badges,
          }
        })
      }
    }
  }

  const badgeCount = buildBadgeCatalog(progress).filter(b => b.unlocked).length
  const pageClass = isCoursesPage
    ? 'courses-page'
    : isProgressPage
      ? 'progress-page'
      : isBadgesPage
        ? 'badges-page'
        : 'home-page'

  return (
    <main className={`field-guide ${pageClass}`} id="top">
      <header className="guide-header">
        <Link className="wordmark" to="/">
          <span className="wordmark-icon">f.</span>
          <span>
            FIELDNOTES <em>/ AI</em>
          </span>
        </Link>
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileNav(!mobileNav)}>
          {mobileNav ? <X /> : <Menu />}
        </button>
        <nav className={mobileNav ? 'guide-nav nav-open' : 'guide-nav'} aria-label="Main navigation">
          <Link to="/courses" onClick={() => setMobileNav(false)}>
            Courses
          </Link>
          <Link to="/progress" onClick={() => setMobileNav(false)}>
            My progress
          </Link>
          <Link to="/badges" onClick={() => setMobileNav(false)}>
            Badges
          </Link>
          {user ? (
            <button
              type="button"
              className="nav-account"
              onClick={() => {
                setMobileNav(false)
                logout()
              }}
            >
              Sign out <span>({user.username})</span>
            </button>
          ) : (
            <Link className="nav-account" to="/login" onClick={() => setMobileNav(false)}>
              Sign in
            </Link>
          )}
        </nav>
        <div className="issue-mark">
          STUDENT EDITION <span>·</span> VOL. 01
        </div>
      </header>
      {syncError && (
        <p className="sync-notice" role="status">
          {syncError}
        </p>
      )}

      {isProgressPage ? (
        <ProgressPage
          xp={progress.xp}
          completedLessons={progress.lessons}
          badges={progress.badges}
          videoProgress={progress.videoProgress}
          onOpenLessonVideo={(module, lesson) => startModule(module, lesson, 'both')}
          onUpdateVideoProgress={updateVideoProgress}
        />
      ) : isBadgesPage ? (
        <BadgesPage
          xp={progress.xp}
          lessons={progress.lessons}
          badges={progress.badges}
          videoProgress={progress.videoProgress}
        />
      ) : (
        <>
          {!isCoursesPage && (
            <section className="field-hero">
              <div className="hero-copy">
                <div className="issue-line">
                  <span>FIELD GUIDE Nº 01</span>
                  <span>ARTIFICIAL INTELLIGENCE</span>
                </div>
                <h1>
                  The machine
                  <br />
                  is learning.
                  <br />
                  <em>So are you.</em>
                </h1>
                <p className="hero-lede">
                  A clear-eyed guide to the technology already in your pocket. Watch or read each lesson, test how AI
                  works as a study partner, and know when to question the answer.
                </p>
                <div className="hero-links">
                  <Link className="quiet-link" to="/progress">
                    {overall}% of the path complete · View lesson video progress <span>↘</span>
                  </Link>
                </div>
                <div className="audience-note">
                  <span className="red-rule" /> MADE FOR GRADES 9–12 · VIDEO + WRITTEN LESSONS · NO EXPERIENCE NEEDED
                </div>
              </div>
              <div className="diagram-page">
                <div className="diagram-title">
                  <span>FIG. 01</span>HOW A MODEL LEARNS
                </div>
                <svg
                  className="learning-diagram"
                  viewBox="0 0 540 380"
                  role="img"
                  aria-label="A simple diagram showing examples going into a model and a prediction coming out"
                >
                  <path
                    d="M112 89 C180 89 178 160 245 160 M112 190 H245 M112 291 C180 291 178 220 245 220 M300 190 H419"
                    fill="none"
                    stroke="#263f72"
                    strokeWidth="2"
                    strokeDasharray="6 5"
                  />
                  <rect
                    x="20"
                    y="52"
                    width="100"
                    height="76"
                    rx="2"
                    fill="#f5e7bc"
                    stroke="#263f72"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="20"
                    y="152"
                    width="100"
                    height="76"
                    rx="2"
                    fill="#f5e7bc"
                    stroke="#263f72"
                    strokeWidth="1.5"
                  />
                  <rect
                    x="20"
                    y="252"
                    width="100"
                    height="76"
                    rx="2"
                    fill="#f5e7bc"
                    stroke="#263f72"
                    strokeWidth="1.5"
                  />
                  <circle cx="70" cy="82" r="17" fill="none" stroke="#d94d38" strokeWidth="3" />
                  <path d="M57 93 Q70 72 84 95 M64 75 q6-11 12 0" fill="none" stroke="#d94d38" strokeWidth="2.5" />
                  <text x="70" y="117" textAnchor="middle" className="svg-small">
                    CAT EXAMPLE
                  </text>
                  <circle cx="70" cy="184" r="17" fill="none" stroke="#d94d38" strokeWidth="3" />
                  <path
                    d="M57 193 L54 173 L64 180 L72 169 L84 180 L87 173 L83 196"
                    fill="none"
                    stroke="#d94d38"
                    strokeWidth="2.5"
                  />
                  <text x="70" y="218" textAnchor="middle" className="svg-small">
                    DOG EXAMPLE
                  </text>
                  <circle cx="70" cy="281" r="14" fill="none" stroke="#d94d38" strokeWidth="3" />
                  <path d="M58 291 Q70 272 83 292 M64 276 q6-10 12 0" fill="none" stroke="#d94d38" strokeWidth="2.5" />
                  <text x="70" y="319" textAnchor="middle" className="svg-small">
                    NEW PHOTO
                  </text>
                  <rect x="241" y="119" width="74" height="118" fill="#263f72" />
                  <circle cx="262" cy="150" r="5" fill="#f4cd69" />
                  <circle cx="292" cy="174" r="5" fill="#f4cd69" />
                  <circle cx="262" cy="204" r="5" fill="#f4cd69" />
                  <circle cx="293" cy="218" r="5" fill="#f4cd69" />
                  <path
                    d="M267 152 L287 172 M266 154 L263 199 M294 180 L294 212 M267 205 L288 217"
                    stroke="#fff6dc"
                    strokeWidth="1.5"
                  />
                  <text x="278" y="257" textAnchor="middle" className="svg-small">
                    PATTERN FINDER
                  </text>
                  <rect x="419" y="146" width="103" height="87" fill="#f1d5c7" stroke="#263f72" strokeWidth="1.5" />
                  <path d="M442 185 Q470 151 497 186 Q472 219 442 185Z" fill="none" stroke="#d94d38" strokeWidth="3" />
                  <circle cx="470" cy="185" r="7" fill="#263f72" />
                  <text x="470" y="222" textAnchor="middle" className="svg-small">
                    “PROBABLY CAT”
                  </text>
                  <text x="20" y="28" className="svg-label">
                    LOTS OF EXAMPLES
                  </text>
                  <text x="419" y="127" className="svg-label">
                    A GUESS
                  </text>
                </svg>
                <div className="diagram-caption">
                  <span>1 / 3</span>
                  <p>A model spots patterns in examples. It doesn’t understand a cat the way you do.</p>
                </div>
                <span className="pencil-note">the important bit →</span>
              </div>
              <div className="hero-footerline">
                <span>LOOK CLOSELY. ASK BETTER QUESTIONS.</span>
                <span>
                  EST. FOR THE CURIOUS <b>✳</b>
                </span>
              </div>
            </section>
          )}

          <section className="progress-ruler" id="progress" aria-label="Learning progress">
            <div className="ruler-intro">
              <span className="section-index">YOUR FIELD LOG</span>
              <strong>
                {progress.xp.toLocaleString()} <small>XP</small>
              </strong>
            </div>
            <div className="ruler-track-wrap">
              <div className="ruler-heading">
                <span>
                  {completedCount} OF {totalLessons} LESSONS IN THE NOTEBOOK
                </span>
                <span>
                  LEVEL {level.level} · {level.intoLevel}/300 XP
                </span>
              </div>
              <div className="ruler-track">
                <i style={{ width: `${overall}%` }} />
                {[0, 25, 50, 75, 100].map(value => (
                  <span key={value} style={{ left: `${value}%` }} />
                ))}
              </div>
              <div className="ruler-labels">
                <span>JUST STARTING</span>
                <Link className="quiet-link" to="/progress">
                  OPEN DETAILED VIDEO PROGRESS PAGE →
                </Link>
              </div>
            </div>
            <Link className="ruler-badges" to="/badges" title="View all possible badges">
              <b>{badgeCount}</b>
              <span>
                BADGES
                <br />
                OWNED →
              </span>
            </Link>
          </section>

          {isCoursesPage && (
            <section className="course-page-heading">
              <div className="section-index">THE FIELD GUIDE / COURSE INDEX</div>
              <h1>
                Choose a place
                <br />
                to <em>begin.</em>
              </h1>
              <p>
                Three in-depth courses, {totalLessons} comprehensive lessons — each with a companion video and written
                guide — plus a knowledge check at the end of every chapter.
              </p>
            </section>
          )}
          {!isCoursesPage && (
            <section className="course-overview" id="course-overview">
              <div className="section-index">AT A GLANCE / THREE EXPANDED COURSES · {totalLessons} LESSONS</div>
              <h2>What each course teaches.</h2>
              <div className="overview-list">
                <article>
                  <span className="overview-number">01</span>
                  <div>
                    <h3>AI Fundamentals</h3>
                    <p>
                      Five lessons (video + text) covering rule-based software vs. learned models, the machine learning
                      training loop, overfitting, deep neural networks, tokenization, Transformers and self-attention,
                      computer vision, diffusion media, and recommendation algorithms.
                    </p>
                  </div>
                  <ul>
                    <li>5 lessons · 60 min reading + companion videos</li>
                    <li>Mental models from basic probabilities to modern LLMs</li>
                  </ul>
                </article>
                <article>
                  <span className="overview-number">02</span>
                  <div>
                    <h3>Tools & Techniques</h3>
                    <p>
                      Five lessons (video + text) covering the CLEAR prompting framework, zero-shot vs. few-shot
                      examples, Socratic tutoring, the explainer ladder, task decomposition, coding and debugging
                      workflows, hallucination forensics, lateral reading, and personal study systems.
                    </p>
                  </div>
                  <ul>
                    <li>5 lessons · 60 min reading + companion videos</li>
                    <li>Repeatable study templates that build active recall</li>
                  </ul>
                </article>
                <article>
                  <span className="overview-number">03</span>
                  <div>
                    <h3>Ethics & Responsibility</h3>
                    <p>
                      Five lessons (video + text) covering academic integrity, the Conversation Test, MLA/APA AI
                      disclosure, algorithmic bias case studies, personal data privacy, copyright, voice clones and
                      video deepfakes, cryptographic provenance, and data center energy footprints.
                    </p>
                  </div>
                  <ul>
                    <li>5 lessons · 61 min reading + companion videos</li>
                    <li>Real-world case studies and civic verification habits</li>
                  </ul>
                </article>
              </div>
              <Link className="ink-button overview-cta" to="/courses">
                Browse course lessons <ArrowRight size={16} />
              </Link>
            </section>
          )}

          <section className="chapter-section" id="chapters">
            <div className="chapter-heading">
              <div>
                <div className="section-index">THE READING & VIDEO LIST</div>
                <h2>
                  Three chapters.
                  <br />
                  <em>One smarter you.</em>
                </h2>
              </div>
              <p>
                Follow the chapters in order or jump directly to any lesson below. Every lesson includes both a
                companion video placeholder and a full written guide, followed by a chapter check.
              </p>
            </div>
            <div className="chapter-list">
              {modules.map((module, index) => {
                const done = module.lessons.filter(lesson => progress.lessons.includes(lesson.id)).length
                const finished = progress.badges.includes(module.badge.id)
                const totalMinutes = module.lessons.reduce((sum, item) => sum + item.minutes, 0)
                return (
                  <article className={`chapter-row chapter-${module.id}`} key={module.id}>
                    <div className="chapter-index">
                      <span>{module.index}</span>
                      <i />
                    </div>
                    <div className="chapter-art" aria-hidden="true">
                      <span className="art-label">{['THE BASICS', 'THE TOOLKIT', 'THE HUMAN PART'][index]}</span>
                      <div className={`chapter-sketch sketch-${index}`}>
                        {index === 0 ? (
                          <>
                            <span className="sketch-circle">?</span>
                            <span className="sketch-dash dash-one" />
                            <span className="sketch-dash dash-two" />
                            <b>DATA → PATTERN → GUESS</b>
                          </>
                        ) : index === 1 ? (
                          <>
                            <span className="sketch-quote">“</span>
                            <span className="sketch-line line-one" />
                            <span className="sketch-line line-two" />
                            <span className="sketch-line line-three" />
                            <b>ASK · CHECK · REVISE</b>
                          </>
                        ) : (
                          <>
                            <span className="sketch-eye">◎</span>
                            <span className="sketch-line line-one" />
                            <span className="sketch-line line-two" />
                            <b>WHO BENEFITS?</b>
                          </>
                        )}
                      </div>
                      <span className="chapter-art-foot">
                        {['FIG. A', 'FIG. B', 'FIG. C'][index]} / {module.lessons.length} LESSONS · {totalMinutes} MIN
                      </span>
                    </div>
                    <div className="chapter-copy">
                      <div className="chapter-overline">
                        <span>CHAPTER {module.index} · VIDEO + TEXT EDITION</span>
                        <span className="chapter-state">
                          {finished ? (
                            <>
                              <Check size={12} /> BADGE EARNED
                            </>
                          ) : (
                            `${done}/${module.lessons.length} LESSONS`
                          )}
                        </span>
                      </div>
                      <h3>{module.title}</h3>
                      <p className="chapter-tagline">{module.tagline}</p>
                      <p className="chapter-description">{module.description}</p>
                      <div className="lesson-index">
                        <span className="section-index">
                          INSIDE THIS CHAPTER ({module.lessons.length} LESSONS · CLICK ANY LESSON TO OPEN)
                        </span>
                        {module.lessons.map((lesson, lessonIndex) => {
                          const videoPct = Math.max(
                            0,
                            Math.min(100, Math.round(progress.videoProgress[lesson.id] ?? 0))
                          )
                          return (
                            <button
                              type="button"
                              className="lesson-index-row lesson-index-button"
                              key={lesson.id}
                              onClick={() => startModule(module, lesson)}
                            >
                              <span className="lesson-check">
                                {progress.lessons.includes(lesson.id) ? <Check size={12} /> : `0${lessonIndex + 1}`}
                              </span>
                              <span className="lesson-row-main">
                                <strong>{lesson.title}</strong>
                                <span className="lesson-row-summary">{lesson.summary}</span>
                              </span>
                              <small className="lesson-row-meta">
                                <span className="lesson-video-pill">
                                  <Film size={10} /> {lesson.video.duration} · {videoPct}%
                                </span>
                                <span>{lesson.minutes} MIN READ</span>
                              </small>
                            </button>
                          )
                        })}
                      </div>
                      <button className="chapter-open" onClick={() => startModule(module)}>
                        {finished ? 'Revisit this chapter' : done ? 'Continue this chapter' : 'Start this chapter'}{' '}
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          <section className="margin-note">
            <div className="margin-note-title">
              <span>IN THE MARGIN</span>
              <b>!</b>
            </div>
            <div className="margin-note-body">
              <span className="note-number">01</span>
              <p>
                Quick reminder: a confident answer isn’t always a correct one. Every lesson now includes a companion
                video placeholder and a written guide so you can learn the material whichever way clicks best.
              </p>
              <a href="#chapters">
                Find out why in chapter 02 <ArrowRight size={14} />
              </a>
            </div>
            <div className="margin-note-scribble">
              TRUST YOUR
              <br />
              CURIOSITY
            </div>
          </section>

          <section className="stamp-section" id="stamps">
            <div className="stamp-heading">
              <div>
                <div className="section-index">PROOF OF LEARNING</div>
                <h2>
                  Earn your <em>field stamps.</em>
                </h2>
              </div>
              <p>
                Pass a chapter check with 3 out of 4 answers to stamp your notebook, or{' '}
                <Link className="quiet-link" to="/badges">
                  view all 12 possible badges →
                </Link>
              </p>
            </div>
            <div className="stamp-row">
              {modules.map((module, index) => {
                const unlocked = progress.badges.includes(module.badge.id)
                return (
                  <article className={`stamp-item stamp-${index} ${unlocked ? 'is-stamped' : ''}`} key={module.badge.id}>
                    <div className="stamp-mark">{unlocked ? `0${index + 1}` : <LockKeyhole size={20} />}</div>
                    <div className="stamp-copy">
                      <span>{unlocked ? 'STAMPED' : `CHAPTER ${module.index} · IN PROGRESS`}</span>
                      <h3>{module.badge.name}</h3>
                      <p>{unlocked ? module.badge.description : `Complete the ${module.title} knowledge check.`}</p>
                    </div>
                    {unlocked && <CheckCircle2 className="stamp-check" size={18} />}
                  </article>
                )
              })}
            </div>
          </section>
        </>
      )}

      <footer className="guide-footer">
        <a className="wordmark" href="#top">
          <span className="wordmark-icon">f.</span>
          <span>
            FIELDNOTES <em>/ AI</em>
          </span>
        </a>
        <span>Made for students who ask why.</span>
        <span>THINK FOR YOURSELF. USE TOOLS WELL.</span>
      </footer>

      {activeModule && (
        <LessonModal
          activeModule={activeModule}
          activeLesson={activeLesson}
          completedLessons={progress.lessons}
          videoProgress={progress.videoProgress}
          lessonViewMode={lessonViewMode}
          videoPlaying={videoPlaying}
          activeSegmentIndex={activeSegmentIndex}
          quizMode={quizMode}
          questionIndex={questionIndex}
          selectedAnswer={selectedAnswer}
          quizScore={quizScore}
          quizFinished={quizFinished}
          onClose={closeLearning}
          onSelectLesson={selectLesson}
          onChangeViewMode={setLessonViewMode}
          onToggleVideo={() => setVideoPlaying(!videoPlaying)}
          onSelectSegment={index => {
            setActiveSegmentIndex(index)
            setVideoPlaying(true)
          }}
          onUpdateVideoProgress={updateVideoProgress}
          onPreviousLesson={previousLesson}
          onCompleteLesson={completeLesson}
          onSelectAnswer={setSelectedAnswer}
          onSubmitAnswer={answerQuestion}
          onRetryQuiz={() => {
            setQuestionIndex(0)
            setSelectedAnswer(null)
            setQuizScore(0)
            setQuizFinished(false)
            setQuizAnswers([])
          }}
          onStartQuiz={() => setQuizMode(true)}
        />
      )}
    </main>
  )
}
