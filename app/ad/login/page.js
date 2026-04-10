'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '../../admin/admin.css';

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Login failed');
                setLoading(false);
                return;
            }

            router.push('/admin');
        } catch (err) {
            setError('Connection error. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="adminRoot" suppressHydrationWarning>
            <div className="loginPage">
                <div className="loginCard">
                    <h1>AUREEVO</h1>
                    <p className="loginSubtitle">Admin Panel</p>

                    {error && <div className="loginError">{error}</div>}

                    <form onSubmit={handleLogin} suppressHydrationWarning>
                        <div className="formGroup">
                            <label>Email Address</label>
                            <input
                                type="email"
                                className="formInput"
                                placeholder="admin@aureevo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="formGroup">
                            <label>Password</label>
                            <input
                                type="password"
                                className="formInput"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button type="submit" className="loginBtn" disabled={loading}>
                            {loading ? 'Signing in...' : 'SIGN IN'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
