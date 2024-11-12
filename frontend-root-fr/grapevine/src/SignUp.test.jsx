import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent, getByText, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SignUpPage from './pages/SignUpPage';
import AxiosInstance from './Axios';
import userEvent from '@testing-library/user-event';



import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

AxiosInstance.get = vi.fn();
AxiosInstance.post = vi.fn();

describe('SignUp Component', () =>{
    test('renders all form fields with correct labels and placeholders', () => {
        render(
            <MemoryRouter>
                <SignUpPage />
            </MemoryRouter>
        );
    
        expect(screen.getByLabelText(/First Name/i)).toBeVisible();
        expect(screen.getByLabelText(/Last Name/i)).toBeVisible();
        expect(screen.getByLabelText(/Username/i)).toBeVisible();
        expect(screen.getByLabelText(/Email/i)).toBeVisible();
        expect(screen.getByLabelText(/Password/i)).toBeVisible();
    
        // Check for placeholder texts if necessary
        expect(screen.getByPlaceholderText(/First Name/i)).toBeVisible();
        expect(screen.getByPlaceholderText(/Last Name/i)).toBeVisible();
        expect(screen.getByPlaceholderText(/Username/i)).toBeVisible();
        expect(screen.getByPlaceholderText(/Email Address/i)).toBeVisible();
        expect(screen.getByPlaceholderText(/Enter User Password/i)).toBeVisible();
    });

    test('submit button initially display, Sign Up and is enabled', () =>{
        render(
            <MemoryRouter>
                <SignUpPage />
            </MemoryRouter>
        );
        const submitButton = screen.getByRole('button', {name: /Sign Up/i});
        expect(submitButton).toBeVisible();
        expect(submitButton).toBeEnabled();
    });

    test('sumbit button displays Signing Up... and is disabled when loading', () =>{
        render(
            <MemoryRouter>
                <SignUpPage />
            </MemoryRouter>
        );
        const submitButton = screen.getByRole('button', {name: /Sign Up/i});
        fireEvent.click(submitButton);

        expect(submitButton).toHaveTextContent('Signing Up...');
        expect(submitButton).toBeDisabled();
    });

    test('submits form with generated ID and navigates on success', async () => {
        AxiosInstance.get.mockResolvedValueOnce({ data: { genString: 'generated-id-123' } });
        AxiosInstance.post.mockResolvedValueOnce({});
    
        render(
            <MemoryRouter>
                <SignUpPage />
            </MemoryRouter>
        );
    
        // Fill out form fields individually, with clears if needed
        const firstNameInput = screen.getByLabelText(/First Name/i);
        const lastNameInput = screen.getByLabelText(/Last Name/i);
        const usernameInput = screen.getByLabelText(/Username/i);
        const emailInput = screen.getByLabelText(/Email/i);
        const passwordInput = screen.getByLabelText(/Password/i);
    
        await userEvent.clear(firstNameInput);
        await userEvent.type(firstNameInput, 'John');
    
        await userEvent.clear(lastNameInput);
        await userEvent.type(lastNameInput, 'Doe');
    
        await userEvent.clear(usernameInput);
        await userEvent.type(usernameInput, 'johndoe');
    
        await userEvent.clear(emailInput);
        await userEvent.type(emailInput, 'johndoe@example.com');
    
        await userEvent.clear(passwordInput);
        await userEvent.type(passwordInput, 'Password123!');
    
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
        // Wait for form submission to complete
        await waitFor(() => {
            expect(AxiosInstance.get).toHaveBeenCalledWith('api/getuserid/');
            expect(AxiosInstance.post).toHaveBeenCalledWith('users/', {
                id: 'generated-id-123',
                username: 'johndoe',
                userpassword: 'Password123!',
                status: 'Active',
                email: 'johndoe@example.com',
                firstname: 'John',
                lastname: 'Doe',
            });
        });
    });

    test('show validation error messages for empty required fields', async () =>{
        render(
            <MemoryRouter>
                <SignUpPage />
            </MemoryRouter>
        );
        
        userEvent.click(screen.getByRole('button', {name: /Sign Up/i}));
        expect(screen.getByText(/First Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Last Name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Username is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });

    test('submit button displays "Signing Up..." and is disabled during loading', async () =>{
        render(
            <MemoryRouter>
                <SignUpPage />
            </MemoryRouter>
        );
        AxiosInstance.get.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ data: { genString: 'generated-id-123' } }), 100)));
        AxiosInstance.post.mockResolvedValueOnce({});

        await userEvent.type(screen.getAllByLabelText(/First Name/i),'John');
        await userEvent.type(screen.getAllByLabelText(/Last Name/i),'Doe');
        await userEvent.type(screen.getAllByLabelText(/UserName/i),'johndoe');
        await userEvent.type(screen.getAllByLabelText(/Email/i),'johndoe@example.com');
        await userEvent.type(screen.getAllByLabelText(/Password/i),'password');

        const submitButton = screen.getByRole('button', {name: /Sign Up/i});
        fireEvent.click(submitButton);

        expect(submitButton).toHaveTextContent('Signing Up...');
        expect(submitButton).toBeDisabled();

        await waitFor(() =>{
            expect(AxiosInstance.get).toHaveBeenCalledWith('api/getuserid/');
        });
    });

    test('navigates to home on successful form submission', async () => {
        AxiosInstance.get.mockResolvedValueOnce({ data: { genString: 'generated-id-123' } });
        AxiosInstance.post.mockResolvedValueOnce({});
    
        const navigate = vi.fn();
        render(
            <MemoryRouter>
                <SignUpPage />
            </MemoryRouter>
        );
    
        // Fill out form fields
        await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
        await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
        await userEvent.type(screen.getByLabelText(/Username/i), 'johndoe');
        await userEvent.type(screen.getByLabelText(/Email/i), 'johndoe@example.com');
        await userEvent.type(screen.getByLabelText(/Password/i), 'Password123!');
    
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
        // Wait for navigation to be triggered after submission
        await waitFor(() => {
            expect(navigate).toHaveBeenCalledWith('/');
        });
    });

    test('displays error message on failed submission', async () => {
        AxiosInstance.get.mockResolvedValueOnce({ data: { genString: 'generated-id-123' } });
        AxiosInstance.post.mockRejectedValueOnce(new Error('Network Error'));
    
        render(
            <MemoryRouter>
                <SignUpPage />
            </MemoryRouter>
        );
    
        // Fill out form fields
        await userEvent.type(screen.getByLabelText(/First Name/i), 'John');
        await userEvent.type(screen.getByLabelText(/Last Name/i), 'Doe');
        await userEvent.type(screen.getByLabelText(/Username/i), 'johndoe');
        await userEvent.type(screen.getByLabelText(/Email/i), 'johndoe@example.com');
        await userEvent.type(screen.getByLabelText(/Password/i), 'Password123!');
    
        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /Sign Up/i }));
    
        // Wait for the error message to be displayed
        await waitFor(() => {
            expect(screen.getByText(/Sign up failed/i)).toBeInTheDocument();
        });
    });

})