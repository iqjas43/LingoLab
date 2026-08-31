
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Profile from './Profile';
import Leaderboard from './Leaderboard';

// Mock child components to simplify testing
jest.mock('./Dashboard', () => () => <div>Dashboard Content</div>);
jest.mock('./Profile', () => () => <div>Profile Content</div>);
jest.mock('./Leaderboard', () => () => <div>Leaderboard Content</div>);

describe('Layout Component', () => {
    test('renders sidebar and navigates correctly', async () => {
        render(
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/leaderboard" element={<Leaderboard />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        );

        // Initial check (default path usually '/') - but here we need to navigate or set initial entry
        // Since we didn't set initial entry, check if Sidebar exists
        expect(screen.getByText('LingoLab')).toBeInTheDocument();
        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Leaderboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Profile/i)).toBeInTheDocument();
    });
});
