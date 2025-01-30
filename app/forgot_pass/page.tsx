// ForgotPasswordForm.jsx
'use client'
import { useState } from 'react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/auth/forgot_pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      // For demonstration, we show the reset token if it's returned
      setMessage(`Token: ${data.resetToken} — use it on the Reset Password page.`);
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button type="submit">Get Reset Token</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
