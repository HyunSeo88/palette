import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, CircularProgress, Divider, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useOotdStore } from '../stores/useOotdStore';
import { IOotdPost, IClothingItem } from '../types/ootd.types';

interface OotdInfoModalProps {
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

const OotdInfoModal: React.FC<OotdInfoModalProps> = ({ open, onClose, postId }) => {
  const {
    currentPost,
    fetchOotdPostById,
    isLoading: isStoreLoading,
  } = useOotdStore((state) => ({
    currentPost: state.posts.find(p => p._id === postId) || 
                 state.topPosts.find(p => p._id === postId) || 
                 (state.currentPost?._id === postId ? state.currentPost : null),
    fetchOotdPostById: state.fetchOotdPostById,
    isLoading: state.isLoading,
  }));

  const [clothingItems, setClothingItems] = useState<IClothingItem[]>([]);

  useEffect(() => {
    if (postId && open) {
      if (!currentPost || currentPost._id !== postId || !currentPost.additionalFields?.clothingInfo) {
        fetchOotdPostById(postId);
      }
    }
  }, [postId, open, fetchOotdPostById, currentPost]);

  useEffect(() => {
    if (currentPost && currentPost._id === postId && currentPost.additionalFields?.clothingInfo) {
      setClothingItems(currentPost.additionalFields.clothingInfo);
    } else if (open && postId && !isStoreLoading && (!currentPost || currentPost._id !== postId)){
      setClothingItems([]);
    }
  }, [currentPost, postId, open, isStoreLoading]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="info-modal-title"
      aria-describedby="info-modal-description"
    >
      <Box sx={style}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography id="info-modal-title" variant="h6" component="h2">
            착용 의상 정보
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        {isStoreLoading && clothingItems.length === 0 && <CircularProgress sx={{my: 2, alignSelf: 'center'}}/>}
        {!isStoreLoading && clothingItems.length === 0 && (
          <Typography sx={{ my: 2, textAlign: 'center', color: 'text.secondary' }}>등록된 의상 정보가 없습니다.</Typography>
        )}

        {clothingItems.length > 0 && (
          <List sx={{ overflowY: 'auto', maxHeight: 'calc(80vh - 120px)', flexGrow: 1, pr: 1 }}>
            {clothingItems.map((item: IClothingItem, index: number) => (
              <React.Fragment key={index}>
                <ListItem disablePadding>
                  <ListItemText
                    primaryTypographyProps={{ fontWeight: '600', color: 'text.primary' }}
                    primary={`${item.item} - ${item.brand}`}
                    secondary={item.details}
                    secondaryTypographyProps={{ color: 'text.secondary' }}
                  />
                </ListItem>
                {index < clothingItems.length - 1 && <Divider sx={{ my: 1 }} />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Box>
    </Modal>
  );
};

export default OotdInfoModal; 