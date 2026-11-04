import { useState } from 'react'
import { Link } from 'react-router'
import {
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Cpu,
  Eye,
  Film,
  Flame,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Sparkles,
  Wrench,
  Zap,
} from 'lucide-react'
import { modules } from '../data/content'

export interface BadgeProgressInput {
  xp: number
  lessons: string[]
  badges: string[]
  videoProgress: Record<string, number>
}

export interface BadgeCatalogItem {
  id: string
  code: string
  name: string
  category: 'Chapter Mastery' | 'Video Milestones' | 'Study & XP Milestones'
  primaryColor: string
  secondaryColor: string
  borderColor: string
  iconName:
    | 'cpu'
    | 'wrench'
    | 'scale'
    | 'award'
    | 'film'
    | 'eye'
    | 'compass'
    | 'shield'
    | 'sparkles'
    | 'book'
    | 'zap'
    | 'flame'
  description: string
  requirement: string
  unlocked: boolean
  progressText: string
  progressPercent: number
  actionPath: string
  actionLabel: string
}

export function buildBadgeCatalog(input: BadgeProgressInput): BadgeCatalogItem[] {
  const allLessons = modules.flatMap(m => m.lessons)
  const completedVideos = allLessons.filter(l => (input.videoProgress[l.id] ?? 0) >= 100)

  const fundModule = modules.find(m => m.id === 'fundamentals')!
  const toolsModule = modules.find(m => m.id === 'tools')!
  const ethicsModule = modules.find(m => m.id === 'ethics')!

  const fundLessonsDone = fundModule.lessons.filter(l => input.lessons.includes(l.id)).length
  const toolsLessonsDone = toolsModule.lessons.filter(l => input.lessons.includes(l.id)).length
  const ethicsLessonsDone = ethicsModule.lessons.filter(l => input.lessons.includes(l.id)).length

  const fundVideosDone = fundModule.lessons.filter(l => (input.videoProgress[l.id] ?? 0) >= 100).length
  const toolsVideosDone = toolsModule.lessons.filter(l => (input.videoProgress[l.id] ?? 0) >= 100).length
  const ethicsVideosDone = ethicsModule.lessons.filter(l => (input.videoProgress[l.id] ?? 0) >= 100).length

  const hasFundamentalsBadge = input.badges.includes('badge-fundamentals')
  const hasToolsBadge = input.badges.includes('badge-tools')
  const hasEthicsBadge = input.badges.includes('badge-ethics')
  const chapterBadgesCount = [hasFundamentalsBadge, hasToolsBadge, hasEthicsBadge].filter(Boolean).length

  return [
    {
      id: 'badge-fundamentals',
      code: 'STAMP 01',
      name: 'Neural Navigator',
      category: 'Chapter Mastery',
      primaryColor: '#263f72',
      secondaryColor: '#dce6f7',
      borderColor: '#1e325c',
      iconName: 'cpu',
      description:
        'Mastered AI Fundamentals: statistical pattern prediction, the machine learning loop, deep neural networks, Transformers, and perception.',
      requirement: 'Complete Course 01 (AI Fundamentals) and score at least 3/4 on the chapter knowledge check.',
      unlocked: hasFundamentalsBadge,
      progressText: hasFundamentalsBadge
        ? 'Quiz passed · 5/5 lessons complete'
        : `${fundLessonsDone}/5 lessons credited · Pass quiz (3/4)`,
      progressPercent: hasFundamentalsBadge ? 100 : Math.round((fundLessonsDone / 5) * 80),
      actionPath: '/courses',
      actionLabel: hasFundamentalsBadge ? 'Review Course 01' : 'Open Course 01',
    },
    {
      id: 'badge-tools',
      code: 'STAMP 02',
      name: 'Prompt Pilot',
      category: 'Chapter Mastery',
      primaryColor: '#0d9488',
      secondaryColor: '#d5f5f0',
      borderColor: '#0f766e',
      iconName: 'wrench',
      description:
        'Mastered Tools & Techniques: the CLEAR prompting framework, Socratic study workflows, task decomposition, and source verification.',
      requirement: 'Complete Course 02 (Tools & Techniques) and score at least 3/4 on the chapter knowledge check.',
      unlocked: hasToolsBadge,
      progressText: hasToolsBadge
        ? 'Quiz passed · 5/5 lessons complete'
        : `${toolsLessonsDone}/5 lessons credited · Pass quiz (3/4)`,
      progressPercent: hasToolsBadge ? 100 : Math.round((toolsLessonsDone / 5) * 80),
      actionPath: '/courses',
      actionLabel: hasToolsBadge ? 'Review Course 02' : 'Open Course 02',
    },
    {
      id: 'badge-ethics',
      code: 'STAMP 03',
      name: 'Ethics Guardian',
      category: 'Chapter Mastery',
      primaryColor: '#d94d38',
      secondaryColor: '#fce2dc',
      borderColor: '#b83b28',
      iconName: 'scale',
      description:
        'Mastered Ethics & Responsibility: authorship and disclosure, algorithmic bias, data privacy, deepfake forensics, and human agency.',
      requirement:
        'Complete Course 03 (Ethics & Responsibility) and score at least 3/4 on the chapter knowledge check.',
      unlocked: hasEthicsBadge,
      progressText: hasEthicsBadge
        ? 'Quiz passed · 5/5 lessons complete'
        : `${ethicsLessonsDone}/5 lessons credited · Pass quiz (3/4)`,
      progressPercent: hasEthicsBadge ? 100 : Math.round((ethicsLessonsDone / 5) * 80),
      actionPath: '/courses',
      actionLabel: hasEthicsBadge ? 'Review Course 03' : 'Open Course 03',
    },
    {
      id: 'badge-field-scholar',
      code: 'STAMP 04',
      name: 'Field Guide Laureate',
      category: 'Chapter Mastery',
      primaryColor: '#b45309',
      secondaryColor: '#fef3c7',
      borderColor: '#92400e',
      iconName: 'award',
      description:
        'Earned all three chapter mastery stamps across Fundamentals, Tools & Techniques, and Ethics & Responsibility.',
      requirement: 'Unlock Neural Navigator, Prompt Pilot, and Ethics Guardian by passing all 3 chapter checks.',
      unlocked: input.badges.includes('badge-field-scholar') || chapterBadgesCount === 3,
      progressText: `${chapterBadgesCount} of 3 chapter stamps earned`,
      progressPercent: Math.round((chapterBadgesCount / 3) * 100),
      actionPath: '/courses',
      actionLabel: 'Go to Courses',
    },
    {
      id: 'badge-first-screening',
      code: 'STAMP 05',
      name: 'First Screening',
      category: 'Video Milestones',
      primaryColor: '#1d4ed8',
      secondaryColor: '#dbeafe',
      borderColor: '#1e40af',
      iconName: 'film',
      description: 'Watched your first complete companion video lecture from start to finish (100%).',
      requirement: 'Reach 100% video watch progress on any 1 lesson.',
      unlocked: input.badges.includes('badge-first-screening') || completedVideos.length >= 1,
      progressText: `${Math.min(1, completedVideos.length)} of 1 video watched to 100%`,
      progressPercent: completedVideos.length >= 1 ? 100 : 0,
      actionPath: '/progress',
      actionLabel: 'Watch Lesson Videos',
    },
    {
      id: 'badge-fundamentals-video',
      code: 'STAMP 06',
      name: 'Machine Observer',
      category: 'Video Milestones',
      primaryColor: '#4338ca',
      secondaryColor: '#e0e7ff',
      borderColor: '#3730a3',
      iconName: 'eye',
      description: 'Watched 100% of all five companion video lectures in Chapter 01: AI Fundamentals.',
      requirement: 'Reach 100% video watch progress on all 5 lessons in AI Fundamentals.',
      unlocked: input.badges.includes('badge-fundamentals-video') || fundVideosDone === 5,
      progressText: `${fundVideosDone} of 5 Chapter 01 videos at 100%`,
      progressPercent: Math.round((fundVideosDone / 5) * 100),
      actionPath: '/progress',
      actionLabel: 'View Video Progress',
    },
    {
      id: 'badge-tools-video',
      code: 'STAMP 07',
      name: 'Workflow Watcher',
      category: 'Video Milestones',
      primaryColor: '#0f766e',
      secondaryColor: '#ccfbf1',
      borderColor: '#115e59',
      iconName: 'compass',
      description: 'Watched 100% of all five companion video lectures in Chapter 02: Tools & Techniques.',
      requirement: 'Reach 100% video watch progress on all 5 lessons in Tools & Techniques.',
      unlocked: input.badges.includes('badge-tools-video') || toolsVideosDone === 5,
      progressText: `${toolsVideosDone} of 5 Chapter 02 videos at 100%`,
      progressPercent: Math.round((toolsVideosDone / 5) * 100),
      actionPath: '/progress',
      actionLabel: 'View Video Progress',
    },
    {
      id: 'badge-ethics-video',
      code: 'STAMP 08',
      name: 'Civic Witness',
      category: 'Video Milestones',
      primaryColor: '#c2410c',
      secondaryColor: '#ffedd5',
      borderColor: '#9a3412',
      iconName: 'shield',
      description: 'Watched 100% of all five companion video lectures in Chapter 03: Ethics & Responsibility.',
      requirement: 'Reach 100% video watch progress on all 5 lessons in Ethics & Responsibility.',
      unlocked: input.badges.includes('badge-ethics-video') || ethicsVideosDone === 5,
      progressText: `${ethicsVideosDone} of 5 Chapter 03 videos at 100%`,
      progressPercent: Math.round((ethicsVideosDone / 5) * 100),
      actionPath: '/progress',
      actionLabel: 'View Video Progress',
    },
    {
      id: 'badge-cinema-completionist',
      code: 'STAMP 09',
      name: 'Complete Screening Room',
      category: 'Video Milestones',
      primaryColor: '#6d28d9',
      secondaryColor: '#ede9fe',
      borderColor: '#5b21b6',
      iconName: 'sparkles',
      description: 'Watched every single companion video across all 15 lessons in the Field Guide to 100%.',
      requirement: 'Reach 100% video watch progress on all 15 lessons across the portal.',
      unlocked: input.badges.includes('badge-cinema-completionist') || completedVideos.length >= allLessons.length,
      progressText: `${completedVideos.length} of ${allLessons.length} total videos at 100%`,
      progressPercent: Math.round((completedVideos.length / allLessons.length) * 100),
      actionPath: '/progress',
      actionLabel: 'View Video Progress',
    },
    {
      id: 'badge-first-notes',
      code: 'STAMP 10',
      name: 'Field Initiate',
      category: 'Study & XP Milestones',
      primaryColor: '#15803d',
      secondaryColor: '#dcfce7',
      borderColor: '#166534',
      iconName: 'book',
      description: 'Opened your notebook and recorded your first completed AI literacy lessons.',
      requirement: 'Have at least 1 completed lesson recorded in your notebook.',
      unlocked: input.badges.includes('badge-first-notes') || input.lessons.length >= 1,
      progressText: `${Math.min(1, input.lessons.length)} of 1 lesson recorded`,
      progressPercent: input.lessons.length >= 1 ? 100 : 0,
      actionPath: '/courses',
      actionLabel: 'Browse Lessons',
    },
    {
      id: 'badge-level-2',
      code: 'STAMP 11',
      name: 'Rising Researcher',
      category: 'Study & XP Milestones',
      primaryColor: '#d97706',
      secondaryColor: '#fef3c7',
      borderColor: '#b45309',
      iconName: 'zap',
      description: 'Reached Level 2 in the Field Guide by earning 300 or more experience points (XP).',
      requirement: 'Accumulate at least 300 XP from lessons and chapter checks.',
      unlocked: input.badges.includes('badge-level-2') || input.xp >= 300,
      progressText: `${Math.min(300, input.xp)} / 300 XP`,
      progressPercent: Math.min(100, Math.round((input.xp / 300) * 100)),
      actionPath: '/courses',
      actionLabel: 'Earn XP in Courses',
    },
    {
      id: 'badge-level-4',
      code: 'STAMP 12',
      name: 'Senior Field Analyst',
      category: 'Study & XP Milestones',
      primaryColor: '#be123c',
      secondaryColor: '#ffe4e6',
      borderColor: '#9f1239',
      iconName: 'flame',
      description: 'Reached Level 4 in the Field Guide by earning 900 or more experience points (XP).',
      requirement: 'Accumulate at least 900 XP across lessons and chapter checks.',
      unlocked: input.badges.includes('badge-level-4') || input.xp >= 900,
      progressText: `${Math.min(900, input.xp)} / 900 XP`,
      progressPercent: Math.min(100, Math.round((input.xp / 900) * 100)),
      actionPath: '/courses',
      actionLabel: 'Earn XP in Courses',
    },
  ]
}

