import { getTokens } from '../../../utils/tokenUtils';
import { IMyPageData } from '../../../types/user'; // 경로 수정: client/src/types/user.ts 사용
import { ApiError } from '../../post/services/post.service'; // 경로 수정
// TODO: ApiError를 공용 에러 타입으로 분리하거나, userService에 적합한 에러 타입 정의

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000'; // /api는 각 함수에서 붙임

interface GetMyPageParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  postType?: string;
}

export const getMyPageData = async (params?: GetMyPageParams): Promise<IMyPageData> => {
  const { accessToken } = getTokens();
  if (!accessToken) {
    // throw new Error('Access token not found. Please log in.');
    // ApiError와 형식을 맞추기 위해 객체 throw 또는 Promise.reject 사용
    return Promise.reject({ message: 'Access token not found. Please log in.' } as ApiError);
  }

  const queryParams = new URLSearchParams();
  if (params) {
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.postType) queryParams.append('postType', params.postType);
  }
  const queryString = queryParams.toString();

  const response = await fetch(`${API_BASE_URL}/api/users/me/mypage${queryString ? `?${queryString}` : ''}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorData: ApiError = await response.json().catch(() => ({
      message: `HTTP error! status: ${response.status} - Unable to parse error JSON`,
    }));
    console.error('[getMyPageData] API Error Data:', errorData);
    throw errorData;
  }

  return response.json();
};

// 다른 사용자 프로필 조회 함수 (필요시 구현)
// export const getUserProfile = async (userId: string): Promise<IUserProfile> => { ... }; 