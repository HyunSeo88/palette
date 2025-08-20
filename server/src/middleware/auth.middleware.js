const jwt = require('jsonwebtoken');
const User = require('../models/User'); // 실제 User 모델 경로 확인 필요

/**
 * @description Authenticates user token and attaches user to request object.
 * Assumes JWT is sent in the Authorization header as 'Bearer TOKEN'.
 */
const authMiddleware = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (e.g., "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token (assuming token payload has id)
            // req.user = await User.findById(decoded.id).select('-password'); // -password 제외
            // 위 User.findById는 DB 조회로 인해 매 요청마다 오버헤드가 있을 수 있습니다.
            // 토큰 payload에 필요한 최소한의 정보(id, role 등)를 포함하고 그것을 사용하는 것이 더 효율적일 수 있습니다.
            // 예시: req.user = { id: decoded.id, role: decoded.role }; (토큰 생성 시 role도 포함했다고 가정)
            
            if (!decoded.id) { // 토큰 payload에 id가 없는 경우
                 return res.status(401).json({ message: 'Not authorized, token payload invalid.' });
            }

            // 여기서는 토큰 payload에 id와 role이 있다고 가정하고 req.user에 직접 할당합니다.
            // 실제 User 모델을 조회하여 최신 사용자 정보를 가져오려면 위 주석 처리된 User.findById 코드를 사용하세요.
            req.user = {
                id: decoded.id,
                role: decoded.role || 'user' // 토큰에 role이 없다면 기본값 'user'
            };

            if (!req.user) {
                return res.status(401).json({ message: 'Not authorized, user not found for token.' });
            }

            next();
        } catch (error) {
            console.error('Token verification error:', error.message);
            // 토큰 만료, 잘못된 토큰 등의 오류 처리
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({ message: 'Not authorized, token expired.' });
            }
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        // 토큰이 없는 경우, 특정 라우트는 공개 접근일 수 있으므로 여기서 바로 에러를 반환하지 않을 수도 있습니다.
        // 하지만 이 미들웨어가 적용된 라우트는 인증이 필수이므로, 토큰이 없으면 인증 실패로 간주합니다.
        // 특정 API에 따라 선택적으로 인증을 적용하려면, 라우트 정의 시 이 미들웨어를 조건부로 사용해야 합니다.
        // 현재는 이 미들웨어가 사용된 모든 라우트에서 인증을 요구한다고 가정합니다.
        // 단, createPost 등 컨트롤러에서 req.user를 확인하므로, 여기서 401을 던지지 않아도 컨트롤러에서 처리될 수 있습니다.
        // 명시적으로 하려면 아래 주석 해제:
        // return res.status(401).json({ message: 'Not authorized, no token provided.' });
        
        // 임시 플레이스홀더 (x-simulated-user-id) 로직은 여기서 제거합니다.
        // 실제 인증을 사용하므로, 시뮬레이션 헤더는 더 이상 유효하지 않습니다.
        // 만약 토큰 없이도 통과시켜야 하는 경우가 있다면(예: optional authentication),
        // 이 미들웨어의 로직을 수정하거나, 라우트별로 다르게 적용해야 합니다.
        // 여기서는 토큰이 없으면 req.user가 설정되지 않고 next()로 넘어갑니다.
        // 그러면 각 컨트롤러에서 if (!req.user) 체크를 통해 인증 여부를 판단합니다.
        // 또는, 여기서 명시적으로 에러를 반환할 수도 있습니다.
        // 보다 엄격하게 하려면 토큰 없는 경우 바로 401 반환:
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = authMiddleware; 