import { create, StateCreator } from 'zustand';
import { IOotdPost, IComment } from '../types/ootd.types';
import {
  getOotdPosts, GetOotdPostsParams,
  getOotdPostById,
  createOotdPost as apiCreateOotdPost,
  updateOotdPost as apiUpdateOotdPost,
  deleteOotdPost as apiDeleteOotdPost,
  toggleLikeOotdPost as apiToggleLikeOotdPost,
  addCommentToOotdPost as apiAddComment,
  getWeeklyTopOotdPosts,
  // updateOotdComment as apiUpdateComment, // 필요시 추가
  // deleteOotdComment as apiDeleteComment, // 필요시 추가
} from '../services/ootd.service';

interface OotdState {
  posts: IOotdPost[];
  topPosts: IOotdPost[]; // 인기 OOTD 캐러셀용
  currentPost: IOotdPost | null;
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  isLoading: boolean;
  error: string | null;
  currentKeywordFilter: string | null;
  // 댓글 및 의상정보 모달 상태
  isCommentModalOpen: boolean;
  isInfoModalOpen: boolean;
  activePostIdForModal: string | null;

  // 액션 및 상태 업데이트 함수
  fetchOotdPosts: (params?: GetOotdPostsParams) => Promise<void>;
  fetchTopOotdPosts: (limit?: number) => Promise<void>;
  fetchOotdPostById: (postId: string) => Promise<void>;
  createPost: (data: { content: string; images: File[]; tags?: string[]; additionalFields?: any }) => Promise<IOotdPost | null>;
  updatePost: (postId: string, data: Partial<IOotdPost>) => Promise<IOotdPost | null>;
  deletePost: (postId: string) => Promise<boolean>;
  toggleLike: (postId: string, userId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<IComment | null>;
  
  setKeywordFilter: (keyword: string | null) => void;
  openCommentModal: (postId: string) => void;
  closeCommentModal: () => void;
  openInfoModal: (postId: string) => void;
  closeInfoModal: () => void;
}

// Zustand StateCreator 타입 명시
const ootdStoreCreator: StateCreator<OotdState> = (set, get) => ({
  posts: [],
  topPosts: [],
  currentPost: null,
  currentPage: 1,
  totalPages: 0,
  totalPosts: 0,
  isLoading: false,
  error: null,
  currentKeywordFilter: null,
  isCommentModalOpen: false,
  isInfoModalOpen: false,
  activePostIdForModal: null,

  fetchOotdPosts: async (params?: GetOotdPostsParams) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getOotdPosts({ ...params, keywords: get().currentKeywordFilter || undefined });
      set({
        posts: params?.page && params.page > 1 ? [...get().posts, ...data.posts] : data.posts,
        currentPage: data.currentPage,
        totalPages: data.totalPages,
        totalPosts: data.totalPosts,
        isLoading: false,
      });
    } catch (error: any) {      
      set({ isLoading: false, error: error.message || 'Failed to fetch OOTD posts' });
    }
  },

  fetchTopOotdPosts: async (limit: number = 10) => {
    set({ isLoading: true, error: null });
    try {
      // Weekly Top OOTD: 최근 7일간 좋아요가 많은 상위 게시물을 가져옴
      const data = await getWeeklyTopOotdPosts(limit);
      set({ topPosts: data.posts, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to fetch weekly top OOTD posts' });
    }
  },

  fetchOotdPostById: async (postId: string) => {
    set({ isLoading: true, error: null, currentPost: null });
    try {
      const data = await getOotdPostById(postId);
      set({ currentPost: data, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || `Failed to fetch OOTD post ${postId}` });
    }
  },
  
  createPost: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newPost = await apiCreateOotdPost(data);
      set((state) => ({
        posts: [newPost, ...state.posts], // 새 게시물을 맨 앞에 추가
        totalPosts: state.totalPosts + 1,
        isLoading: false,
      }));
      return newPost;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to create post' });
      return null;
    }
  },

  updatePost: async (postId, data) => {
    set({ isLoading: true, error: null });
    try {
      const updatedPost = await apiUpdateOotdPost(postId, data);
      set((state) => ({
        posts: state.posts.map((p) => (p._id === postId ? updatedPost : p)),
        currentPost: state.currentPost?._id === postId ? updatedPost : state.currentPost,
        topPosts: state.topPosts.map((p) => (p._id === postId ? updatedPost : p)),
        isLoading: false,
      }));
      return updatedPost;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to update post' });
      return null;
    }
  },

  deletePost: async (postId) => {
    set({ isLoading: true, error: null });
    try {
      await apiDeleteOotdPost(postId);
      set((state) => ({
        posts: state.posts.filter((p) => p._id !== postId),
        topPosts: state.topPosts.filter((p) => p._id !== postId),
        currentPost: state.currentPost?._id === postId ? null : state.currentPost,
        totalPosts: state.totalPosts - 1,
        isLoading: false,
      }));
      return true;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to delete post' });
      return false;
    }
  },
  
