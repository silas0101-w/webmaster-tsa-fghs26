import { useEffect } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  CircleHelp,
  Film,
  Pause,
  Play,
  RotateCcw,
  X,
  Zap,
} from 'lucide-react'
import { type Lesson, type Module } from '../data/content'
import { formatSeconds, parseDurationSeconds } from './ProgressPage'

export type LessonViewMode = 'both' | 'video' | 'text'

export interface LessonModalProps {
  activeModule: Module
  activeLesson: Lesson | null
  completedLessons: string[]
  videoProgress: Record<string, number>
  lessonViewMode: LessonViewMode
  videoPlaying: boolean
  activeSegmentIndex: number
  quizMode: boolean
  questionIndex: number
  selectedAnswer: number | null
  quizScore: number
  quizFinished: boolean
  onClose: () => void
  onSelectLesson: (lesson: Lesson) => void
  onChangeViewMode: (mode: LessonViewMode) => void
  onToggleVideo: () => void
  onSelectSegment: (index: number) => void
  onUpdateVideoProgress: (lessonId: string, percent: number) => void
  onPreviousLesson: () => void
  onCompleteLesson: () => void
  onSelectAnswer: (index: number) => void
  onSubmitAnswer: () => void
  onRetryQuiz: () => void
  onStartQuiz: () => void
}

