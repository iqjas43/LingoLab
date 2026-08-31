import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Leaderboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                const res = await fetch('http://localhost:3000/api/auth/leaderboard');
                const data = await res.json();
                setUsers(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }
        fetchLeaderboard();
    }, []);

    return (
        <div style={{
            backgroundColor: '#20232a',
            minHeight: '100vh',
            color: 'white',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <h1 style={{ color: '#ffd700', marginBottom: '30px' }}>🏆 Leaderboard 🏆</h1>



            {loading ? (
                <p>Loading ranking...</p>
            ) : (
                <div style={{ width: '100%', maxWidth: '600px' }}>
                    {users.map((user, index) => (
                        <div
                            key={user._id}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '15px 20px',
                                marginBottom: '10px',
                                backgroundColor: index === 0 ? '#ffd7001a' : '#282c34',
                                borderRadius: '10px',
                                border: index === 0 ? '2px solid #ffd700' : '1px solid #3a3f4b',
                                alignItems: 'center'
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <span style={{
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#888'
                                }}>
                                    #{index + 1}
                                </span>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{user.name}</span>
                                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>{user.level}</span>
                                </div>
                            </div>
                            <span style={{ fontSize: '18px', color: '#61dafb', fontWeight: 'bold' }}>
                                {user.xp} XP
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Leaderboard;
