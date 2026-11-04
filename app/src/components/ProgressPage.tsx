import { ArrowRight, Check, CheckCircle2, Film, LockKeyhole, Play, RotateCcw } from 'lucide-react'
import { modules, type Lesson, type Module } from '../data/content'

export function parseDurationSeconds(duration: string): number {
  const parts = duration.split(':').map(Number)
  if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
    return parts[0] * 60 + parts[1]
  }
  return 600
}

export function formatSeconds(totalSeconds: number): string {
  const clamped = Math.max(0, Math.round(totalSeconds))
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

export interface ProgressPageProps {
  xp: number
  completedLessons: string[]
  badges: string[]
  videoProgress: Record<string, number>
  onOpenLessonVideo: (module: Module, lesson: Lesson) => void
  onUpdateVideoProgress: (lessonId: string, percent: number) => void
}

export default function ProgressPage({
  xp,
  completedLessons,
  badges,
  videoProgress,
  onOpenLessonVideo,
  onUpdateVideoProgress,
}: ProgressPageProps) {
  const allLessons = modules.flatMap(m => m.lessons)
  const totalLessons = allLessons.length

  const totalVideoSeconds = allLessons.reduce(
    (sum, lesson) => sum + parseDurationSeconds(lesson.video.duration),
    0
  )
  const watchedVideoSeconds = allLessons.reduce((sum, lesson) => {
    const pct = Math.max(0, Math.min(100, videoProgress[lesson.id] ?? 0))
    return sum + (parseDurationSeconds(lesson.video.duration) * pct) / 100
  }, 0)

  const averageVideoPercent =
    totalLessons > 0
      ? Math.round(
          allLessons.reduce((sum, lesson) => sum + Math.max(0, Math.min(100, videoProgress[lesson.id] ?? 0)), 0) /
            totalLessons
        )
      : 0

  const videosCompletedCount = allLessons.filter(lesson => (videoProgress[lesson.id] ?? 0) >= 100).length
  const videosStartedCount = allLessons.filter(lesson => (videoProgress[lesson.id] ?? 0) > 0).length

  return (
    <div className="progress-page-wrap">
      <section className="course-page-heading">
        <div className="section-index">THE FIELD GUIDE / VIDEO & LESSON PROGRESS</div>
        <h1>
          Every lesson,
          <br />
          <em>measured.</em>
        </h1>
        <p>
          Individual progress bars for all {totalLessons} lessons based on how much of each companion video has been
          watched, alongside your chapter quiz stamps.
        </p>
      </section>

      <section className="video-progress-overview" aria-label="Overall video watch summary">
        <div className="video-overview-stat">
          <span className="section-index">OVERALL VIDEO WATCHED</span>
          <strong>{averageVideoPercent}%</strong>
          <small>
            {Math.round(watchedVideoSeconds / 60)} OF {Math.round(totalVideoSeconds / 60)} TOTAL VIDEO MIN
          </small>
        </div>
        <div className="video-overview-stat-bar">
          <div className="ruler-heading">
            <span>
              {videosCompletedCount} OF {totalLessons} LESSON VIDEOS 100% WATCHED ({videosStartedCount} STARTED)
            </span>
            <span>
              {completedLessons.length} OF {totalLessons} CHAPTER LESSONS CREDITED · {xp.toLocaleString()} XP
            </span>
          </div>
          <div className="ruler-track">
            <i style={{ width: `${averageVideoPercent}%` }} />
            {[0, 25, 50, 75, 100].map(value => (
              <span key={value} style={{ left: `${value}%` }} />
            ))}
          </div>
          <div className="ruler-labels">
            <span>0% WATCHED</span>
            <span>ALL 15 VIDEOS COMPLETE</span>
          </div>
        </div>
        <div className="video-overview-badges">
          <b>{badges.length}</b>
          <span>
            OF {modules.length} STAMPS
            <br />
            EARNED
          </span>
        </div>
      </section>

      <section className="progress-courses-section" aria-label="Individual lesson video progress by course">
        {modules.map(module => {
          const courseWatchedAverage = Math.round(
            module.lessons.reduce((sum, lesson) => sum + Math.max(0, Math.min(100, videoProgress[lesson.id] ?? 0)), 0) /
              module.lessons.length
          )
          const courseVideosDone = module.lessons.filter(lesson => (videoProgress[lesson.id] ?? 0) >= 100).length
          const badgeUnlocked = badges.includes(module.badge.id)

          return (
            <article className="progress-course-block" key={module.id}>
              <header className="progress-course-header">
                <div>
                  <div className="section-index">
                    COURSE {module.index} · {courseVideosDone}/{module.lessons.length} VIDEOS COMPLETED
                  </div>
                  <h2>{module.title}</h2>
                  <p>{module.tagline}</p>
                </div>
                <div className="progress-course-meta">
                  <div className="course-aggregate-bar-wrap">
                    <div className="course-aggregate-label">
                      <span>COURSE VIDEO AVERAGE</span>
                      <strong>{courseWatchedAverage}%</strong>
                    </div>
                    <div className="course-aggregate-track">
                      <i style={{ width: `${courseWatchedAverage}%` }} />
                    </div>
                  </div>
                  <span className={`course-stamp-pill ${badgeUnlocked ? 'is-unlocked' : ''}`}>
                    {badgeUnlocked ? (
                      <>
                        <CheckCircle2 size={13} /> {module.badge.name} Stamped
                      </>
                    ) : (
                      <>
                        <LockKeyhole size={13} /> Stamp Locked
                      </>
                    )}
                  </span>
                </div>
              </header>

              <div className="lesson-progress-list">
                {module.lessons.map((lesson, lessonIndex) => {
                  const watchedPct = Math.max(0, Math.min(100, Math.round(videoProgress[lesson.id] ?? 0)))
                  const durationSecs = parseDurationSeconds(lesson.video.duration)
                  const watchedSecs = (durationSecs * watchedPct) / 100
                  const isLessonCredited = completedLessons.includes(lesson.id)
                  const statusLabel =
                    watchedPct >= 100 ? 'VIDEO COMPLETE' : watchedPct > 0 ? 'IN PROGRESS' : 'NOT STARTED'

                  return (
                    <div
                      className={`lesson-progress-card ${watchedPct >= 100 ? 'is-video-complete' : watchedPct > 0 ? 'is-video-started' : ''}`}
                      key={lesson.id}
                    >
                      <div className="lesson-progress-top">
                        <div className="lesson-progress-title-group">
                          <span className="lesson-progress-num">
                            {watchedPct >= 100 ? <Check size={13} /> : `0${lessonIndex + 1}`}
                          </span>
                          <div>
                            <h3>{lesson.title}</h3>
                            <div className="lesson-progress-sub">
                              <span>
                                <Film size={11} /> {lesson.video.title}
                              </span>
                              <span>·</span>
                              <span>{lesson.video.duration} VIDEO</span>
                              {isLessonCredited && (
                                <>
                                  <span>·</span>
                                  <span className="lesson-credited-tag">QUIZ PASSED</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="lesson-progress-actions">
                          <span
                            className={`video-status-badge ${
                              watchedPct >= 100 ? 'status-done' : watchedPct > 0 ? 'status-active' : 'status-idle'
                            }`}
                          >
                            {statusLabel} · {watchedPct}%
                          </span>
                          <button
                            type="button"
                            className="ink-button lesson-watch-btn"
                            onClick={() => onOpenLessonVideo(module, lesson)}
                          >
                            <Play size={12} />{' '}
                            {watchedPct === 0
                              ? 'Watch video'
                              : watchedPct >= 100
                                ? 'Rewatch video'
                                : `Resume (${watchedPct}%)`}
                          </button>
                          {watchedPct > 0 && (
                            <button
                              type="button"
                              className="video-reset-btn"
                              title="Reset video progress for this lesson"
                              aria-label={`Reset video progress for ${lesson.title}`}
                              onClick={() => onUpdateVideoProgress(lesson.id, 0)}
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="lesson-video-bar-wrap">
                        <div
                          className="lesson-video-bar"
                          role="progressbar"
                          aria-label={`${lesson.title} video watch progress`}
                          aria-valuenow={watchedPct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        >
                          <i style={{ width: `${watchedPct}%` }} />
                          {[0, 20, 40, 60, 80, 100].map(tick => (
                            <span key={tick} className="bar-tick" style={{ left: `${tick}%` }} />
                          ))}
                        </div>
                        <div className="lesson-video-bar-labels">
                          <span>
                            {formatSeconds(watchedSecs)} / {lesson.video.duration} WATCHED
                          </span>
                          <div className="lesson-segment-pills">
                            {lesson.video.segments.map((seg, idx) => {
                              const segThreshold = (idx + 1) * 20
                              const segReached = watchedPct >= segThreshold
                              return (
                                <button
                                  type="button"
                                  key={seg.timestamp}
                                  className={`mini-segment-pill ${segReached ? 'is-reached' : ''}`}
                                  title={`Set watched progress to Segment ${idx + 1}: ${seg.label} (${segThreshold}%)`}
                                  onClick={() => onUpdateVideoProgress(lesson.id, segThreshold)}
                                >
                                  {seg.timestamp} · {segThreshold}%
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              <footer className="progress-course-footer">
                <span>
                  Want to jump into the full chapter notebook for <strong>{module.title}</strong>?
                </span>
                <button
                  type="button"
                  className="chapter-open"
                  onClick={() => onOpenLessonVideo(module, module.lessons[0])}
                >
                  Open chapter {module.index} <ArrowRight size={14} />
                </button>
              </footer>
            </article>
          )
        })}
      </section>
    </div>
  )
}
