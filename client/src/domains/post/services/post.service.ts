import { ICreatePostFormValues } from '../types/post.types';

export interface ApiError {
  message: string;
  errors?: { msg: string; param?: string; location?: string }[]; // From express-validator
}

export interface CreatePostPayload {
  postType: ICreatePostFormValues['postType'];
  title: string;
  content: string;
  images: string[]; // Transformed from comma-separated string
  tags?: string[];  // Transformed from comma-separated string
  additionalFields?: ICreatePostFormValues['additionalFields'];
  status?: string; // Optional, backend defaults to 'published'
}

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const createPost = async (postData: CreatePostPayload, token: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/api/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(postData),
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status} - Unable to parse error JSON`,
    }));
    // Log detailed error for debugging before throwing a more generic one or the parsed one
    console.error('API Error Data:', errorData);
    throw errorData; 
  }

  return response.json();
}; 