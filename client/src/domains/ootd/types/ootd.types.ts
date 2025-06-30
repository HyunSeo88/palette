export interface IUserSummary {
  _id: string;
  nickname: string;
  profileImage?: string;
}

export interface IComment {
  _id: string;
  user: IUserSummary; // 또는 string (userId) 후 populate
  content: string;
  createdAt: string; // 또는 Date
  updatedAt: string; // 또는 Date
}

export interface IClothingItem {
  item: string; // 예: "상의", "하의"
  brand: string;
  details: string; // 예: "스카이블루 셔츠", "인디고 와이드 팬츠"
}

// Post 모델의 additionalFields.pollOptions 와 유사하게 정의
export interface IPollOption {
  _id?: string; // mongoose subdocument는 _id를 가짐
  optionText: string;
  votes: number;
  // voters: string[]; // IUserSummary[] 또는 string[] (userIds)
}

export interface IOotdPost {
  _id: string;
  user: IUserSummary;
  postType: 'ootd' | 'fashion' | 'free' | 'qna' | 'market' | 'groupbuy' | 'poll' | 'introduction';
  title: string; // OOTD의 경우 캡션의 일부 또는 자동 생성될 수 있음
  content: string; // OOTD의 경우 주 캡션
  images: string[]; // 필수, 최소 1개
  tags: string[]; // 예: "#캐주얼", "#여름코디" (제공된 HTML에서는 keywords로 사용됨)
  likes: string[]; // 좋아요 누른 사용자 ID 목록 (백엔드에서는 ObjectId 배열)
  likesCount: number; // 집계된 좋아요 수 (백엔드에서 가상 필드 또는 직접 관리 가능)
  comments: IComment[]; // 또는 ObjectId 배열 후 populate
  commentsCount: number;
  viewCount: number;
  isPinned?: boolean;
  status?: 'published' | 'draft' | 'pending_review' | 'deleted' | 'archived';
  additionalFields?: {
    style?: string; // "캐주얼", "미니멀" 등 (키워드와 중복될 수 있으나, 대표 스타일 지정용)
    season?: string; // "봄", "여름" 등
    clothingInfo?: IClothingItem[]; // 착용 의상 정보
    // 투표 게시물용 필드 (postType: 'poll' 일 때)
    pollOptions?: IPollOption[];
    pollEndDate?: string; // 또는 Date
    allowMultipleVotes?: boolean;
    showVoters?: boolean;
    // Q&A 게시물용 필드 (postType: 'qna' 일 때)
    isResolved?: boolean;
    selectedAnswerId?: string; // CommentId
  };
  createdAt: string; // 또는 Date
  updatedAt: string; // 또는 Date
}

// API 응답 타입 (페이지네이션 등 고려)
export interface IGetOotdPostsResponse {
  posts: IOotdPost[];
  totalPages: number;
  currentPage: number;
  totalPosts: number;
  // 다음 페이지 cursor 등 추가 가능
}

// 좋아요/댓글 등 액션에 대한 공통 응답 (예시)
export interface IActionResponse {
  success: boolean;
  message?: string;
  // 업데이트된 게시물 데이터 또는 일부 정보 반환 가능
  post?: Partial<IOotdPost>; // 예: 업데이트된 likesCount 등
} 