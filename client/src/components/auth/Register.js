import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const StyledForm = styled('form')(({ theme }) => ({
  width: '100%',
  marginTop: theme.spacing(1),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(3, 0, 2),
}));

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    colorVisionType: '',
    bio: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
      newErrors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      newErrors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    } else if (!/[\W]/.test(formData.password)) {
      newErrors.password = '비밀번호는 최소 1개의 특수문자를 포함해야 합니다.';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }

    if (!formData.nickname) {
      newErrors.nickname = '닉네임을 입력해주세요.';
    } else if (formData.nickname.length < 2 || formData.nickname.length > 20) {
      newErrors.nickname = '닉네임은 2-20자 사이여야 합니다.';
    }

    if (!formData.colorVisionType) {
      newErrors.colorVisionType = '색각 유형을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
        colorVisionType: formData.colorVisionType,
        bio: formData.bio
      });

      if (response.data.success) {
        // 토큰을 로컬 스토리지에 저장
        localStorage.setItem('token', response.data.token);
        // 홈페이지로 이동
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({
          ...errors,
          submit: error.response.data.message
        });
      } else {
        setErrors({
          ...errors,
          submit: '회원가입 중 오류가 발생했습니다.'
        });
      }
    }
  };

  return (
    <FormContainer component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        회원가입
      </Typography>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="이메일"
          name="email"
          autoComplete="email"
          autoFocus
          value={formData.email}
          onChange={handleChange}
          error={!!errors.email}
          helperText={errors.email}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="비밀번호"
          type="password"
          id="password"
          autoComplete="new-password"
          value={formData.password}
          onChange={handleChange}
          error={!!errors.password}
          helperText={errors.password}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="비밀번호 확인"
          type="password"
          id="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="nickname"
          label="닉네임"
          id="nickname"
          value={formData.nickname}
          onChange={handleChange}
          error={!!errors.nickname}
          helperText={errors.nickname}
        />
        <FormControl 
          fullWidth 
          margin="normal"
          error={!!errors.colorVisionType}
        >
          <InputLabel id="colorVisionType-label">색각 유형</InputLabel>
          <Select
            labelId="colorVisionType-label"
            id="colorVisionType"
            name="colorVisionType"
            value={formData.colorVisionType}
            onChange={handleChange}
            label="색각 유형"
          >
            <MenuItem value="normal">정상</MenuItem>
            <MenuItem value="protanopia">제1색맹</MenuItem>
            <MenuItem value="deuteranopia">제2색맹</MenuItem>
            <MenuItem value="tritanopia">제3색맹</MenuItem>
            <MenuItem value="colorWeak">색약</MenuItem>
          </Select>
          {errors.colorVisionType && (
            <FormHelperText>{errors.colorVisionType}</FormHelperText>
          )}
        </FormControl>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          name="bio"
          label="자기소개"
          id="bio"
          multiline
          rows={4}
          value={formData.bio}
          onChange={handleChange}
        />
        {errors.submit && (
          <Typography color="error" variant="body2" align="center">
            {errors.submit}
          </Typography>
        )}
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          회원가입
        </SubmitButton>
      </StyledForm>
    </FormContainer>
  );
};

export default Register;