function renderBadgeIcon(iconName: BadgeCatalogItem['iconName'], size = 28) {
  switch (iconName) {
    case 'cpu':
      return <Cpu size={size} />
    case 'wrench':
      return <Wrench size={size} />
    case 'scale':
      return <Scale size={size} />
    case 'award':
      return <Award size={size} />
    case 'film':
      return <Film size={size} />
    case 'eye':
      return <Eye size={size} />
    case 'compass':
      return <Compass size={size} />
    case 'shield':
      return <ShieldCheck size={size} />
    case 'sparkles':
      return <Sparkles size={size} />
    case 'book':
      return <BookOpen size={size} />
    case 'zap':
      return <Zap size={size} />
    case 'flame':
      return <Flame size={size} />
  }
}

export default function BadgesPage(props: BadgeProgressInput) {
  const [filter, setFilter] = useState<'all' | 'owned' | 'locked'>('all')
  const catalog = buildBadgeCatalog(props)
  const ownedCount = catalog.filter(b => b.unlocked).length
  const lockedCount = catalog.length - ownedCount
  const overallBadgePct = Math.round((ownedCount / catalog.length) * 100)

  const categories: BadgeCatalogItem['category'][] = [
    'Chapter Mastery',
    'Video Milestones',
    'Study & XP Milestones',
  ]

  return (
    <div className="badges-page-wrap">
      <section className="course-page-heading">
        <div className="section-index">THE FIELD GUIDE / COMPLETE BADGE COLLECTION</div>
        <h1>
          Field stamps &
          <br />
          <em>honors.</em>
        </h1>
        <p>
          All {catalog.length} possible badges you can earn across the portal. Badges you own appear in full color;
          unearned badges remain grayed out until you complete their requirements.
        </p>
      </section>

      <section className="badges-summary-bar" aria-label="Badge collection summary">
        <div className="video-overview-stat">
          <span className="section-index">COLLECTION STATUS</span>
          <strong>
            {ownedCount} / {catalog.length}
          </strong>
          <small>{overallBadgePct}% OF ALL POSSIBLE BADGES OWNED</small>
        </div>

        <div className="badges-filter-controls" role="group" aria-label="Filter badges by ownership">
          <button
            type="button"
            aria-pressed={filter === 'all'}
            className={`format-tab ${filter === 'all' ? 'is-active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Badges ({catalog.length})
          </button>
          <button
            type="button"
            aria-pressed={filter === 'owned'}
            className={`format-tab ${filter === 'owned' ? 'is-active' : ''}`}
            onClick={() => setFilter('owned')}
          >
            Owned · Full Color ({ownedCount})
          </button>
          <button
            type="button"
            aria-pressed={filter === 'locked'}
            className={`format-tab ${filter === 'locked' ? 'is-active' : ''}`}
            onClick={() => setFilter('locked')}
          >
            Locked · Grayed Out ({lockedCount})
          </button>
        </div>
      </section>

      <div className="badges-categories-wrap">
        {categories.map(category => {
          const items = catalog
            .filter(item => item.category === category)
            .filter(item => (filter === 'owned' ? item.unlocked : filter === 'locked' ? !item.unlocked : true))

          if (items.length === 0) return null

          const totalInCategory = catalog.filter(item => item.category === category).length
          const ownedInCategory = catalog.filter(item => item.category === category && item.unlocked).length

          return (
            <section className="badge-category-section" key={category}>
              <header className="badge-category-header">
                <div>
                  <span className="section-index">BADGE SERIES</span>
                  <h2>{category}</h2>
                </div>
                <span className="badge-category-count">
                  {ownedInCategory} OF {totalInCategory} OWNED
                </span>
              </header>

              <div className="badge-catalog-grid">
                {items.map(badge => (
                  <article
                    key={badge.id}
                    className={`badge-catalog-card ${badge.unlocked ? 'is-owned' : 'is-locked'}`}
                    style={
                      badge.unlocked
                        ? ({
                            '--badge-primary': badge.primaryColor,
                            '--badge-secondary': badge.secondaryColor,
                            '--badge-border': badge.borderColor,
                          } as React.CSSProperties)
                        : undefined
                    }
                  >
                    <div className="badge-card-ribbon">
                      <span className="badge-code">{badge.code}</span>
                      <span className="badge-ownership-tag">
                        {badge.unlocked ? (
                          <>
                            <CheckCircle2 size={13} /> OWNED · FULL COLOR
                          </>
                        ) : (
                          <>
                            <LockKeyhole size={13} /> LOCKED · GRAYED OUT
                          </>
                        )}
                      </span>
                    </div>

                    <div className="badge-card-main">
                      <div className="badge-medallion" aria-hidden="true">
                        <div className="badge-medallion-inner">{renderBadgeIcon(badge.iconName, 30)}</div>
                      </div>

                      <div className="badge-card-copy">
                        <h3>{badge.name}</h3>
                        <p className="badge-desc">{badge.description}</p>
                        <div className="badge-req-box">
                          <span className="badge-req-label">HOW TO EARN</span>
                          <p>{badge.requirement}</p>
                        </div>
                      </div>
                    </div>

                    <footer className="badge-card-footer">
                      <div className="badge-progress-wrap">
                        <div className="badge-progress-labels">
                          <span>{badge.progressText}</span>
                          <strong>{badge.progressPercent}%</strong>
                        </div>
                        <div className="badge-progress-track">
                          <i style={{ width: `${badge.progressPercent}%` }} />
                        </div>
                      </div>
                      <Link className="badge-action-link" to={badge.actionPath}>
                        {badge.actionLabel} →
                      </Link>
                    </footer>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
