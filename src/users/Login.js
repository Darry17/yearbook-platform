import React, { useState } from 'react';

function Login() {
const [privateKey, setPrivateKey] = useState('');
const [error, setError] = useState('');

const handleLogin = async () => {
    try {
    // Request a challenge from the backend
    const challengeResponse = await fetch('http://localhost:3000/generate-challenge', {
        method: 'GET',
    });

    if (!challengeResponse.ok) {
        throw new Error('Error generating challenge');
    }

    const { challenge } = await challengeResponse.json();

    // Sign the challenge with the private key
    const sign = window.crypto.subtle;
    const encoder = new TextEncoder();
    const challengeBuffer = encoder.encode(challenge);

    const key = await window.crypto.subtle.importKey(
        'jwk',
        JSON.parse(privateKey), // Private key in JWK format
        { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
        false,
        ['sign']
    );

    const signature = await sign.sign(
        { name: 'RSASSA-PKCS1-v1_5' },
        key,
        challengeBuffer
    );

    const signedChallenge = Buffer.from(signature).toString('base64');

    // Send signed challenge to backend for verification
    const loginResponse = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signedChallenge }),
    });

    if (!loginResponse.ok) {
        throw new Error('Invalid login credentials');
    }

    alert('Login successful!');
    } catch (err) {
    setError(err.message);
    }
};

return (
    <div>
    <h2>Login</h2>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <textarea
        placeholder="Private Key (JWK Format)"
        value={privateKey}
        onChange={(e) => setPrivateKey(e.target.value)}
    />
    <button onClick={handleLogin}>Login</button>
    </div>
);
}

export default Login;
