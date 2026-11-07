import { useState, useEffect, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import { getProfile, updateProfile, changePassword, ApiError } from '../lib/api'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { Alert, AlertDescription } from '../components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu'
import { Menu, X, User as UserIcon, ShieldCheck, KeyRound } from 'lucide-react'
import '../App.css'

export default function Account() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  const [mobileNav, setMobileNav] = useState(false)

  // Profile Details Tab state
  const [name, setName] = useState(user?.name ?? '')
  const [username, setUsername] = useState(user?.username ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [savingProfile, setSavingProfile] = useState(false)

  // Password Reset Tab state
  const [pwdCurrentPassword, setPwdCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null)
  const [pwdError, setPwdError] = useState<string | null>(null)
  const [changingPwd, setChangingPwd] = useState(false)

  // Fetch latest profile from DB on mount
  useEffect(() => {
    let cancelled = false
    getProfile()
      .then((data) => {
        if (cancelled || !data?.user) return
        updateUser(data.user)
        setName(data.user.name ?? '')
        setUsername(data.user.username)
      })
      .catch(() => {
        // Fallback to local session
      })
    return () => {
      cancelled = true
    }
  }, [updateUser])

  // Sync state if user context changes
  useEffect(() => {
    if (user) {
      setName(user.name ?? '')
      setUsername(user.username)
    }
  }, [user])

  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setProfileError(null)
    setProfileSuccess(null)

    if (!currentPassword) {
      setProfileError('Current password is required to save changes.')
      return
    }

    setSavingProfile(true)
    try {
      const res = await updateProfile({
        name: name.trim() ? name.trim() : null,
        username: username.trim(),
        currentPassword,
      })
      updateUser({
        username: res.user.username,
        name: res.user.name,
      })
      setProfileSuccess('Profile updated successfully.')
      setCurrentPassword('')
    } catch (err) {
      if (err instanceof ApiError) {
        setProfileError(err.message)
      } else if (err instanceof Error) {
        setProfileError(err.message)
      } else {
        setProfileError('Failed to update profile. Please try again.')
      }
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setPwdError(null)
    setPwdSuccess(null)

    if (!pwdCurrentPassword) {
      setPwdError('Current password is required.')
      return
    }

    if (newPassword.length < 8) {
      setPwdError('New password must be at least 8 characters long.')
      return
    }

    setChangingPwd(true)
    try {
      await changePassword({
        currentPassword: pwdCurrentPassword,
        newPassword,
      })
      setPwdSuccess('Password updated successfully.')
      setPwdCurrentPassword('')
      setNewPassword('')
    } catch (err) {
      if (err instanceof ApiError) {
        setPwdError(err.message)
      } else if (err instanceof Error) {
        setPwdError(err.message)
      } else {
        setPwdError('Failed to update password. Please check your credentials.')
      }
    } finally {
      setChangingPwd(false)
    }
  }

  return (
    <main className="field-guide account-page-wrapper" id="top">
      <header className="guide-header">
        <Link className="wordmark" to="/">
          <span className="wordmark-icon">f.</span>
          <span>
            FIELDNOTES <em>/ AI</em>
          </span>
        </Link>
        <button
          className="mobile-menu"
          aria-label="Toggle navigation"
          onClick={() => setMobileNav(!mobileNav)}
        >
          {mobileNav ? <X /> : <Menu />}
        </button>
        <nav
          className={mobileNav ? 'guide-nav nav-open' : 'guide-nav'}
          aria-label="Main navigation"
        >
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button type="button" className="nav-account">
                  Sign out <span>({user.username})</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="nav-dropdown-content">
                <DropdownMenuItem
                  className="nav-dropdown-item"
                  onSelect={() => {
                    setMobileNav(false)
                    navigate('/account')
                  }}
                >
                  Account
                </DropdownMenuItem>
                <DropdownMenuSeparator className="nav-dropdown-separator" />
                <DropdownMenuItem
                  variant="destructive"
                  className="nav-dropdown-item nav-dropdown-item-destructive"
                  onSelect={() => {
                    setMobileNav(false)
                    logout()
                  }}
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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

      <div className="account-container">
        <div className="account-header-section">
          <p className="account-badge-label">MEMBER DOSSIER</p>
          <h1 className="account-title">Account Settings</h1>
          <p className="account-subtitle">
            Manage your personal profile details, account credentials, and security settings.
          </p>
        </div>

        {/* User Summary Card (R2) */}
        <section className="account-summary-card" aria-label="User summary">
          <div className="account-avatar" aria-hidden="true">
            {(user?.name || user?.username || 'U')[0].toUpperCase()}
          </div>
          <div className="account-summary-meta">
            <div className="account-summary-name-row">
              <span className="account-summary-name-label">Name:</span>
              <span className="account-summary-name" data-testid="account-display-name">
                {user?.name || 'Not set'}
              </span>
            </div>
            <div className="account-summary-username-row">
              <span className="account-summary-username-label">Username:</span>
              <span className="account-summary-username" data-testid="account-display-username">
                @{user?.username}
              </span>
            </div>
            <div className="account-summary-status">
              <ShieldCheck className="account-status-icon" size={14} />
              <span>Verified Fieldnotes Member</span>
            </div>
          </div>
        </section>

        {/* Navigation Tabs (R2 & R3) */}
        <Tabs defaultValue="profile" className="account-tabs">
          <TabsList className="account-tabs-list">
            <TabsTrigger value="profile" className="account-tab-trigger">
              <UserIcon size={14} />
              <span>Profile Details</span>
            </TabsTrigger>
            <TabsTrigger value="password" className="account-tab-trigger">
              <KeyRound size={14} />
              <span>Password Reset</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Profile Details (R2) */}
          <TabsContent value="profile" className="account-tab-content">
            <div className="account-card">
              <div className="account-card-header">
                <h2>Profile Details</h2>
                <p>Update your display name and registered username.</p>
              </div>

              {profileSuccess && (
                <Alert className="account-alert account-alert-success" role="status">
                  <AlertDescription>{profileSuccess}</AlertDescription>
                </Alert>
              )}
              {profileError && (
                <Alert variant="destructive" className="account-alert" role="alert">
                  <AlertDescription>{profileError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleProfileSubmit} className="account-form" noValidate={false}>
                <div className="account-field">
                  <label htmlFor="account-name-input">
                    Full Name <span className="account-field-optional">(optional)</span>
                  </label>
                  <input
                    id="account-name-input"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={100}
                    placeholder="Enter your name"
                    className="account-input"
                  />
                  <span className="account-hint">Maximum 100 characters.</span>
                </div>

                <div className="account-field">
                  <label htmlFor="account-username-input">
                    Username <span className="account-field-required">*</span>
                  </label>
                  <input
                    id="account-username-input"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    maxLength={40}
                    placeholder="Enter username"
                    className="account-input"
                  />
                  <span className="account-hint">Required, maximum 40 characters.</span>
                </div>

                <div className="account-field">
                  <label htmlFor="account-current-password-input">
                    Current Password <span className="account-field-required">*</span>
                  </label>
                  <input
                    id="account-current-password-input"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Verify identity with current password"
                    className="account-input"
                  />
                  <span className="account-hint">
                    Required to confirm changes to your profile.
                  </span>
                </div>

                <div className="account-actions">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="account-btn-primary"
                  >
                    {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          </TabsContent>

          {/* Tab 2: Password Reset (R3) */}
          <TabsContent value="password" className="account-tab-content">
            <div className="account-card">
              <div className="account-card-header">
                <h2>Password Reset</h2>
                <p>Change your account password securely.</p>
              </div>

              {pwdSuccess && (
                <Alert className="account-alert account-alert-success" role="status">
                  <AlertDescription>{pwdSuccess}</AlertDescription>
                </Alert>
              )}
              {pwdError && (
                <Alert variant="destructive" className="account-alert" role="alert">
                  <AlertDescription>{pwdError}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handlePasswordSubmit} className="account-form" noValidate={false}>
                <div className="account-field">
                  <label htmlFor="account-pwd-current-input">
                    Current Password <span className="account-field-required">*</span>
                  </label>
                  <input
                    id="account-pwd-current-input"
                    type="password"
                    value={pwdCurrentPassword}
                    onChange={(e) => setPwdCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter current password"
                    className="account-input"
                  />
                </div>

                <div className="account-field">
                  <label htmlFor="account-pwd-new-input">
                    New Password <span className="account-field-required">*</span>
                  </label>
                  <input
                    id="account-pwd-new-input"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={8}
                    placeholder="Enter new password (min. 8 characters)"
                    className="account-input"
                  />
                  <span className="account-hint">Must be at least 8 characters long.</span>
                </div>

                <div className="account-actions">
                  <button
                    type="submit"
                    disabled={changingPwd}
                    className="account-btn-primary"
                  >
                    {changingPwd ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

export { Account }
