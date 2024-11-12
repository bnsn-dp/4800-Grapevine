import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AxiosInstance from './Axios';
import GetPosts from './functions/postFunctions';

vi.mock('./Axios');

describe('GetPosts Component', () => {
  beforeEach(() => {
    // Mock Axios calls for post ID and created post ID generation
    AxiosInstance.get.mockImplementation((url) => {
      if (url === 'api/getpostid/') return Promise.resolve({ data: { genString: 'P0000001' } });
      if (url === 'api/getcreatedpostid/') return Promise.resolve({ data: { genString: 'CP0000001' } });
    });
    // Mock Axios post request
    AxiosInstance.post.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

test('The user clicks create post button', () => {
    render(
      <MemoryRouter>
        <GetPosts userID="1" type="all" />
      </MemoryRouter>
    );

    // Click "+" button to open the post creation pop-up
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('Create New Post')).toBeInTheDocument();
  });

  test('The user clicks create post button and fills out prompt data (Image Link, Description) correctly', async () => {
    render(
      <MemoryRouter>
        <GetPosts userID="1" type="all" />
      </MemoryRouter>
    );

    // Open pop-up
    fireEvent.click(screen.getByText('+'));

    // Fill out fields
    fireEvent.change(screen.getByPlaceholderText('Image Link'), { target: { value: 'http://example.com/image.png' } });
    fireEvent.change(screen.getByPlaceholderText('Enter description'), { target: { value: 'This is a test post' } });

    // Submit form
    fireEvent.click(screen.getByText('Confirm'));

    // Wait for the post to be created and verify it appears in "The Trellis" and user profile
    await waitFor(() => {
      expect(AxiosInstance.get).toHaveBeenCalledWith('api/getpostid/');
      expect(AxiosInstance.post).toHaveBeenCalledWith('posts/', {
        postid: 'P0000001',
        postdescription: 'This is a test post',
        imagelink: 'http://example.com/image.png',
      });
      expect(AxiosInstance.get).toHaveBeenCalledWith('api/getcreatedpostid/');
      expect(AxiosInstance.post).toHaveBeenCalledWith('createdposts/', {
        ucpid: 'CP0000001',
        userid: '1',
        postid: 'P0000001',
      });
    });
  });

  test('The user clicks create post button and fills out prompt data (Image Link, Description) incorrectly', async () => {
    render(
      <MemoryRouter>
        <GetPosts userID="1" type="all" />
      </MemoryRouter>
    );

    // Open pop-up
    fireEvent.click(screen.getByText('+'));

    // Leave fields empty and submit
    fireEvent.click(screen.getByText('Confirm'));

    // Wait for validation prompt for required fields
    await waitFor(() => {
      expect(screen.getByText('Please fill out this field.')).toBeInTheDocument();
    });
  });

  test('The user clicks create post button and fills out description prompt and clicks "confirm" button', async () => {
    render(
      <MemoryRouter>
        <GetPosts userID="1" type="all" />
      </MemoryRouter>
    );

    // Open pop-up
    fireEvent.click(screen.getByText('+'));

    // Only fill in the description field
    fireEvent.change(screen.getByPlaceholderText('Enter description'), { target: { value: 'Description without image link' } });

    // Submit form
    fireEvent.click(screen.getByText('Confirm'));

    // Wait for prompt for required image link field
    await waitFor(() => {
      expect(screen.getByText('Please fill out this field.')).toBeInTheDocument();
    });
  });

  test('The user clicks create post button and fills out "Image Link" and does not fill out description', async () => {
    render(
      <MemoryRouter>
        <GetPosts userID="1" type="all" />
      </MemoryRouter>
    );

    // Open pop-up
    fireEvent.click(screen.getByText('+'));

    // Only fill in the image link field
    fireEvent.change(screen.getByPlaceholderText('Image Link'), { target: { value: 'http://example.com/image.png' } });

    // Submit form
    fireEvent.click(screen.getByText('Confirm'));

    // Wait for prompt for required description field
    await waitFor(() => {
      expect(screen.getByText('Please fill out this field.')).toBeInTheDocument();
    });
  });

  test('The user clicks create post button and fill out prompts but clicks cancel', async () => {
    render(
      <MemoryRouter>
        <GetPosts userID="1" type="all" />
      </MemoryRouter>
    );

    // Open pop-up
    fireEvent.click(screen.getByText('+'));

    // Fill in fields
    fireEvent.change(screen.getByPlaceholderText('Image Link'), { target: { value: 'http://example.com/image.png' } });
    fireEvent.change(screen.getByPlaceholderText('Enter description'), { target: { value: 'This is a test post' } });

    // Click "Cancel" button
    fireEvent.click(screen.getByText('Cancel'));

    // Ensure fields are cleared and dialog is closed
    expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText('Image Link').value).toBe('');
    expect(screen.getByPlaceholderText('Enter description').value).toBe('');
  });

    test('Create post pop-up will appear and close after "cancel" button is clicked, then reopens with cleared prompts', async () => {
    render(
      <MemoryRouter>
        <GetPosts userID="testUserID" type="all" />
      </MemoryRouter>
    );

    // Open the "Create post" pop-up
    fireEvent.click(screen.getByText('+'));

    // Ensure the pop-up appears
    expect(screen.getByText('Create New Post')).toBeInTheDocument();

    // Fill out the form fields
    fireEvent.change(screen.getByPlaceholderText('Image Link'), { target: { value: 'http://example.com/image.jpg' } });
    fireEvent.change(screen.getByPlaceholderText('Enter description'), { target: { value: 'Test description' } });

    // Click the "Cancel" button
    fireEvent.click(screen.getByText('Cancel'));

    // Ensure the pop-up is closed
    await waitFor(() => {
      expect(screen.queryByText('Create New Post')).not.toBeInTheDocument();
    });

    // Reopen the "Create post" pop-up
    fireEvent.click(screen.getByText('+'));

    // Verify that the form fields are cleared
    expect(screen.getByPlaceholderText('Image Link')).toHaveValue('');
    expect(screen.getByPlaceholderText('Enter description')).toHaveValue('');
  });

  test('The image link opens in a new tab', async () => {
    // Mock data for posts
    const mockPosts = [
      {
        username: 'testUser',
        description: 'Test post',
        datetime: '2023-09-22T08:00:00Z',
        imagelink: 'http://example.com/image.jpg',
      },
    ];

    // Mock the API response for fetching posts
    AxiosInstance.post.mockResolvedValueOnce({ data: { posts: mockPosts } });

    render(
      <MemoryRouter>
        <GetPosts userID="testUserID" type="all" />
      </MemoryRouter>
    );

    // Wait for posts to load
    await waitFor(() => {
      expect(screen.getByText('Test post')).toBeInTheDocument();
    });

    // Get the image link
    const imageLink = screen.getByText('http://example.com/image.jpg');

    // Verify it has the expected target attribute for opening in a new tab
    expect(imageLink).toHaveAttribute('target', '_blank');
    expect(imageLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

});