import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, CircularProgress, Divider, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useOotdStore } from '../stores/useOotdStore';
import { useAuth } from '../../../contexts/AuthContext';
import { IOotdPost, IComment } from '../types/ootd.types';

interface OotdCommentModalProps {
  open: boolean;
  onClose: () => void;
  postId: string | null;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  maxHeight: '80vh',
  bgcolor: 'background.paper',
  borderRadius: '12px',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  display: 'flex',
  flexDirection: 'column',
};

const OotdCommentModal: React.FC<OotdCommentModalProps> = ({ open, onClose, postId }) => {
  const { user: currentUser } = useAuth();
  const {
    currentPost,
    fetchOotdPostById,
    addComment,
    isLoading: isStoreLoading, // 스토어 전체 로딩 상태
  } = useOotdStore((state) => ({
    currentPost: state.posts.find(p => p._id === postId) || state.topPosts.find(p => p._id === postId) || state.currentPost, // Ensure we look in all relevant post arrays
    fetchOotdPostById: state.fetchOotdPostById,
    addComment: state.addComment,
    isLoading: state.isLoading,
  }));

  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentsToShow, setCommentsToShow] = useState<IComment[]>([]);

  useEffect(() => {
    if (postId && open) {
      // 모달이 열릴 때, currentPost에 댓글이 없거나 다른 포스트이면 새로 가져옴
      if (!currentPost || currentPost._id !== postId || !currentPost.comments) {
         fetchOotdPostById(postId); // 상세 정보 가져와서 댓글 포함시키기
      }
    }
  }, [postId, open, fetchOotdPostById, currentPost]);

 useEffect(() => {
    if (currentPost && currentPost._id === postId) {
      setCommentsToShow(currentPost.comments || []);
    }
  }, [currentPost, postId]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !postId || !currentUser) return;
    setIsSubmitting(true);
    const submittedComment = await addComment(postId, newComment);
    if (submittedComment) {
      setNewComment('');
      // 스토어에서 currentPost가 업데이트되면 useEffect를 통해 commentsToShow도 업데이트됨
    }
    setIsSubmitting(false);
  };
  
  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
    const minutes = Math.round(seconds / 60);
    // ... (OotdPostCard의 timeAgo와 동일)
    if (seconds < 60) return `${seconds}초 전`;
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.round(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.round(hours / 24);
    return `${days}일 전`;
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="comment-modal-title"
      aria-describedby="comment-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="comment-modal-title" variant="h6" component="h2">
            댓글
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        
        {isStoreLoading && (!commentsToShow || commentsToShow.length === 0) && <CircularProgress sx={{my: 2, alignSelf: 'center'}}/>}
        {!isStoreLoading && (!commentsToShow || commentsToShow.length === 0) && (
          <Typography sx={{ my: 2, textAlign: 'center', color: 'text.secondary' }}>아직 댓글이 없습니다.</Typography>
        )}

        {commentsToShow && commentsToShow.length > 0 && (
          <List sx={{ overflowY: 'auto', maxHeight: 'calc(80vh - 200px)', flexGrow: 1, pr: 1, mb: 2 }}>
            {commentsToShow.map((comment) => (
              <React.Fragment key={comment._id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar alt={comment.user.nickname} src={comment.user.profileImage || 'https://placehold.co/40x40'} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.user.nickname}
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {comment.content}
                        </Typography>
                        <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                          {timeAgo(comment.createdAt)}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        )}

        {currentUser && (
          <Box mt="auto">
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="따뜻한 댓글을 남겨주세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isSubmitting}
              sx={{ mb: 1.5 }}
            />
            <Button 
              fullWidth 
              variant="contained" 
              color="primary" 
              onClick={handleCommentSubmit} 
              disabled={isSubmitting || !newComment.trim()}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : '댓글 등록'}
            </Button>
          </Box>
        )}
        {!currentUser && (
            <Typography sx={{ mt: 2, textAlign: 'center', color: 'text.secondary' }}>
                댓글을 작성하려면 로그인해주세요.
            </Typography>
        )}
      </Box>
    </Modal>
  );
};

export default OotdCommentModal; 