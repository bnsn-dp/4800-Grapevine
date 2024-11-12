import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GetSidebar from './functions/display';
import { describe, test, vi, beforeEach } from 'vitest';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('GetSidebar tests', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    global.localStorage.setItem('user', JSON.stringify({ first_name: 'John', last_name: 'Doe', username: 'johndoe' }));
  });

  test('A logged in user presses the home button on the sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <GetSidebar />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    expect(mockNavigate).toHaveBeenCalledWith('/home');
  });

  test('A logged in user presses the messages button on the sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <GetSidebar />
      </MemoryRouter>
    );

    const messagesLink = screen.getByText('Messages');
    fireEvent.click(messagesLink);

    expect(mockNavigate).toHaveBeenCalledWith('/messages');
  });

  test('A logged in user presses the communities button on the sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <GetSidebar />
      </MemoryRouter>
    );

    const communitiesLink = screen.getByText('Communities');
    fireEvent.click(communitiesLink);

    expect(mockNavigate).toHaveBeenCalledWith('/Communities');
  });

  test('A logged in user presses the settings button on the sidebar', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <GetSidebar />
      </MemoryRouter>
    );

    const settingsLink = screen.getByText('Settings');
    fireEvent.click(settingsLink);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
