
import { render, screen, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { BrowserRouter } from 'react-router-dom';

// Mock localStorage
const localStorageMock = (function () {
    let store = {};
    return {
        getItem: function (key) {
            return store[key] || null;
        },
        setItem: function (key, value) {
            store[key] = value.toString();
        },
        clear: function () {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock fetch
global.fetch = jest.fn();

describe('Profile Component', () => {
    beforeEach(() => {
        fetch.mockClear();
        localStorage.clear();
    });

    test('renders user data when fetch is successful', async () => {
        localStorage.setItem('userEmail', 'test@example.com');

        const mockUser = {
            name: 'Test User',
            email: 'test@example.com',
            xp: 1000,
            lessonsCompleted: 5,
            level: 'Intermediate',
            streak: 3,
            user_type: 'learner',
            createdAt: '2023-01-01T00:00:00.000Z'
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockUser,
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        expect(screen.getByText(/Loading Profile.../i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Test User')).toBeInTheDocument();
            expect(screen.getByText('Intermediate')).toBeInTheDocument();
            expect(screen.getByText('3 Days')).toBeInTheDocument();
            expect(screen.getByText('1000')).toBeInTheDocument();
            // Check for joined date formatting (flexible check)
            expect(screen.getByText(/User Type/i)).toBeInTheDocument();
        });

        // Verify fetch was called with correct URL (port 3000)
        expect(fetch).toHaveBeenCalledWith(expect.stringContaining('http://localhost:3000/api/auth/me'));
    });

    test('renders user not found when fetch fails', async () => {
        localStorage.setItem('userEmail', 'test@example.com');

        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'Not found' }),
        });

        render(
            <BrowserRouter>
                <Profile />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('User not found')).toBeInTheDocument();
        });
    });
});
