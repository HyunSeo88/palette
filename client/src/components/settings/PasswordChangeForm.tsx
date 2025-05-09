import React, { useState } from 'react';
import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { z } from 'zod'; // Zod를 사용하여 스키마 기반 유효성 검사

// Zod 스키마 정의
const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "현재 비밀번호를 입력해주세요."),
  newPassword: z.string()
    .min(8, "새 비밀번호는 최소 8자 이상이어야 합니다.")
    .regex(/[A-Z]/, "새 비밀번호는 대문자를 포함해야 합니다.")
    .regex(/[a-z]/, "새 비밀번호는 소문자를 포함해야 합니다.")
    .regex(/[0-9]/, "새 비밀번호는 숫자를 포함해야 합니다.")
    .regex(/[^A-Za-z0-9]/, "새 비밀번호는 특수문자를 포함해야 합니다."),
  confirmNewPassword: z.string().min(1, "새 비밀번호 확인을 입력해주세요."),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "새 비밀번호가 일치하지 않습니다.",
  path: ["confirmNewPassword"], // 오류가 발생한 필드를 명시
});

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

const PasswordChangeForm: React.FC = () => {
  const { updatePassword, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState<PasswordChangeFormData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof PasswordChangeFormData | '_form', string>>>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // 입력 변경 시 해당 필드 에러 초기화
    if (errors[e.target.name as keyof PasswordChangeFormData]) {
      setErrors({ ...errors, [e.target.name as keyof PasswordChangeFormData]: undefined });
    }
    if (errors._form) {
        setErrors({ ...errors, _form: undefined });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage(null);

    const validationResult = passwordChangeSchema.safeParse(formData);
    if (!validationResult.success) {
      const newErrors: Partial<Record<keyof PasswordChangeFormData, string>> = {};
      validationResult.error.errors.forEach(err => {
        if (err.path.length > 0) {
          newErrors[err.path[0] as keyof PasswordChangeFormData] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await updatePassword(formData.currentPassword, formData.newPassword);
      if (success) {
        setSuccessMessage('비밀번호가 성공적으로 변경되었습니다.');
        setFormData({ currentPassword: '', newPassword: '', confirmNewPassword: '' }); // 폼 초기화
      } else {
        // updatePassword 함수가 false를 반환했지만 구체적인 에러 메시지가 AuthContext에서 설정되지 않은 경우
        setErrors({ _form: '비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.' });
      }
    } catch (err: any) {
      // AuthContext의 updatePassword에서 throw new Error(message)로 에러를 던진 경우
      setErrors({ _form: err.message || '비밀번호 변경 중 오류가 발생했습니다.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        비밀번호 변경
      </Typography>
      {errors._form && <Alert severity="error" sx={{ mb: 2 }}>{errors._form}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
      
      <TextField
        type="password"
        name="currentPassword"
        label="현재 비밀번호"
        variant="outlined"
        fullWidth
        value={formData.currentPassword}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
        error={!!errors.currentPassword}
        helperText={errors.currentPassword}
        disabled={authLoading}
      />
      <TextField
        type="password"
        name="newPassword"
        label="새 비밀번호"
        variant="outlined"
        fullWidth
        value={formData.newPassword}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
        error={!!errors.newPassword}
        helperText={errors.newPassword}
        disabled={authLoading}
      />
      <TextField
        type="password"
        name="confirmNewPassword"
        label="새 비밀번호 확인"
        variant="outlined"
        fullWidth
        value={formData.confirmNewPassword}
        onChange={handleChange}
        sx={{ mb: 2 }}
        required
        error={!!errors.confirmNewPassword}
        helperText={errors.confirmNewPassword}
        disabled={authLoading}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={isSubmitting || authLoading}
        fullWidth
      >
        {isSubmitting ? <CircularProgress size={24} /> : '비밀번호 변경'}
      </Button>
    </Box>
  );
};

export default PasswordChangeForm; 