export default function LessonModal({
  activeModule,
  activeLesson,
  completedLessons,
  videoProgress,
  lessonViewMode,
  videoPlaying,
  activeSegmentIndex,
  quizMode,
  questionIndex,
  selectedAnswer,
  quizScore,
  quizFinished,
  onClose,
  onSelectLesson,
  onChangeViewMode,
  onToggleVideo,
  onSelectSegment,
  onUpdateVideoProgress,
  onPreviousLesson,
  onCompleteLesson,
  onSelectAnswer,
  onSubmitAnswer,
  onRetryQuiz,
  onStartQuiz,
}: LessonModalProps) {
  const activeLessonIndex = activeLesson
    ? activeModule.lessons.findIndex(item => item.id === activeLesson.id)
    : -1
  const passingScore = Math.ceil(activeModule.quiz.length * 0.75)
  const passedQuiz = quizScore >= passingScore
  const dialogLabelId = quizMode ? 'quiz-heading' : activeLesson ? 'lesson-title' : 'complete-heading'

  const currentVideoPct = activeLesson
    ? Math.max(0, Math.min(100, Math.round(videoProgress[activeLesson.id] ?? 0)))
    : 0
  const durationSecs = activeLesson ? parseDurationSeconds(activeLesson.video.duration) : 600
  const watchedSecs = (durationSecs * currentVideoPct) / 100

  // While video placeholder is playing, advance watch progress smoothly and step through segments.
  useEffect(() => {
    if (!videoPlaying || !activeLesson || quizMode) return
    const timer = window.setInterval(() => {
      const current = Math.max(0, Math.min(100, Math.round(videoProgress[activeLesson.id] ?? 0)))
      if (current >= 100) {
        onToggleVideo()
        return
      }
      const nextPct = Math.min(100, current + 5)
      onUpdateVideoProgress(activeLesson.id, nextPct)
      const nextSegment = Math.min(
        activeLesson.video.segments.length - 1,
        Math.floor((nextPct - 1) / 20)
      )
      if (nextSegment >= 0 && nextSegment !== activeSegmentIndex) {
        onSelectSegment(nextSegment)
      }
    }, 900)
    return () => window.clearInterval(timer)
  }, [
    videoPlaying,
    activeLesson,
    quizMode,
    videoProgress,
    activeSegmentIndex,
    onUpdateVideoProgress,
    onSelectSegment,
    onToggleVideo,
  ])

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className="learning-modal" role="dialog" aria-modal="true" aria-labelledby={dialogLabelId}>
        <header className="modal-header">
          <button className="modal-back" onClick={onClose}>
            <ArrowLeft size={16} /> <span>Notebook</span>
          </button>
          <div className="modal-progress-wrap">
            <span>
              {quizMode
                ? 'KNOWLEDGE CHECK'
                : activeLesson
                  ? `LESSON ${activeLessonIndex + 1} OF ${activeModule.lessons.length}`
                  : 'CHAPTER COMPLETE'}
            </span>
            <div className="modal-progress">
              <i
                style={{
                  width: `${
                    quizMode
                      ? quizFinished
                        ? 100
                        : ((questionIndex + 1) / activeModule.quiz.length) * 100
                      : activeLesson
                        ? ((activeLessonIndex + 1) / (activeModule.lessons.length + 1)) * 100
                        : 100
                  }%`,
                }}
              />
            </div>
          </div>
          <button className="modal-close" aria-label="Close" onClick={onClose}>
            <X size={19} />
          </button>
        </header>

        {!quizMode && activeLesson && (
          <nav className="modal-lesson-strip" aria-label="Chapter lessons">
            {activeModule.lessons.map((item, idx) => {
              const isCurrent = item.id === activeLesson.id
              const isDone = completedLessons.includes(item.id)
              const itemVideoPct = Math.max(0, Math.min(100, Math.round(videoProgress[item.id] ?? 0)))
              return (
                <button
                  type="button"
                  key={item.id}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`modal-lesson-tab ${isCurrent ? 'is-active' : ''} ${isDone ? 'is-done' : ''}`}
                  onClick={() => onSelectLesson(item)}
                >
                  <span>
                    0{idx + 1} · {itemVideoPct}% VID
                  </span>
                  <span className="modal-lesson-tab-title">{item.title}</span>
                </button>
              )
            })}
          </nav>
        )}

        <div className="modal-body">
          {quizMode ? (
            <div className="quiz-content">
              {quizFinished ? (
                <div className="quiz-result">
                  <div className="result-icon">{passedQuiz ? <Check size={30} /> : <RotateCcw size={30} />}</div>
                  <div className="section-index">
                    {passedQuiz ? 'CHAPTER STAMP EARNED · PROGRESS UPDATED' : 'KEEP PRACTICING · PROGRESS UNCHANGED'}
                  </div>
                  <h2 id="quiz-heading">{passedQuiz ? 'Well observed.' : 'Back to the notes.'}</h2>
                  <p>
                    You got <b>{quizScore} out of {activeModule.quiz.length}</b> correct.{' '}
                    {passedQuiz
                      ? `You got at least 3 out of the 4 questions right, so your progress meter went up and you earned the ${activeModule.badge.name} stamp and 100 bonus XP.`
                      : 'You must get at least 3 out of the 4 questions right for your progress meter to go up. Review the lessons and give the knowledge check another try.'}
                  </p>
                  {passedQuiz ? (
                    <button className="ink-button" onClick={onClose}>
                      Back to my notebook <ArrowRight size={16} />
                    </button>
                  ) : (
                    <button className="ink-button" onClick={onRetryQuiz}>
                      Try again <RotateCcw size={15} />
                    </button>
                  )}
                </div>
              ) : (
                <>
                  <div className="section-index">{activeModule.title.toUpperCase()} · QUICK CHECK</div>
                  <div className="question-count">
                    QUESTION {questionIndex + 1} <span>/ {activeModule.quiz.length}</span>
                  </div>
                  <h2 id="quiz-heading" className="quiz-question">
                    {activeModule.quiz[questionIndex].question}
                  </h2>
                  <div className="answer-options">
                    {activeModule.quiz[questionIndex].options.map((option, index) => (
                      <button
                        key={option}
                        className={`answer-option ${selectedAnswer === index ? 'answer-selected' : ''}`}
                        onClick={() => onSelectAnswer(index)}
                      >
                        <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                        {option}
                        <span className="answer-radio" />
                      </button>
                    ))}
                  </div>
                  <button className="ink-button quiz-submit" disabled={selectedAnswer === null} onClick={onSubmitAnswer}>
                    Check answer <ArrowRight size={16} />
                  </button>
                </>
              )}
            </div>
          ) : activeLesson ? (
            <article className="lesson-content">
              <div className="section-index">
                {activeModule.title.toUpperCase()} · {activeLesson.minutes} MIN READ · {activeLesson.video.duration}{' '}
                VIDEO ({currentVideoPct}% WATCHED)
              </div>
              <h1 id="lesson-title">{activeLesson.title}</h1>
              <p className="lesson-summary-lede">{activeLesson.summary}</p>
              <div className="lesson-toolbar">
                <div className="lesson-xp">
                  <Zap size={13} /> +{activeLesson.xp} XP · PASS CHAPTER CHECK (3/4) TO RECORD PROGRESS
                </div>
                <div className="lesson-format-switch" role="group" aria-label="Lesson format view">
                  <button
                    type="button"
                    aria-pressed={lessonViewMode === 'both'}
                    className={`format-tab ${lessonViewMode === 'both' ? 'is-active' : ''}`}
                    onClick={() => onChangeViewMode('both')}
                  >
                    Video + Text
                  </button>
                  <button
                    type="button"
                    aria-pressed={lessonViewMode === 'video'}
                    className={`format-tab ${lessonViewMode === 'video' ? 'is-active' : ''}`}
                    onClick={() => onChangeViewMode('video')}
                  >
                    <Film size={12} /> Video Only
                  </button>
                  <button
                    type="button"
                    aria-pressed={lessonViewMode === 'text'}
                    className={`format-tab ${lessonViewMode === 'text' ? 'is-active' : ''}`}
                    onClick={() => onChangeViewMode('text')}
                  >
                    <BookOpen size={12} /> Text Only
                  </button>
                </div>
              </div>

              {(lessonViewMode === 'both' || lessonViewMode === 'video') && (
                <section className="lesson-video-card" aria-label="Companion video lesson placeholder">
                  <div className="video-card-header">
                    <span className="video-badge">
                      <Film size={12} /> VIDEO LESSON PLACEHOLDER
                    </span>
                    <span className="video-duration-tag">
                      WATCHED {currentVideoPct}% · {formatSeconds(watchedSecs)} / {activeLesson.video.duration}
                    </span>
                  </div>

                  <div className={`video-stage ${videoPlaying ? 'is-playing' : ''}`}>
                    <div className="video-stage-corner">FIG. V0{activeLessonIndex + 1}</div>
                    <button
                      type="button"
                      className="video-play-trigger"
                      aria-label={videoPlaying ? 'Pause video placeholder' : 'Play video placeholder'}
                      onClick={() => {
                        if (!videoPlaying && currentVideoPct === 0) {
                          onUpdateVideoProgress(activeLesson.id, 10)
                        }
                        onToggleVideo()
                      }}
                    >
                      {videoPlaying ? <Pause size={24} /> : <Play size={24} />}
                    </button>
                    <div className="video-stage-copy">
                      <span className="video-stage-kicker">
                        {videoPlaying
                          ? `PLAYING PLACEHOLDER · SEGMENT ${activeSegmentIndex + 1} OF ${activeLesson.video.segments.length} (${activeLesson.video.segments[activeSegmentIndex]?.timestamp})`
                          : `COMPANION VIDEO PLACEHOLDER · ${currentVideoPct}% WATCHED`}
                      </span>
                      <h2>{activeLesson.video.title}</h2>
                      <p>
                        {videoPlaying
                          ? activeLesson.body[activeSegmentIndex]?.text ?? activeLesson.video.summary
                          : activeLesson.video.summary}
                      </p>
                      <span className="video-placeholder-note">{activeLesson.video.instructorNote}</span>
                    </div>
                  </div>

                  <div className="modal-video-progress-strip">
                    <div className="modal-video-bar-header">
                      <span>LESSON VIDEO PROGRESS ({currentVideoPct}% WATCHED)</span>
                      <div className="modal-video-quick-btns">
                        <button
                          type="button"
                          className="video-quick-btn"
                          onClick={() =>
                            onUpdateVideoProgress(activeLesson.id, Math.min(100, currentVideoPct + 20))
                          }
                        >
                          +20% Segment
                        </button>
                        <button
                          type="button"
                          className="video-quick-btn"
                          onClick={() => onUpdateVideoProgress(activeLesson.id, 100)}
                        >
                          Mark 100% Watched
                        </button>
                      </div>
                    </div>
                    <div
                      className="lesson-video-bar"
                      role="progressbar"
                      aria-label="Current lesson video watch progress"
                      aria-valuenow={currentVideoPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    >
                      <i style={{ width: `${currentVideoPct}%` }} />
                      {[0, 20, 40, 60, 80, 100].map(tick => (
                        <span key={tick} className="bar-tick" style={{ left: `${tick}%` }} />
                      ))}
                    </div>
                  </div>

                  <div className="video-segments">
                    <div className="video-segments-label">
                      <span>VIDEO CHAPTER TIMESTAMPS (MATCHES WRITTEN SECTIONS BELOW)</span>
                      <span>CLICK A SEGMENT TO WATCH & ADVANCE PROGRESS</span>
                    </div>
                    <div className="video-segment-grid">
                      {activeLesson.video.segments.map((segment, segIdx) => {
                        const segPct = (segIdx + 1) * 20
                        return (
                          <button
                            type="button"
                            key={segment.timestamp}
                            aria-pressed={activeSegmentIndex === segIdx}
                            className={`video-segment-btn ${activeSegmentIndex === segIdx ? 'is-selected' : ''}`}
                            onClick={() => {
                              onSelectSegment(segIdx)
                              onUpdateVideoProgress(activeLesson.id, Math.max(currentVideoPct, segPct))
                            }}
                          >
                            <span className="segment-time">{segment.timestamp}</span>
                            <span className="segment-title">{segment.label}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </section>
              )}

              {(lessonViewMode === 'both' || lessonViewMode === 'text') && (
                <>
                  <div className="lesson-body">
                    <div className="written-guide-divider">
                      <span>WRITTEN FIELD GUIDE</span>
                      <span>{activeLesson.body.length} DETAILED SECTIONS</span>
                    </div>
                    {activeLesson.body.map((section, index) => (
                      <div className="lesson-paragraph" key={`${activeLesson.id}-${index}`}>
                        {section.heading && (
                          <h3>
                            <span className="paragraph-num">0{index + 1}</span>
                            {section.heading}
                          </h3>
                        )}
                        <p>{section.text}</p>
                      </div>
                    ))}
                  </div>

                  {activeLesson.keyTakeaways.length > 0 && (
                    <aside className="lesson-takeaways" aria-label="Key takeaways">
                      <div className="section-index">NOTEBOOK SUMMARY · KEY TAKEAWAYS</div>
                      <ul>
                        {activeLesson.keyTakeaways.map(point => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </aside>
                  )}
                </>
              )}

              <div className="lesson-footer-nav">
                {activeLessonIndex > 0 && (
                  <button type="button" className="lesson-prev" onClick={onPreviousLesson}>
                    <ArrowLeft size={15} /> Previous lesson
                  </button>
                )}
                <button className="ink-button lesson-next" onClick={onCompleteLesson}>
                  {activeLessonIndex === activeModule.lessons.length - 1
                    ? 'Finish chapter & take the check'
                    : 'Mark read & turn the page'}{' '}
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          ) : (
            <div className="quiz-result">
              <div className="result-icon">✓</div>
              <div className="section-index">CHAPTER COMPLETE</div>
              <h2 id="complete-heading">Good work.</h2>
              <p>
                You finished every lesson. Get at least 3 out of 4 questions right on the chapter check for your
                progress meter to go up and to earn your field stamp.
              </p>
              <button className="ink-button" onClick={onStartQuiz}>
                Start knowledge check <CircleHelp size={16} />
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
