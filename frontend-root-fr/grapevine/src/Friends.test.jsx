import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AxiosInstance from './Axios';
import GetFriends from './functions/Friends';

// Mock AxiosInstance
vi.mock('./Axios');

describe('GetFriends Component', () => {
  const mockUserID = 'userID';
  const mockSearchResult = {
    id: 'searchUserID',
    username: 'searchUser',
    first_name: 'Search',
    last_name: 'User',
  };

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  test('Add Friends pop-up will appear', async () => {
    render(
      <MemoryRouter>
        <GetFriends userID={mockUserID} />
      </MemoryRouter>
    );

    // Click on "Add Friends" button
    const addFriendButton = screen.getByText('Add Friends');
    fireEvent.click(addFriendButton);

    // Check if the Add Friends pop-up appears
    expect(await screen.findByText('Search to add a friend by username')).toBeInTheDocument();
  });

  test("Add Friends pop-up will appear, user's names prompt filled, shows user with name", async () => {
    render(
      <MemoryRouter>
        <GetFriends userID={mockUserID} />
      </MemoryRouter>
    );

    // Mock API response for searching user
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockSearchResult] });

    // Click on "Add Friends" button
    fireEvent.click(screen.getByText('Add Friends'));

    // Fill in the search username field
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'searchUser' } });
    fireEvent.click(screen.getByText('Search'));

    // Check if the search result shows the user's name
    await waitFor(() => {
      expect(screen.getByText('User found: searchUser')).toBeInTheDocument();
    });

    // Verify the API call for searching user
    expect(AxiosInstance.get).toHaveBeenCalledWith('users/?username=searchUser');
  });

  test("Add Friends pop-up appears, search result shows user, then user is added to friends list", async () => {
    render(
      <MemoryRouter>
        <GetFriends userID={mockUserID} />
      </MemoryRouter>
    );

    // Mock API responses
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockSearchResult] }); // Mock search response
    AxiosInstance.get.mockResolvedValueOnce({ data: { genString: 'F12345' } }); // Mock generated friend ID
    AxiosInstance.post.mockResolvedValueOnce({ status: 200 }); // Mock add friend response
    AxiosInstance.get.mockResolvedValueOnce({ data: [mockSearchResult] }); // Mock updated friends list after adding

    // Click on "Add Friends" button
    fireEvent.click(screen.getByText('Add Friends'));

    // Fill in the search username field and search
    fireEvent.change(screen.getByPlaceholderText('Enter username'), { target: { value: 'searchUser' } });
    fireEvent.click(screen.getByText('Search'));

    // Wait for the user to appear in search results
    await waitFor(() => {
      expect(screen.getByText('User found: searchUser')).toBeInTheDocument();
    });

    // Click "Add as Friend" button
    fireEvent.click(screen.getByText('Add as Friend'));

    // Check that the friend status message updates
    await waitFor(() => {
      expect(screen.getByText('searchUser has been added as your friend.')).toBeInTheDocument();
    });

    // Verify API calls
    expect(AxiosInstance.get).toHaveBeenCalledWith('api/getfriends/');
    expect(AxiosInstance.post).toHaveBeenCalledWith('/api/add_friend/', {
      fid: 'F12345',
      user: mockUserID,
      friendee: mockSearchResult.id,
    });
    expect(AxiosInstance.get).toHaveBeenCalledWith(`api/get_friends_list/?userid=${mockUserID}`);
  });
});
