import { useEffect, useState } from 'react'
import { useLocation } from 'react-router'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, CircleHelp, LockKeyhole, Menu, RotateCcw, X, Zap } from 'lucide-react'
import { modules, levelForXp, type Lesson, type Module } from '../data/content'
import '../App.css'

type Progress = { xp: number; lessons: string[]; badges: string[] }
const STORAGE_KEY = 'spark-ai-learning-progress'
const emptyProgress: Progress = { xp: 0, lessons: [], badges: [] }

function readProgress(): Progress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return emptyProgress
    const parsed = JSON.parse(saved) as Partial<Progress>
    return { xp: Number(parsed.xp) || 0, lessons: Array.isArray(parsed.lessons) ? parsed.lessons : [], badges: Array.isArray(parsed.badges) ? parsed.badges : [] }
  } catch { return emptyProgress }
}

export default function Home() {
  const isCoursesPage = useLocation().pathname === '/courses'
  const [progress, setProgress] = useState<Progress>(readProgress)
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [quizMode, setQuizMode] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizScore, setQuizScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const level = levelForXp(progress.xp)
  const totalLessons = modules.reduce((sum, module) => sum + module.lessons.length, 0)
  const completedCount = progress.lessons.length
  const overall = Math.round((completedCount / totalLessons) * 100)
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)) }, [progress])
  useEffect(() => {
    if (!activeModule) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setActiveModule(null); setActiveLesson(null); setQuizMode(false) }
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [activeModule])

  function startModule(module: Module, lesson?: Lesson) {
    setActiveModule(module)
    setActiveLesson(lesson ?? module.lessons.find(item => !progress.lessons.includes(item.id)) ?? module.lessons[0])
    setQuizMode(false); setQuestionIndex(0); setSelectedAnswer(null); setQuizScore(0); setQuizFinished(false)
  }
  function closeLearning() { setActiveModule(null); setActiveLesson(null); setQuizMode(false) }
  function completeLesson() {
    if (!activeLesson || !activeModule) return
    if (!progress.lessons.includes(activeLesson.id)) setProgress(current => ({ ...current, xp: current.xp + activeLesson.xp, lessons: [...current.lessons, activeLesson.id] }))
    const next = activeModule.lessons[activeModule.lessons.findIndex(item => item.id === activeLesson.id) + 1]
    if (next) setActiveLesson(next)
    else { setActiveLesson(null); setQuizMode(true) }
  }
  function answerQuestion() {
    if (!activeModule || selectedAnswer === null) return
    const correct = selectedAnswer === activeModule.quiz[questionIndex].answer
    const score = quizScore + (correct ? 1 : 0)
    setQuizScore(score)
    if (questionIndex + 1 < activeModule.quiz.length) { setQuestionIndex(questionIndex + 1); setSelectedAnswer(null) }
    else {
      setQuizFinished(true)
      if (score >= Math.ceil(activeModule.quiz.length * 0.75) && !progress.badges.includes(activeModule.badge.id)) {
        setProgress(current => ({ ...current, xp: current.xp + 100, badges: [...current.badges, activeModule.badge.id] }))
      }
    }
  }
  const badgeCount = progress.badges.length

  return <main className={`field-guide ${isCoursesPage ? 'courses-page' : 'home-page'}`} id="top">
    <header className="guide-header">
      <a className="wordmark" href="/"><span className="wordmark-icon">f.</span><span>FIELDNOTES <em>/ AI</em></span></a>
      <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMobileNav(!mobileNav)}>{mobileNav ? <X /> : <Menu />}</button>
      <nav className={mobileNav ? 'guide-nav nav-open' : 'guide-nav'} aria-label="Main navigation"><a href={isCoursesPage ? '#chapters' : '/courses#chapters'} onClick={() => setMobileNav(false)}>Courses</a><a href={isCoursesPage ? '/#progress' : '#progress'} onClick={() => setMobileNav(false)}>My progress</a><a href={isCoursesPage ? '#stamps' : '/courses#stamps'} onClick={() => setMobileNav(false)}>Badges</a></nav>
      <div className="issue-mark">STUDENT EDITION <span>·</span> VOL. 01</div>
    </header>

    {!isCoursesPage && <section className="field-hero">
      <div className="hero-copy"><div className="issue-line"><span>FIELD GUIDE Nº 01</span><span>ARTIFICIAL INTELLIGENCE</span></div>
        <h1>The machine<br />is learning.<br /><em>So are you.</em></h1>
        <p className="hero-lede">A clear-eyed guide to the technology already in your pocket. Learn how AI works, try it as a study tool, and know when to question the answer.</p>
        <div className="hero-links"><a className="quiet-link" href="#progress">{overall}% of the path complete <span>↘</span></a></div>
        <div className="audience-note"><span className="red-rule" /> MADE FOR GRADES 9–12 · NO EXPERIENCE NEEDED</div>
      </div>
      <div className="diagram-page"><div className="diagram-title"><span>FIG. 01</span>HOW A MODEL LEARNS</div>
        <svg className="learning-diagram" viewBox="0 0 540 380" role="img" aria-label="A simple diagram showing examples going into a model and a prediction coming out">
          <path d="M112 89 C180 89 178 160 245 160 M112 190 H245 M112 291 C180 291 178 220 245 220 M300 190 H419" fill="none" stroke="#263f72" strokeWidth="2" strokeDasharray="6 5" />
          <rect x="20" y="52" width="100" height="76" rx="2" fill="#f5e7bc" stroke="#263f72" strokeWidth="1.5"/><rect x="20" y="152" width="100" height="76" rx="2" fill="#f5e7bc" stroke="#263f72" strokeWidth="1.5"/><rect x="20" y="252" width="100" height="76" rx="2" fill="#f5e7bc" stroke="#263f72" strokeWidth="1.5"/>
          <circle cx="70" cy="82" r="17" fill="none" stroke="#d94d38" strokeWidth="3"/><path d="M57 93 Q70 72 84 95 M64 75 q6-11 12 0" fill="none" stroke="#d94d38" strokeWidth="2.5"/><text x="70" y="117" textAnchor="middle" className="svg-small">CAT EXAMPLE</text>
          <circle cx="70" cy="184" r="17" fill="none" stroke="#d94d38" strokeWidth="3"/><path d="M57 193 L54 173 L64 180 L72 169 L84 180 L87 173 L83 196" fill="none" stroke="#d94d38" strokeWidth="2.5"/><text x="70" y="218" textAnchor="middle" className="svg-small">DOG EXAMPLE</text>
          <circle cx="70" cy="281" r="14" fill="none" stroke="#d94d38" strokeWidth="3"/><path d="M58 291 Q70 272 83 292 M64 276 q6-10 12 0" fill="none" stroke="#d94d38" strokeWidth="2.5"/><text x="70" y="319" textAnchor="middle" className="svg-small">NEW PHOTO</text>
          <rect x="241" y="119" width="74" height="118" fill="#263f72"/><circle cx="262" cy="150" r="5" fill="#f4cd69"/><circle cx="292" cy="174" r="5" fill="#f4cd69"/><circle cx="262" cy="204" r="5" fill="#f4cd69"/><circle cx="293" cy="218" r="5" fill="#f4cd69"/><path d="M267 152 L287 172 M266 154 L263 199 M294 180 L294 212 M267 205 L288 217" stroke="#fff6dc" strokeWidth="1.5"/><text x="278" y="257" textAnchor="middle" className="svg-small">PATTERN FINDER</text>
          <rect x="419" y="146" width="103" height="87" fill="#f1d5c7" stroke="#263f72" strokeWidth="1.5"/><path d="M442 185 Q470 151 497 186 Q472 219 442 185Z" fill="none" stroke="#d94d38" strokeWidth="3"/><circle cx="470" cy="185" r="7" fill="#263f72"/><text x="470" y="222" textAnchor="middle" className="svg-small">“PROBABLY CAT”</text>
          <text x="20" y="28" className="svg-label">LOTS OF EXAMPLES</text><text x="419" y="127" className="svg-label">A GUESS</text>
        </svg>
        <div className="diagram-caption"><span>1 / 3</span><p>A model spots patterns in examples. It doesn’t understand a cat the way you do.</p></div><span className="pencil-note">the important bit →</span>
      </div>
      <div className="hero-footerline"><span>LOOK CLOSELY. ASK BETTER QUESTIONS.</span><span>EST. FOR THE CURIOUS <b>✳</b></span></div>
    </section>

    



    }

    <section className="progress-ruler" id="progress" aria-label="Learning progress"><div className="ruler-intro"><span className="section-index">YOUR FIELD LOG</span><strong>{progress.xp.toLocaleString()} <small>XP</small></strong></div><div className="ruler-track-wrap"><div className="ruler-heading"><span>{completedCount} OF {totalLessons} LESSONS IN THE NOTEBOOK</span><span>LEVEL {level.level} · {level.intoLevel}/300 XP</span></div><div className="ruler-track"><i style={{ width: `${overall}%` }} />{[0, 25, 50, 75, 100].map(value => <span key={value} style={{ left: `${value}%` }} />)}</div><div className="ruler-labels"><span>JUST STARTING</span><span>AI LITERATE</span></div></div><div className="ruler-badges"><b>{badgeCount}</b><span>BADGES<br />STAMPED</span></div></section>

    {isCoursesPage && <section className="course-page-heading"><div className="section-index">THE FIELD GUIDE / COURSE INDEX</div><h1>Choose a place<br/>to <em>begin.</em></h1><p>Three short courses, nine lessons, and a knowledge check at the end of each.</p></section>}
    {!isCoursesPage && <section className="course-overview" id="course-overview"><div className="section-index">AT A GLANCE / THREE COURSES</div><h2>What each course teaches.</h2><div className="overview-list"><article><h3>01 / AI Fundamentals</h3><p>AI vs. rule-based software; training data and machine learning; neural networks and language models; overfitting, generalization, and AI in daily life.</p></article><article><h3>02 / Tools & Techniques</h3><p>The CLEAR prompting framework; Socratic tutoring and practice tests; useful feedback; hallucinations and source verification.</p></article><article><h3>03 / Ethics & Responsibility</h3><p>Academic integrity and disclosure; bias and fairness; privacy; deepfakes and misinformation; environmental impact and human accountability.</p></article></div><a className="ink-button" href="/courses#chapters">Browse course lessons <ArrowRight size={16}/></a></section>}
    <section className="chapter-section" id="chapters"><div className="chapter-heading"><div><div className="section-index">THE READING LIST</div><h2>Three chapters.<br /><em>One smarter you.</em></h2></div><p>Follow the chapters in order or jump to the question you have right now. Each one has short lessons and a knowledge check.</p></div>
      <div className="chapter-list">{modules.map((module, index) => {
        const done = module.lessons.filter(lesson => progress.lessons.includes(lesson.id)).length
        const finished = progress.badges.includes(module.badge.id)
        return <article className={`chapter-row chapter-${module.id}`} key={module.id}>
          <div className="chapter-index"><span>{module.index}</span><i /></div>
          <div className="chapter-art" aria-hidden="true"><span className="art-label">{['THE BASICS','THE TOOLKIT','THE HUMAN PART'][index]}</span><div className={`chapter-sketch sketch-${index}`}>
            {index === 0 ? <><span className="sketch-circle">?</span><span className="sketch-dash dash-one"/><span className="sketch-dash dash-two"/><b>DATA → PATTERN → GUESS</b></> : index === 1 ? <><span className="sketch-quote">“</span><span className="sketch-line line-one"/><span className="sketch-line line-two"/><span className="sketch-line line-three"/><b>ASK · CHECK · REVISE</b></> : <><span className="sketch-eye">◎</span><span className="sketch-line line-one"/><span className="sketch-line line-two"/><b>WHO BENEFITS?</b></>}
          </div><span className="chapter-art-foot">{['FIG. A','FIG. B','FIG. C'][index]} / FIELD SKETCH</span></div>
          <div className="chapter-copy"><div className="chapter-overline"><span>CHAPTER {module.index}</span><span className="chapter-state">{finished ? <><Check size={12}/> BADGE EARNED</> : `${done}/${module.lessons.length} LESSONS`}</span></div><h3>{module.title}</h3><p className="chapter-tagline">{module.tagline}</p><p className="chapter-description">{module.description}</p>
            <div className="lesson-index"><span className="section-index">INSIDE THIS CHAPTER</span>{module.lessons.map((lesson, lessonIndex) => <div className="lesson-index-row" key={lesson.id}><span className="lesson-check">{progress.lessons.includes(lesson.id) ? <Check size={12}/> : `0${lessonIndex + 1}`}</span><span>{lesson.title}</span><small>{lesson.minutes} MIN</small></div>)}</div>
            <button className="chapter-open" onClick={() => startModule(module)}>{finished ? 'Revisit this chapter' : done ? 'Continue this chapter' : 'Read this chapter'} <ArrowRight size={15}/></button>
          </div>
        </article>
      })}</div>
    </section>

    <section className="margin-note"><div className="margin-note-title"><span>IN THE MARGIN</span><b>!</b></div><div className="margin-note-body"><span className="note-number">01</span><p>Quick reminder: a confident answer isn’t always a correct one. Check the sources, especially when it matters.</p><a href="#chapters">Find out why in chapter 02 <ArrowRight size={14}/></a></div><div className="margin-note-scribble">TRUST YOUR<br/>CURIOSITY</div></section>

    <section className="stamp-section" id="stamps"><div className="stamp-heading"><div><div className="section-index">PROOF OF LEARNING</div><h2>Earn your <em>field stamps.</em></h2></div><p>Pass a chapter check with 3 out of 4 answers to stamp your notebook.</p></div><div className="stamp-row">{modules.map((module, index) => { const unlocked = progress.badges.includes(module.badge.id); return <article className={`stamp-item stamp-${index} ${unlocked ? 'is-stamped' : ''}`} key={module.badge.id}><div className="stamp-mark">{unlocked ? `0${index + 1}` : <LockKeyhole size={20}/>}</div><div className="stamp-copy"><span>{unlocked ? 'STAMPED' : `CHAPTER ${module.index} · IN PROGRESS`}</span><h3>{module.badge.name}</h3><p>{unlocked ? module.badge.description : `Complete the ${module.title} knowledge check.`}</p></div>{unlocked && <CheckCircle2 className="stamp-check" size={18}/>}</article> })}</div></section>

    <footer className="guide-footer"><a className="wordmark" href="#top"><span className="wordmark-icon">f.</span><span>FIELDNOTES <em>/ AI</em></span></a><span>Made for students who ask why.</span><span>THINK FOR YOURSELF. USE TOOLS WELL.</span></footer>

    {activeModule && <div className="modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) closeLearning() }}><section className="learning-modal" role="dialog" aria-modal="true" aria-labelledby="lesson-title"><header className="modal-header"><button className="modal-back" onClick={closeLearning}><ArrowLeft size={16}/> <span>Notebook</span></button><div className="modal-progress-wrap"><span>{quizMode ? 'KNOWLEDGE CHECK' : activeLesson ? `LESSON ${activeModule.lessons.findIndex(item => item.id === activeLesson.id) + 1} OF ${activeModule.lessons.length}` : 'CHAPTER COMPLETE'}</span><div className="modal-progress"><i style={{ width: `${quizMode ? (quizFinished ? 100 : ((questionIndex + 1) / activeModule.quiz.length) * 100) : activeLesson ? ((activeModule.lessons.findIndex(item => item.id === activeLesson.id) + 1) / (activeModule.lessons.length + 1)) * 100 : 100}%` }}/></div></div><button className="modal-close" aria-label="Close" onClick={closeLearning}><X size={19}/></button></header>
      <div className="modal-body">{quizMode ? <div className="quiz-content">{quizFinished ? <div className="quiz-result"><div className="result-icon">{quizScore >= Math.ceil(activeModule.quiz.length * .75) ? <Check size={30}/> : <RotateCcw size={30}/>}</div><div className="section-index">{quizScore >= Math.ceil(activeModule.quiz.length * .75) ? 'CHAPTER STAMP EARNED' : 'KEEP PRACTICING'}</div><h2>{quizScore >= Math.ceil(activeModule.quiz.length * .75) ? 'Well observed.' : 'Back to the notes.'}</h2><p>You got <b>{quizScore} out of {activeModule.quiz.length}</b> correct. {quizScore >= Math.ceil(activeModule.quiz.length * .75) ? `You earned the ${activeModule.badge.name} stamp and 100 bonus XP.` : 'Review the lessons and give the knowledge check another try.'}</p>{quizScore >= Math.ceil(activeModule.quiz.length * .75) ? <button className="ink-button" onClick={closeLearning}>Back to my notebook <ArrowRight size={16}/></button> : <button className="ink-button" onClick={() => { setQuestionIndex(0); setSelectedAnswer(null); setQuizScore(0); setQuizFinished(false) }}>Try again <RotateCcw size={15}/></button>}</div> : <><div className="section-index">{activeModule.title.toUpperCase()} · QUICK CHECK</div><div className="question-count">QUESTION {questionIndex + 1} <span>/ {activeModule.quiz.length}</span></div><h2 className="quiz-question">{activeModule.quiz[questionIndex].question}</h2><div className="answer-options">{activeModule.quiz[questionIndex].options.map((option, index) => <button key={option} className={`answer-option ${selectedAnswer === index ? 'answer-selected' : ''}`} onClick={() => setSelectedAnswer(index)}><span className="answer-letter">{String.fromCharCode(65 + index)}</span>{option}<span className="answer-radio"/></button>)}</div><button className="ink-button quiz-submit" disabled={selectedAnswer === null} onClick={answerQuestion}>Check answer <ArrowRight size={16}/></button></>}</div> : activeLesson ? <article className="lesson-content"><div className="section-index">{activeModule.title.toUpperCase()} · {activeLesson.minutes} MIN READ</div><h1 id="lesson-title">{activeLesson.title}</h1><div className="lesson-xp"><Zap size={13}/> +{activeLesson.xp} XP · STAMP THIS PAGE WHEN FINISHED</div><div className="lesson-body">{activeLesson.body.map((section, index) => <div className="lesson-paragraph" key={`${activeLesson.id}-${index}`}>{section.heading && <h3>{section.heading}</h3>}<p>{section.text}</p></div>)}</div><button className="ink-button lesson-next" onClick={completeLesson}>{activeModule.lessons.findIndex(item => item.id === activeLesson.id) === activeModule.lessons.length - 1 ? 'Finish chapter & take the check' : 'Mark read & turn the page'} <ArrowRight size={16}/></button></article> : <div className="quiz-result"><div className="result-icon">✓</div><div className="section-index">CHAPTER COMPLETE</div><h2>Good work.</h2><p>You finished every lesson. Take the chapter check to earn your field stamp.</p><button className="ink-button" onClick={() => setQuizMode(true)}>Start knowledge check <CircleHelp size={16}/></button></div>}</div>
    </section></div>}
  </main>
}