  toggleLike: async (postId: string, userId: string) => {
    if (!userId) {
      set({ error: 'User ID is required to toggle like.' });
      console.error('[useOotdStore.toggleLike] User ID not provided.');
      return;
    }

    const originalPosts = get().posts;
    const originalTopPosts = get().topPosts;
    const originalCurrentPost = get().currentPost;

    // Optimistic update logic
    const updatePostOptimistically = (postToUpdate: IOotdPost): IOotdPost => {
      const isCurrentlyLiked = postToUpdate.likes.includes(userId);
      // Initialize likesCount properly, defaulting to 0 if it's not a number
      let newLikesCount = (typeof postToUpdate.likesCount === 'number' && !isNaN(postToUpdate.likesCount)) 
                          ? postToUpdate.likesCount 
                          : 0;
      let newLikesArray = [...postToUpdate.likes];

      if (isCurrentlyLiked) {
        newLikesArray = newLikesArray.filter(id => id !== userId);
        newLikesCount = Math.max(0, newLikesCount - 1);
      } else {
        newLikesArray.push(userId);
        newLikesCount += 1;
      }
      return { ...postToUpdate, likes: newLikesArray, likesCount: newLikesCount };
    };

    set((state) => ({
      posts: state.posts.map((p) => (p._id === postId ? updatePostOptimistically(p) : p)),
      topPosts: state.topPosts.map((p) => (p._id === postId ? updatePostOptimistically(p) : p)),
      currentPost: state.currentPost?._id === postId ? updatePostOptimistically(state.currentPost) : state.currentPost,
    }));

    try {
      // Assume apiToggleLikeOotdPost returns { likesCount: number; likedByCurrentUser: boolean; postId: string }
      // The postId in response is useful for very robust updates if many requests are flying
      const serverResponse = await apiToggleLikeOotdPost(postId);

      // Reconcile with server response
      set((state) => {
        const reconcilePost = (postToReconcile: IOotdPost | null): IOotdPost | null => {
          if (!postToReconcile || postToReconcile._id !== postId) return postToReconcile;

          let reconciledLikesArray = [...postToReconcile.likes];
          if (serverResponse.likedByCurrentUser) {
            if (!reconciledLikesArray.includes(userId)) {
              reconciledLikesArray.push(userId);
            }
          } else {
            reconciledLikesArray = reconciledLikesArray.filter(id => id !== userId);
          }
          
          console.log('[useOotdStore.toggleLike.reconcilePost]', {
            postId,
            userId,
            serverResponse_likedByCurrentUser: serverResponse.likedByCurrentUser,
            serverResponse_likesCount: serverResponse.likesCount,
            original_post_likes: postToReconcile.likes,
            reconciledLikesArray_final: reconciledLikesArray,
          });

          // Ensure the local array reflects the server's state for the current user,
          // but the count comes directly from the server as the absolute source of truth.
          return { 
            ...postToReconcile, 
            likesCount: serverResponse.likesCount, 
            likes: reconciledLikesArray 
          };
        };

        return {
          posts: state.posts.map(p => reconcilePost(p) || p),
          topPosts: state.topPosts.map(p => reconcilePost(p) || p),
          currentPost: reconcilePost(state.currentPost),
          error: null, // Clear any previous error
        };
      });

    } catch (error: any) {
      console.error('[useOotdStore.toggleLike] API Error:', error);
      // Rollback on error
      set({
        posts: originalPosts,
        topPosts: originalTopPosts,
        currentPost: originalCurrentPost,
        error: error.message || 'Failed to toggle like. Please try again.',
      });
    }
  },

  addComment: async (postId: string, content: string) => {
    set({ isLoading: true, error: null });
    try {
      const newComment = await apiAddComment(postId, content);
      set((state) => ({
        posts: state.posts.map((p) => 
          p._id === postId ? { ...p, comments: [...(p.comments || []), newComment], commentsCount: (p.commentsCount || 0) + 1 } : p
        ),
        currentPost: state.currentPost?._id === postId 
          ? { ...state.currentPost, comments: [...(state.currentPost.comments || []), newComment], commentsCount: (state.currentPost.commentsCount || 0) + 1 }
          : state.currentPost,
        isLoading: false,
      }));
      return newComment;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Failed to add comment' });
      return null;
    }
  },
  
  setKeywordFilter: (keyword: string | null) => {
    set({ currentKeywordFilter: keyword, currentPage: 1 }); // 키워드 변경 시 1페이지부터 다시 로드
    get().fetchOotdPosts({ page: 1 });
  },

  openCommentModal: (postId: string) => set({ isCommentModalOpen: true, activePostIdForModal: postId }),
  closeCommentModal: () => set({ isCommentModalOpen: false, activePostIdForModal: null }),
  openInfoModal: (postId: string) => set({ isInfoModalOpen: true, activePostIdForModal: postId }),
  closeInfoModal: () => set({ isInfoModalOpen: false, activePostIdForModal: null }),
});

export const useOotdStore = create<OotdState>(ootdStoreCreator); 