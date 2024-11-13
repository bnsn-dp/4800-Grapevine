import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import AxiosInstance from './Axios';
import Profile from './pages/Profile';

import matchers from '@testing-library/jest-dom/matchers';
expect.extend(matchers);

vi.mock('./Axios');

describe('Profile Component', () => {
  const mockUserData = {
    id: 'currentUserID',
    username: 'currentUsername',
    firstname: 'Current',
    lastname: 'User',
    bio: 'This is the bio of the current user.',
  };

  const mockOtherUserData = {
    id: 'otherUserID',
    username: 'otherUsername',
    firstname: 'Other',
    lastname: 'User',
    bio: 'This is the bio of another user.',
  };

  beforeEach(() => {
    // Set up user data in localStorage and reset Axios mocks
    localStorage.setItem(
      'user',
      JSON.stringify({ id: 'currentUserID', username: 'currentUsername' })
    );
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  test('The other user is added to the user\'s following list, and the "Follow" button changes to "Following"', async () => {
    // Mock API responses
    AxiosInstance.get
      .mockResolvedValueOnce({ data: [mockUserData] })
      .mockResolvedValueOnce({ data: [mockOtherUserData] });
    AxiosInstance.post.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter initialEntries={['/profile/otherUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('@otherUsername')).toBeInTheDocument());

    const followButton = screen.getByText('Add Friend');
    fireEvent.click(followButton);

    await waitFor(() => expect(screen.getByText('Remove Friend')).toBeInTheDocument());
    expect(AxiosInstance.post).toHaveBeenCalledWith(`/api/add_friend/`, {
      fid: expect.any(String),
      user: mockUserData.id,
      friendee: mockOtherUserData.id,
    });
  });

  test('The other user is removed from the user\'s following list, and the "Following" button changes to "Follow"', async () => {
    // Mock initial friendship status and remove friend response
    AxiosInstance.get
      .mockResolvedValueOnce({ data: [mockUserData] })
      .mockResolvedValueOnce({ data: [mockOtherUserData] });
    AxiosInstance.post.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter initialEntries={['/profile/otherUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Remove Friend')).toBeInTheDocument());

    const removeFriendButton = screen.getByText('Remove Friend');
    fireEvent.click(removeFriendButton);

    await waitFor(() => expect(screen.getByText('Add Friend')).toBeInTheDocument());
    expect(AxiosInstance.post).toHaveBeenCalledWith(`/api/remove_friend/`, {
      user: mockUserData.id,
      friendee: mockOtherUserData.id,
    });
  });

  test('Add Friends Pop-up will appear', async () => {
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockUserData] });

    render(
      <MemoryRouter initialEntries={['/profile/currentUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('@currentUsername')).toBeInTheDocument());

    const addFriendButton = screen.getByText('Add Friend');
    fireEvent.click(addFriendButton);

    await waitFor(() => {
      expect(screen.getByText('Search to add a friend by username')).toBeInTheDocument();
    });
  });

  test('A prompt box to edit bio will appear', () => {
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockUserData] });

    render(
      <MemoryRouter initialEntries={['/profile/currentUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByPlaceholderText('Enter your bio')).toBeInTheDocument();
  });

  test('A prompt box to edit bio will appear and will hold user input data', () => {
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockUserData] });

    render(
      <MemoryRouter initialEntries={['/profile/currentUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'New bio content' } });
    expect(bioInput).toHaveValue('New bio content');
  });

  test('A prompt box to edit bio will appear, hold user input data, and save on "Save" button click', async () => {
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockUserData] });
    AxiosInstance.patch.mockResolvedValueOnce({ status: 200 });

    render(
      <MemoryRouter initialEntries={['/profile/currentUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'Updated bio content' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(AxiosInstance.patch).toHaveBeenCalledWith('/users/currentUsername/', { bio: 'Updated bio content' });
    });

    expect(screen.queryByPlaceholderText('Enter your bio')).not.toBeInTheDocument();
    expect(screen.getByText('Updated bio content')).toBeInTheDocument();
  });

  const navigationTest = async (navigationText, expectedBio) => {
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockUserData] });

    render(
      <MemoryRouter initialEntries={['/profile/currentUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'Unsaved bio content' } });

    expect(bioInput).toHaveValue('Unsaved bio content');

    fireEvent.click(screen.getByText(navigationText));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter your bio')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Edit/i));
    expect(screen.getByPlaceholderText('Enter your bio')).toHaveValue(expectedBio);
  };

  test('Bio editing prompt clears unsaved changes when navigating to Home', async () => {
    await navigationTest('Home', mockUserData.bio);
  });

  test('Bio editing prompt clears unsaved changes when navigating to Messages', async () => {
    await navigationTest('Messages', mockUserData.bio);
  });

  test('Bio editing prompt clears unsaved changes when navigating to Communities', async () => {
    await navigationTest('Communities', mockUserData.bio);
  });

  test('Bio editing prompt clears unsaved changes when navigating to Settings', async () => {
    await navigationTest('Settings', mockUserData.bio);
  });
});
