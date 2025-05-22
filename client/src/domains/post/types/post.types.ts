export type PostType = 'ootd' | 'fashion' | 'free' | 'qna' | 'market' | 'groupbuy';

export interface ICreatePostFormValues {
  postType: PostType;
  title: string;
  content: string;
  images: string; // Comma-separated URLs for now
  tags?: string;   // Comma-separated tags
  additionalFields?: {
    style?: string;
    season?: string;
  };
  // status will likely be handled by backend default or a separate UI element if needed
}

export const POST_TYPE_OPTIONS: { value: PostType; label: string }[] = [
  { value: 'ootd', label: 'OOTD' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'free', label: 'Free Talk' },
  { value: 'qna', label: 'Q&A' },
  { value: 'market', label: 'Market' },
  { value: 'groupbuy', label: 'Group Buy' },
]; 