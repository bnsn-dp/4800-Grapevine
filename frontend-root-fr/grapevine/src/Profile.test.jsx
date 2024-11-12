import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import AxiosInstance from './Axios';
import Profile from './pages/Profile';

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
    // Mock API response for the current user
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockUserData] });

    // Mock API response for the profile user data
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockOtherUserData] });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('The other user is added to the user\'s following list, and the "Follow" button changes to "Following"', async () => {
    // Render the Profile component for a different user's profile
    render(
      <MemoryRouter initialEntries={['/profile/otherUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the component to load the other user's data
    await waitFor(() => expect(screen.getByText('@otherUsername')).toBeInTheDocument());

    // Mock add friend API response
    AxiosInstance.post.mockResolvedValueOnce({ status: 200 });

    // Click the "Follow" button
    const followButton = screen.getByText('Add Friend');
    fireEvent.click(followButton);

    // Verify the button text changes to "Following"
    await waitFor(() => {
      expect(screen.getByText('Remove Friend')).toBeInTheDocument();
    });

    // Verify the API call to add friend was made
    expect(AxiosInstance.post).toHaveBeenCalledWith(`/api/add_friend/`, {
      fid: expect.any(String),
      user: mockUserData.id,
      friendee: mockOtherUserData.id,
    });
  });

  test('The other user is removed from the user\'s following list, and the "Following" button changes to "Follow"', async () => {
    // Mock initial friendship status as "following"
    AxiosInstance.get.mockResolvedValueOnce({ data: { status: 'friend' } });

    // Render the Profile component
    render(
      <MemoryRouter initialEntries={['/profile/otherUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the component to load and show the "Following" button
    await waitFor(() => expect(screen.getByText('Remove Friend')).toBeInTheDocument());

    // Mock remove friend API response
    AxiosInstance.post.mockResolvedValueOnce({ status: 200 });

    // Click the "Remove Friend" button
    const removeFriendButton = screen.getByText('Remove Friend');
    fireEvent.click(removeFriendButton);

    // Verify the button text changes to "Add Friend"
    await waitFor(() => {
      expect(screen.getByText('Add Friend')).toBeInTheDocument();
    });

    // Verify the API call to remove friend was made
    expect(AxiosInstance.post).toHaveBeenCalledWith(`/api/remove_friend/`, {
      user: mockUserData.id,
      friendee: mockOtherUserData.id,
    });
  });

  test('Add Friends Pop-up will appear', async () => {
    // Render the Profile component
    render(
      <MemoryRouter initialEntries={['/profile/currentUsername']}>
        <Routes>
          <Route path="/profile/:username" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    );

    // Wait for the component to load the current user's data
    await waitFor(() => expect(screen.getByText('@currentUsername')).toBeInTheDocument());

    // Mock the button to open the Add Friends pop-up
    const addFriendButton = screen.getByText('Add Friend');
    fireEvent.click(addFriendButton);

    // Verify the pop-up text is displayed
    await waitFor(() => {
      expect(screen.getByText('Search to add a friend by username')).toBeInTheDocument();
    });
   });
    test('A prompt box to edit bio will appear', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    // Click on the "Edit" button
    fireEvent.click(screen.getByText('Edit'));

    // Check if the bio edit prompt appears
    expect(screen.getByPlaceholderText('Enter your bio')).toBeInTheDocument();
  });

  test('A prompt box to edit bio will appear and will hold user input data', () => {
    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    // Type new bio content
    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'New bio content' } });

    // Check if the bio input holds the new data
    expect(bioInput).toHaveValue('New bio content');
  });

  test('A prompt box to edit bio will appear, hold user input data, and save on "Save" button click', async () => {
    AxiosInstance.patch.mockResolvedValueOnce({ status: 200 }); // Mock patch request

    render(
      <MemoryRouter>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'Updated bio content' } });
    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(AxiosInstance.patch).toHaveBeenCalledWith('/users/johndoe/', { bio: 'Updated bio content' });
    });

    // Check if the bio section displays the updated bio
    expect(screen.queryByPlaceholderText('Enter your bio')).not.toBeInTheDocument();
    expect(screen.getByText('Updated bio content')).toBeInTheDocument();
  });

  test('A prompt box to edit bio will appear and will hold user data. Then after clicking the home button will transfer back to Home page, clearing out unsaved changes', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'Unsaved bio content' } });

    // Verify that the input holds the unsaved bio content
    expect(bioInput).toHaveValue('Unsaved bio content');

    // Mock navigation by clicking Home button
    fireEvent.click(screen.getByText('Home'));

    // Assert bio input is reset after returning to profile
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter your bio')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByPlaceholderText('Enter your bio')).toHaveValue(mockUser.bio);
  });

  test('A prompt box to edit bio will appear and will hold user data. Then after clicking the messages button will transfer back to Messages page, clearing out unsaved changes', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'Unsaved bio content' } });

    expect(bioInput).toHaveValue('Unsaved bio content');

    fireEvent.click(screen.getByText('Messages'));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter your bio')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByPlaceholderText('Enter your bio')).toHaveValue(mockUser.bio);
  });

  test('A prompt box to edit bio will appear and will hold user data. Then after clicking the communities button will transfer back to Communities page, clearing out unsaved changes', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'Unsaved bio content' } });

    expect(bioInput).toHaveValue('Unsaved bio content');

    fireEvent.click(screen.getByText('Communities'));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter your bio')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByPlaceholderText('Enter your bio')).toHaveValue(mockUser.bio);
  });

  test('A prompt box to edit bio will appear and will hold user data. Then after clicking the settings button will transfer back to Settings page, clearing out unsaved changes', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Profile />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Edit'));

    const bioInput = screen.getByPlaceholderText('Enter your bio');
    fireEvent.change(bioInput, { target: { value: 'Unsaved bio content' } });

    expect(bioInput).toHaveValue('Unsaved bio content');

    fireEvent.click(screen.getByText('Settings'));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Enter your bio')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Edit'));
    expect(screen.getByPlaceholderText('Enter your bio')).toHaveValue(mockUser.bio);
  });
});