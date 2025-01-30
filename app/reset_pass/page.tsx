// ResetPasswordForm.jsx
'use client'
import { useState } from 'react';

export default function ResetPasswordForm() {
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e:any) => {
    e.preventDefault();
    setMessage('');

    const res = await fetch('/api/auth/reset_pass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resetToken, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage('Password reset successfully! You can now log in.');
    } else {
      setMessage(data.message);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleReset}>
        <input
          type="text"
          placeholder="Enter Reset Token"
          value={resetToken}
          onChange={(e) => setResetToken(e.target.value)}
        />
        <input
          type="password"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button type="submit">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
