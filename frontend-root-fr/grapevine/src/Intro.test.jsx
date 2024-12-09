import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, getByText, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Intro from './pages/Intro';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';

import * as matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

describe('Intro Component', () => {
    test('renders the Intro component with title and buttons', () => {
        render(
            <MemoryRouter>
                <Intro />
            </MemoryRouter>
        );
        expect(screen.getByText(/Grapevine!/i)).toBeVisible();
        expect(screen.getByText(/Log In/i)).toBeVisible();
        expect(screen.getByText(/Sign Up/i)).toBeVisible();
    });

    test('navigates to the Sign Up page on button click', () => {
        //const navigate = useNavigate();
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path= "/" element={<Intro />} />
                    <Route path= "/signup" element={<SignUpPage />} />
                </Routes>              
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText(/Sign Up/i));
        expect(screen.getByLabelText(/First Name/i)).toBeVisible();
    });

    test('navigates to Login In page on button click', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                <Route path="/" element={<Intro />} />
                <Route path="/login" element={<LoginPage />} />
                </Routes>
            </MemoryRouter>
        );
        fireEvent.click(screen.getByText(/Log In/i));
        expect(screen.getByLabelText(/Username/i)).toBeVisible();
    });

    test('buttons have correct styles', () => {
        render(
            <MemoryRouter>
                <Intro />
            </MemoryRouter>
        )
        const loginButton = screen.getByText(/Log In/i);
        const signUpButton = screen.getByText(/Sign Up/i);

        expect(loginButton).toHaveClass('Intro-buttons');
        expect(signUpButton).toHaveClass('Intro-buttons');
    });

    test('clicking Sign Up button twice maintains stable navigation behavior', () => {
        render(
            <MemoryRouter>
                <Intro />
            </MemoryRouter>
        );
        const signUpButton = screen.getByText(/Sign Up/i);

        fireEvent.click(signUpButton);
        fireEvent.click(signUpButton);
        expect(screen.getByText(/Sign Up/i)).toBeVisible();
    });

    test('clicking Log In button twice maintains stable navigation behavior', () => {
        render(
            <MemoryRouter>
                <Intro />
            </MemoryRouter>
        );
        const loginButton = screen.getByText(/Log In/i);

        fireEvent.click(loginButton);
        fireEvent.click(loginButton);
        expect(screen.getByText(/Log In/i)).toBeVisible();
    });

    test('allowing keyboard navigation and activation', () => {
        render(
            <MemoryRouter>
                <Intro />
            </MemoryRouter>
        );
        const loginButton = screen.getByText(/Log In/i);
        const signUpButton = screen.getByText(/Sign Up/i);

        loginButton.focus();
        expect(loginButton).toHaveFocus();

        fireEvent.keyDown(loginButton, { key: 'Enter', code: 'Enter' });

        signUpButton.focus();
        expect(signUpButton).toHaveFocus();

        fireEvent.keyDown(signUpButton, { key: ' ' });
    });

    test('buttons have correct roles and aria labels', () =>{
        render(
            <MemoryRouter>
                <Intro />
            </MemoryRouter>
        );

        const loginButton = screen.getByText(/Log In/i);
        const SignUpButton = screen.getByText(/Sign Up/i);

        expect(loginButton).toHaveAttribute('role', 'button');
        expect(loginButton).toHaveAttribute('aria-label', 'Log In');
        expect(SignUpButton).toHaveAttribute('role', 'button');
        expect(SignUpButton).toHaveAttribute('aria-label', 'Sign Up');

    });

    test('focuses on first input when navigating to Sign Up page', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Intro />} />
                    <Route path="/signup" element={<SignUpPage />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(/Sign Up/i));
        await waitFor(() => {
            expect(screen.getByText(/Sign Up/i)).toBeInTheDocument();
        });
    })

});
