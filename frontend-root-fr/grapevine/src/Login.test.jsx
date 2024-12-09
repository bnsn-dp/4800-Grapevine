import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AxiosInstance from './Axios';
import { expect, vi } from 'vitest';
import { userEvent } from '@testing-library/user-event';


import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

describe('Login Component', () => {
    test('renders all form fields with correct labels and placeholders', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        expect(screen.getByLabelText(/Username/i)).toBeVisible();
        expect(screen.getByLabelText(/Password/i)).toBeVisible();
        expect(screen.getByPlaceholderText(/Username/i)).toBeVisible();
        expect(screen.getByPlaceholderText(/Password/i)).toBeVisible();
    });

    test('renders submit button with label "login" and is enabled',() => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );
        const submitButton = screen.getByRole('button', {name: /Log In/i});
        expect(submitButton).toBeVisible();
        expect(submitButton).toBeEnabled();
    });

    test('submit button is clicked before prompts are complete', async() =>{
        vi.mock('../Axios');
        AxiosInstance.post = vi.fn();
        AxiosInstance.post.mockRejectedValueOnce({ response: { status: 401 } });
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        await fireEvent.click(screen.getByRole('button', {name: /Log In/i}));
        await waitFor(() => {
            expect(screen.getByText(/Username and\/or password is incorrect/i)).toBeInTheDocument();
        });
    })

    test('submit form with correct data and navigates on successful login', async () => {
        AxiosInstance.post.mockResolvedValueOnce({ data: { status: 'success', first_name: 'John', last_name: 'Doe', username: 'johndoe' } });

        const navigate = vi.fn();
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        );

        await user.type(screen.getByLabelText(/Username/i), 'johndoe');
        await user.type(screen.getByLabelText(/Password/i), 'password');
        fireEvent.click(screen.getByRole('button', { name: /Log In/i}));

        await waitFor(() => {
            expect(AxiosInstance.post).toHaveBeenCalledWith('api/login/', {
                username: 'johndoe',
                userpassword: 'Password123!',
            });
            expect(navigate).toHaveBeenCalledWith('/home');
        });
    });
})