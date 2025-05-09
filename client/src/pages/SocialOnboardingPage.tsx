import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user'; // User 타입을 가져옵니다.

const SocialOnboardingPage: React.FC = () => {
  const { user, updateProfile, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 사용자가 인증되지 않았거나, 로딩 중이 아니고 이미 온보딩 정보가 충분한 경우 (예: 닉네임이 User_xxx 형태가 아닌 경우)
    // 또는 소셜 로그인 통해 바로 생성된 임시 유저가 아닌 경우 (예: provider가 email인 경우)
    // 는 이 페이지에 접근할 필요가 없으므로 메인으로 보냅니다.
    // 이 로직은 더 정교하게 만들 수 있습니다. (예: user 객체에 isSocialOnboardingCompleted 플래그 추가)
    if (!authLoading && !isAuthenticated) {
      console.warn('SocialOnboardingPage: User not authenticated. Redirecting to login.');
      navigate('/login');
      return;
    }

    if (user) {
      setNickname(user.nickname || '');
      setBio(user.bio || '');
      // 만약 닉네임이 기본 패턴 (예: 'User_')이 아니거나, 이미 bio가 있다면 온보딩이 불필요하다고 간주할 수도 있습니다.
      // 혹은 서버에서 isNewUser 플래그를 받아 리다이렉트 시점에만 이 페이지로 오도록 하는 것이 더 좋습니다.
      // 현재는 AuthContext의 isNewUser가 직접 이 페이지로 리다이렉트 한다고 가정합니다.
    }
  }, [user, authLoading, isAuthenticated, navigate]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nickname.trim()) {
      setError('닉네임은 필수 항목입니다. 공백만으로는 설정할 수 없습니다.');
      return;
    }
    if (nickname.length < 2 || nickname.length > 30) {
      setError('닉네임은 2자 이상 30자 이하로 입력해주세요.');
      return;
    }
    if (bio.length > 200) {
      setError('자기소개는 최대 200자까지 입력할 수 있습니다.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Partial<User> 타입을 명시적으로 사용합니다.
      const profileData: Partial<User> = { nickname: nickname.trim(), bio };
      const success = await updateProfile(profileData);
      if (success) {
        navigate('/'); // 온보딩 완료 후 메인 페이지로 이동
      } else {
        setError('프로필 업데이트에 실패했습니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err: any) {
      setError(err.message || '프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  }, [nickname, bio, updateProfile, navigate]);

  // authLoading 중이거나, 인증은 되었지만 user 객체가 아직 없을 때 (드문 경우)
  if (authLoading || (isAuthenticated && !user)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        Loading user data...
      </div>
    );
  }
  
  // 인증되지 않은 사용자는 useEffect에서 /login으로 보냅니다.
  if (!isAuthenticated) {
      return null; // Or a more specific "Redirecting to login..." message
  }

  return (
    <div style={{ maxWidth: '500px', margin: '50px auto', padding: '30px', border: '1px solid #e0e0e0', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h1 style={{ textAlign: 'center', color: '#333', marginBottom: '10px' }}>프로필 설정</h1>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
        Palette 커뮤니티 활동을 위해 프로필을 설정해주세요.
      </p>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="nickname" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>닉네임 <span style={{color: 'red'}}>*</span></label>
          <input
            type="text"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="2~30자 이내로 입력"
            required
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '25px' }}>
          <label htmlFor="bio" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444' }}>자기소개</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            maxLength={200}
            placeholder="자신을 간단하게 소개해주세요 (최대 200자)"
            style={{ width: '100%', padding: '12px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>
        {error && <p style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</p>}
        <button 
          type="submit" 
          disabled={isSubmitting || authLoading} 
          style={{ 
            width: '100%', 
            padding: '12px 15px', 
            backgroundColor: (isSubmitting || authLoading) ? '#ccc' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: (isSubmitting || authLoading) ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {isSubmitting ? '저장하는 중...' : 'Palette 시작하기'}
        </button>
      </form>
    </div>
  );
};

export default SocialOnboardingPage; 