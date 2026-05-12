import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'

const Register = () => {
    const navigate = useNavigate()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    const { loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        const success = await handleRegister({ username, email, password })

        if (success) {
            navigate("/")
        } else {
            setError("Registration failed. This email or username may already be taken.")
        }
    }

    if (loading) {
        return (
            <main className="auth-main">
                <div className="auth-right" style={{ gridColumn: '1 / -1' }}>
                    <div className="form-container">
                        <h1>Loading…</h1>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="auth-main">

            {/* ── Decorative left panel ── */}
            <div className="auth-panel">
                <div className="panel-rings">
                    <span /><span /><span /><span />
                </div>
                <div className="panel-content">
                    <div className="panel-badge">
                        <span className="dot" />
                        New Account
                    </div>
                    <h2>Join us &amp; <em>unlock</em> everything</h2>
                    <p>Create your account in seconds and get started right away.</p>
                    <div className="panel-marks">
                        <div className="mark" />
                        <div className="mark active" />
                        <div className="mark" />
                    </div>
                </div>
            </div>

            {/* ── Form side ── */}
            <div className="auth-right">
                <div className="form-container">
                    <h1>Register</h1>
                    <p className="form-subtitle">Fill in the details to create your account</p>

                    {error && (
                        <p className="form-error">{error}</p>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label htmlFor="username">Username</label>
                            <input
                                onChange={(e) => { setUsername(e.target.value) }}
                                type="text" id="username" name="username"
                                placeholder="yourhandle" />
                        </div>

                        <div className="input-group">
                            <label htmlFor="email">Email</label>
                            <input
                                onChange={(e) => { setEmail(e.target.value) }}
                                type="email" id="email" name="email"
                                placeholder="you@example.com" />
                        </div>

                        <div className="input-group">
                            <label htmlFor="password">Password</label>
                            <input
                                onChange={(e) => { setPassword(e.target.value) }}
                                type="password" id="password" name="password"
                                placeholder="••••••••" />
                        </div>

                        <button className="button primary-button">
                            Create Account →
                        </button>
                    </form>

                    <p>Already have an account? <Link to={"/login"}>Login</Link></p>
                </div>
            </div>

        </main>
    )
}

export default Register