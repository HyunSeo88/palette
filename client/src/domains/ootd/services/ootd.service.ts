import api from '../../../utils/api';
import { IGetOotdPostsResponse, IOotdPost, IActionResponse, IComment } from '../types/ootd.types';

export interface GetOotdPostsParams {
  page?: number;
  limit?: number;
  keywords?: string; // Comma-separated or array, to be decided with backend
  style?: string;
  season?: string;
  sortBy?: 'createdAt' | 'likesCount' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

// 1. OOTD 게시물 목록 조회 (페이지네이션, 필터링, 정렬 포함)
export const getOotdPosts = async (params?: GetOotdPostsParams): Promise<IGetOotdPostsResponse> => {
  try {
    const response = await api.get('/posts', {
      params: { ...params, postType: 'ootd' }, // 항상 postType=ootd로 필터링
    });

    // Manually add likesCount if it's missing or to ensure it's correct
    const postsWithLikesCount = response.data.posts.map((post: IOotdPost) => ({
      ...post,
      likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
    }));

    return {
      ...response.data,
      posts: postsWithLikesCount,
    };
  } catch (error) {
    console.error('Error fetching OOTD posts:', error);
    throw error; // 에러를 호출한 쪽에서 처리하도록 다시 throw
  }
};

// 2. 특정 OOTD 게시물 상세 조회
export const getOotdPostById = async (postId: string): Promise<IOotdPost> => {
  try {
    const response = await api.get(`/posts/${postId}`);
    // 여기서 백엔드가 postType: 'ootd'만 반환하도록 보장하거나, 프론트에서 검증 필요
    if (response.data.postType !== 'ootd') {
      throw new Error('Requested post is not an OOTD post.');
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching OOTD post with ID ${postId}:`, error);
    throw error;
  }
};

// 3. OOTD 게시물 생성 (타이틀은 content에서 추출하거나, 별도 필드로 받을지 백엔드와 협의)
export const createOotdPost = async (postData: {
  content: string;
  images: File[]; // 실제 파일 업로드의 경우 FormData 사용 필요
  tags?: string[];
  additionalFields?: {
    style?: string;
    season?: string;
    clothingInfo?: { item: string; brand: string; details: string }[];
  };
}): Promise<IOotdPost> => {
  try {
    const formData = new FormData();
    formData.append('postType', 'ootd');
    formData.append('title', postData.content.substring(0, 50)); // 임시 타이틀, 백엔드에서 처리할 수도 있음
    formData.append('content', postData.content);
    postData.images.forEach((image) => formData.append('images', image));
    if (postData.tags) formData.append('tags', JSON.stringify(postData.tags));
    if (postData.additionalFields) {
      formData.append('additionalFields', JSON.stringify(postData.additionalFields));
    }

    const response = await api.post('/posts', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating OOTD post:', error);
    throw error;
  }
};

// 4. OOTD 게시물 수정
export const updateOotdPost = async (
  postId: string,
  updateData: Partial<{
    title?: string;
    content?: string;
    images?: (string | File)[]; // 기존 이미지 URL 또는 새 파일
    tags?: string[];
    additionalFields?: {
        style?: string;
        season?: string;
        clothingInfo?: { item: string; brand: string; details: string }[];
      };
  }>
): Promise<IOotdPost> => {
  try {
    // 이미지 파일과 URL을 구분하여 처리해야 함. FormData 사용 필요.
    // 이 부분은 백엔드 API 설계에 따라 복잡해질 수 있음 (이미지 추가/삭제/순서 변경 등)
    // 간단하게 전체 데이터를 보내는 것으로 가정, 또는 이미지 처리를 위한 별도 엔드포인트 고려
    const response = await api.put(`/posts/${postId}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating OOTD post with ID ${postId}:`, error);
    throw error;
  }
};

// 5. OOTD 게시물 삭제
export const deleteOotdPost = async (postId: string): Promise<IActionResponse> => {
  try {
    const response = await api.delete(`/posts/${postId}`);
    return response.data; // { success: true, message: "..." }
  } catch (error) {
    console.error(`Error deleting OOTD post with ID ${postId}:`, error);
    throw error;
  }
};

// 6. OOTD 게시물 좋아요/좋아요 취소
export const toggleLikeOotdPost = async (postId: string): Promise<IActionResponse & { likesCount: number; likedByCurrentUser: boolean }> => {
  try {
    // 백엔드 API에서 좋아요 상태(likedByCurrentUser)와 업데이트된 좋아요 수를 반환한다고 가정
    const response = await api.post(`/posts/${postId}/like`);
    return response.data; 
  } catch (error) {
    console.error(`Error toggling like for OOTD post with ID ${postId}:`, error);
    throw error;
  }
};

// 7. OOTD 게시물에 댓글 작성
export const addCommentToOotdPost = async (postId: string, content: string): Promise<IComment> => {
  try {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data; // 생성된 댓글 객체 반환 가정
  } catch (error) {
    console.error(`Error adding comment to OOTD post with ID ${postId}:`, error);
    throw error;
  }
};

// 8. OOTD 게시물 댓글 수정
export const updateOotdComment = async (postId: string, commentId: string, content: string): Promise<IComment> => {
  try {
    const response = await api.put(`/posts/${postId}/comments/${commentId}`, { content });
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ${commentId} for OOTD post ${postId}:`, error);
    throw error;
  }
};

// 9. OOTD 게시물 댓글 삭제
export const deleteOotdComment = async (postId: string, commentId: string): Promise<IActionResponse> => {
  try {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting comment ${commentId} for OOTD post ${postId}:`, error);
    throw error;
  }
};

// 10. Weekly Top OOTD 게시물 조회 (최근 7일간 좋아요가 많은 상위 10개)
export const getWeeklyTopOotdPosts = async (limit: number = 10): Promise<{
  posts: IOotdPost[];
  totalPosts: number;
  dateRange: {
    from: string;
    to: string;
  };
}> => {
  try {
    const response = await api.get('/posts/top-ootd', {
      params: { limit },
    });

    // Manually add likesCount if it's missing or to ensure it's correct
    const postsWithLikesCount = response.data.posts.map((post: IOotdPost) => ({
      ...post,
      likesCount: Array.isArray(post.likes) ? post.likes.length : 0,
    }));

    return {
      ...response.data,
      posts: postsWithLikesCount,
    };
  } catch (error) {
    console.error('Error fetching weekly top OOTD posts:', error);
    throw error;
  }
};

// 11. (필요시) 키워드 목록 조회 (백엔드에서 별도 API 제공시)
// export const getOotdKeywords = async (): Promise<string[]> => {
//   try {
//     const response = await api.get('/posts/ootd/keywords'); // 예시 엔드포인트
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching OOTD keywords:', error);
//     throw error;
//   }
// }; 