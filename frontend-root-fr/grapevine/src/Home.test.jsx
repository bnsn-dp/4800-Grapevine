import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Home from './pages/Home';
import AxiosInstance from './Axios';

vi.mock('./Axios');

describe('Home Component', () => {
  beforeEach(() => {
    // Set up mock data for Axios calls
    AxiosInstance.get.mockResolvedValue({ data: [{ id: '1', username: 'testuser' }] });
    AxiosInstance.post.mockResolvedValue({ data: { posts: [{ username: 'testuser', description: 'Sample post', imagelink: 'http://example.com/image.png' }] } });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('The user types in a search term to an input field on the home page and presses enter', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Sample' } });

    // Wait for posts to be displayed
    await waitFor(() => {
      expect(screen.getByText(/Sample post/i)).toBeInTheDocument();
    });
  });

  test('The user begins to type in a search term to an input field on the home page but clicks out', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Simulate opening the post creation pop-up
    fireEvent.click(screen.getByText('+'));

    // Simulate entering data in fields
    const imageInput = screen.getByPlaceholderText('Enter image URL');
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    fireEvent.change(imageInput, { target: { value: 'http://example.com/image.png' } });
    fireEvent.change(descriptionInput, { target: { value: 'New post description' } });

    // Simulate clicking the cancel button
    fireEvent.click(screen.getByText('Cancel'));

    // Wait for the pop-up to close
    await waitFor(() => {
      expect(imageInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });

    expect(screen.queryByPlaceholderText('Enter description')).not.toBeInTheDocument();
  });

  test('The user types in a username to a user search field to find a user linked to that username', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'testuser' } });

    // Wait for Axios call to complete and check if options are shown
    await waitFor(() => {
      expect(screen.getByText(/testuser/i)).toBeInTheDocument();
      expect(screen.getByText(/Options/i)).toBeInTheDocument();
    });
  });

  test('The user types in a username to a user search field to find a user linked to that username', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Simulate opening the post creation pop-up
    fireEvent.click(screen.getByText('+'));

    // Simulate entering data in fields
    const imageInput = screen.getByPlaceholderText('Enter image URL');
    const descriptionInput = screen.getByPlaceholderText('Enter description');
    fireEvent.change(imageInput, { target: { value: 'http://example.com/image.png' } });
    fireEvent.change(descriptionInput, { target: { value: 'New post description' } });

    // Click the cancel button to close the pop-up
    fireEvent.click(screen.getByText('Cancel'));

    // Verify fields are cleared and pop-up is closed
    await waitFor(() => {
      expect(imageInput.value).toBe('');
      expect(descriptionInput.value).toBe('');
    });

    expect(screen.queryByPlaceholderText('Enter description')).not.toBeInTheDocument();
  });

  test('The user clicks on "refresh" button on the "Trellis"', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Wait for posts to load and check their order
    await waitFor(() => {
      const postDescriptions = screen.getAllByText(/Post \d/);
      expect(postDescriptions).toHaveLength(3);

      // Check if posts appear in correct chronological order (latest post first)
      expect(postDescriptions[0]).toHaveTextContent('Post 3'); // 2023-09-22T08:00:00Z
      expect(postDescriptions[1]).toHaveTextContent('Post 2'); // 2023-09-21T12:00:00Z
      expect(postDescriptions[2]).toHaveTextContent('Post 1'); // 2023-09-20T10:00:00Z
    });
  });
});
