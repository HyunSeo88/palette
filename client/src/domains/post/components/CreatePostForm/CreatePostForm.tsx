import React, { useState, useEffect, ChangeEvent } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  CircularProgress,
  Alert,
  Grid,
  FormHelperText,
  IconButton as MuiIconButton,
  Paper,
} from '@mui/material';
import { X as XIcon } from 'react-feather';
import { ICreatePostFormValues, POST_TYPE_OPTIONS, PostType } from '../../types/post.types';
import { ApiError } from '../../services/post.service';
import { getTokens } from '../../../../utils/tokenUtils';
import { useNavigate } from 'react-router-dom';

interface CreatePostFormInputs extends Omit<ICreatePostFormValues, 'images'> {}

const CreatePostForm: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [imageValidationError, setImageValidationError] = useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<CreatePostFormInputs>({
    defaultValues: {
      postType: 'fashion',
      title: '',
      content: '',
      tags: '',
      additionalFields: {
        style: '',
        season: '',
      },
    },
  });

  const watchedPostType = watch('postType');

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    setImageValidationError(null);
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      const combinedFiles = [...selectedFiles, ...newFiles].slice(0, 5);
      setSelectedFiles(combinedFiles);

      const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
      setImagePreviews(newPreviews);

      if (watchedPostType === 'ootd' && combinedFiles.length === 0) {
        setImageValidationError('OOTD 게시물에는 최소 하나의 이미지가 필요합니다.');
      }
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newSelectedFiles = selectedFiles.filter((_, index) => index !== indexToRemove);
    setSelectedFiles(newSelectedFiles);
    
    setImagePreviews(prevPreviews => {
      const newPreviews = prevPreviews.filter((_, index) => index !== indexToRemove);
      URL.revokeObjectURL(prevPreviews[indexToRemove]);
      return newPreviews;
    });

    if (watchedPostType === 'ootd' && newSelectedFiles.length === 0) {
        setImageValidationError('OOTD 게시물에는 최소 하나의 이미지가 필요합니다.');
    } else {
        setImageValidationError(null);
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  useEffect(() => {
    if (watchedPostType === 'ootd' && selectedFiles.length === 0) {
      setImageValidationError('OOTD 게시물에는 최소 하나의 이미지가 필요합니다.');
    } else {
      setImageValidationError(null);
    }
  }, [watchedPostType, selectedFiles]);

  const onSubmit: SubmitHandler<CreatePostFormInputs> = async (data) => {
    const { accessToken } = getTokens();
    if (!accessToken) {
      setServerError('Authentication token not found. Please log in again.');
      return;
    }

    if (watchedPostType === 'ootd' && selectedFiles.length === 0) {
      setImageValidationError('OOTD 게시물에는 최소 하나의 이미지가 필요합니다.');
      return;
    }

    setIsLoading(true);
    setServerError(null);
    setFieldErrors({});

    const formData = new FormData();
    formData.append('postType', data.postType);
    formData.append('title', data.title);
    formData.append('content', data.content);
    
    if (data.tags && data.tags.trim() !== '') {
      const tagArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      tagArray.forEach(tag => {
        formData.append('tags', tag);
      });
    }

    selectedFiles.forEach(file => {
      formData.append('images', file);
    });

    if (data.additionalFields) {
      if (data.additionalFields.style && data.additionalFields.style.trim() !== '') {
        formData.append('additionalFields[style]', data.additionalFields.style);
      }
      if (data.additionalFields.season && data.additionalFields.season.trim() !== '') {
        formData.append('additionalFields[season]', data.additionalFields.season);
      }
    }
    
    const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

    try {
      const response = await fetch(`${API_BASE_URL}/api/posts`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData: ApiError = await response.json().catch(() => ({
            message: `HTTP error! status: ${response.status} - Unable to parse error JSON`,
        }));
        throw errorData;
      }

      const newPost = await response.json();
      console.log('Post created successfully:', newPost);
      reset();
      setSelectedFiles([]);
      setImagePreviews([]);
      setImageValidationError(null);
      navigate('/');
      alert('게시물이 성공적으로 작성되었습니다!');
    } catch (error) {
      const apiError = error as ApiError;
      console.error('Failed to create post:', apiError);
      let generalError = '게시물 작성에 실패했습니다. 잠시 후 다시 시도해주세요.';
      if (apiError.errors && apiError.errors.length > 0) {
        const newFieldErrors: Record<string, string> = {};
        let specificMessages = '';
        apiError.errors.forEach(err => {
          if (err.param && err.param !== 'images') {
            newFieldErrors[err.param] = err.msg;
          } else if (err.param === 'images') {
            setImageValidationError(err.msg);
          } else {
            specificMessages += `${err.msg} `;
          }
        });
        setFieldErrors(newFieldErrors);
        if (specificMessages) generalError = specificMessages.trim();
        else if (Object.keys(newFieldErrors).length > 0 || imageValidationError) generalError = '입력 값을 확인해주세요.';
      } else if (apiError.message) {
        generalError = apiError.message;
      }
      setServerError(generalError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={3}>
        {serverError && (
          <Grid item xs={12}>
            <Alert severity="error">{serverError}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom sx={{ mb: 1 }}>
            이미지 (최대 5개)
          </Typography>
          <Button variant="outlined" component="label" fullWidth>
            이미지 선택
            <input type="file" multiple accept="image/*" hidden onChange={handleFileSelect} />
          </Button>
          {imageValidationError && (
             <FormHelperText error sx={{ mt:1 }}>{imageValidationError}</FormHelperText>
          )}
          {imagePreviews.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {imagePreviews.map((previewUrl, index) => (
                <Paper 
                  key={index} 
                  elevation={2} 
                  sx={{ 
                    position: 'relative', 
                    width: 120, 
                    height: 120, 
                    overflow: 'hidden',
                    borderRadius: '8px'
                  }}
                >
                  <img 
                    src={previewUrl} 
                    alt={`preview ${index + 1}`} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <MuiIconButton 
                    size="small"
                    onClick={() => handleRemoveImage(index)}
                    sx={{
                      position: 'absolute',
                      top: 4,
                      right: 4,
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      }
                    }}
                  >
                    <XIcon size={16} />
                  </MuiIconButton>
                </Paper>
              ))}
            </Box>
          )}
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="postType"
            control={control}
            rules={{ required: '게시물 유형을 선택해주세요.' }}
            render={({ field }) => (
              <FormControl fullWidth error={!!errors.postType || !!fieldErrors.postType}>
                <InputLabel id="postType-label">게시물 유형</InputLabel>
                <Select labelId="postType-label" label="게시물 유형" {...field}>
                  {POST_TYPE_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {(errors.postType || fieldErrors.postType) && (
                  <FormHelperText>{errors.postType?.message || fieldErrors.postType}</FormHelperText>
                )}
              </FormControl>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="title"
            control={control}
            rules={{
              required: '제목을 입력해주세요.',
              maxLength: { value: 200, message: '제목은 200자를 넘을 수 없습니다.' },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="제목"
                fullWidth
                error={!!errors.title || !!fieldErrors.title}
                helperText={errors.title?.message || fieldErrors.title}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="content"
            control={control}
            rules={{
              required: '내용을 입력해주세요.',
              maxLength: watchedPostType === 'ootd' ? 
                { value: 500, message: 'OOTD 게시물의 내용은 500자를 넘을 수 없습니다.' } : undefined,
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="내용"
                fullWidth
                multiline
                rows={6}
                error={!!errors.content || !!fieldErrors.content}
                helperText={errors.content?.message || fieldErrors.content}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="tags"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="태그 (쉼표로 구분)"
                fullWidth
                error={!!errors.tags || !!fieldErrors.tags}
                helperText={errors.tags?.message || fieldErrors.tags}
              />
            )}
          />
        </Grid>

        {watchedPostType === 'ootd' && (
          <>
            <Grid item xs={12} sm={6}>
              <Controller
                name="additionalFields.style"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="스타일 (OOTD)"
                    fullWidth
                    error={!!errors.additionalFields?.style || !!fieldErrors['additionalFields.style']}
                    helperText={errors.additionalFields?.style?.message || fieldErrors['additionalFields.style']}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="additionalFields.season"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="계절 (OOTD)"
                    fullWidth
                    error={!!errors.additionalFields?.season || !!fieldErrors['additionalFields.season']}
                    helperText={errors.additionalFields?.season?.message || fieldErrors['additionalFields.season']}
                  />
                )}
              />
            </Grid>
          </>
        )}

        <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
          <Button type="submit" variant="contained" color="primary" disabled={isLoading} size="large">
            {isLoading ? <CircularProgress size={24} color="inherit" /> : '게시물 작성'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CreatePostForm; 