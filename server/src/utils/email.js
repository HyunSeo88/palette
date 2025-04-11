const nodemailer = require('nodemailer');

// 이메일 전송을 위한 transporter 설정
const createTransporter = () => {
  // Log environment variables being used
  console.log('[createTransporter] Using email config:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT === '465', // Infer secure based on port
    user: process.env.EMAIL_USER ? '******' : 'undefined', // Don't log password itself
    pass_set: !!process.env.EMAIL_PASS
  });

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '465', 10), // Ensure port is a number
    secure: process.env.EMAIL_PORT === '465', // Use true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Verify transporter configuration
  transporter.verify(function(error, success) {
    if (error) {
      console.error('Transporter verification failed:', error);
    } else {
      console.log('Transporter is ready to send emails');
    }
  });

  return transporter;
};

/**
 * 이메일 발송 함수
 * @param {Object} options - 이메일 옵션
 * @param {string} options.to - 수신자 이메일
 * @param {string} options.subject - 이메일 제목
 * @param {string} options.html - 이메일 HTML 내용
 * @returns {Promise<void>}
 */
const sendEmail = async (options) => {
  try {
    const transporter = createTransporter();
    
    const message = {
      from: process.env.EMAIL_FROM || 'Palette <noreply@palette.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    console.log('Attempting to send email with config:', {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      user: process.env.EMAIL_USER,
      from: process.env.EMAIL_FROM
    });

    const info = await transporter.sendMail(message);
    console.log('Email sent successfully:', info.messageId);
  } catch (error) {
    console.error('Detailed email sending error:', error);
    throw new Error(`이메일 발송에 실패했습니다: ${error.message}`);
  }
};

/**
 * 이메일 인증 메일 발송 함수
 * @param {string} email - 수신자 이메일
 * @param {string} verificationUrl - 인증 URL
 * @returns {Promise<void>}
 */
const sendVerificationEmail = async (email, verificationUrl) => {
  const html = `
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: #333; text-align: center;">Palette 이메일 인증</h2>
      <p style="color: #666;">안녕하세요! Palette 회원가입을 환영합니다.</p>
      <p style="color: #666;">아래 버튼을 클릭하여 이메일 인증을 완료해주세요:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${verificationUrl}" 
           style="background-color: #4CAF50; color: white; padding: 14px 28px; 
                  text-decoration: none; border-radius: 4px; display: inline-block;">
          이메일 인증하기
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">버튼이 작동하지 않는 경우, 아래 링크를 브라우저에 복사하여 접속해주세요:</p>
      <p style="color: #666; font-size: 14px; word-break: break-all;">${verificationUrl}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
      <p style="color: #999; font-size: 12px; text-align: center;">
        본 메일은 발신 전용입니다. 문의사항이 있으시면 고객센터를 이용해주세요.
      </p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Palette 이메일 인증',
    html,
  });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
}; 