# Palette - Fashion Community Platform

**Palette는 패션에 대한 열정을 가진 사람들이 모여 영감을 공유하고, 최신 트렌드를 발견하며, 자신만의 스타일을 표현할 수 있는 활기찬 커뮤니티 플랫폼입니다.** 사용자는 자신의 OOTD(Outfit Of The Day)를 게시하고, 다른 사용자의 스타일에 반응하며, 패션 관련 이벤트 및 토론에 참여할 수 있습니다.

## 🚀 개발 진행상황 (Development Status)

### 완료된 기능 (Completed Features)

#### 1. 메인 레이아웃 (Main Layout)
- ✅ 반응형 레이아웃 구현
- ✅ 좌측 패널 구현 (프로필, 메뉴, 커뮤니티 통계)
- ✅ 스크롤 연동 배경색 전환 효과
- ✅ 모바일 대응 레이아웃
    
#### 2. 커뮤니티 피드 (Community Feed)
- ✅ OOTD 그리드 레이아웃
- ✅ 인기 게시물 섹션
- ✅ 이벤트 섹션
- ✅ 좋아요/댓글 수 표시
- ✅ 작성자 정보 표시
- ✅ 섹션 구분선

#### 3. 컴포넌트 모듈화 (Component Modularization)
- ✅ PostMetrics 컴포넌트
- ✅ AuthorInfo 컴포넌트
- ✅ FeedSection 컴포넌트
- ✅ 스타일 컴포넌트 분리

### 🌟 주요 기능 (Key Features) - *New Section*
- **OOTD 피드**: 사용자들이 자신의 데일리룩을 사진과 함께 공유합니다.
- **인기 게시물**: 좋아요와 댓글을 기반으로 인기 있는 게시물을 보여줍니다.
- **이벤트 정보**: 패션 관련 이벤트 및 프로모션을 확인할 수 있습니다.
- **반응형 디자인**: 데스크톱, 태블릿, 모바일 등 다양한 기기에서 최적의 사용 경험을 제공합니다.
- **사용자 프로필**: (예정) 각자의 스타일과 활동을 보여주는 개인 페이지입니다.
- **커뮤니티 상호작용**: (진행중) 좋아요, 댓글, 북마크 기능을 통해 사용자 간 소통을 지원합니다.

### 진행 중인 작업 (In Progress)
- 🔄 사용자 인터랙션 기능 (좋아요, 북마크 등)
- 🔄 데이터 연동 준비
- 🔄 성능 최적화

### 예정된 작업 (Planned)
- ⭕ 댓글 시스템 구현
- ⭕ 사용자 프로필 페이지
- ⭕ 검색 기능
- ⭕ 알림 시스템

자세한 작업 계획은 [next-tasks.md](./docs/next-tasks.md)를 참조해주세요.

## 🛠 기술 스택 (Tech Stack)

- **Frontend**: React
- **UI Library**: Material-UI (MUI)
- **Animation**: Framer Motion
- **Styling**: Styled Components & MUI Styled Engine
- **Icons**: React Feather
- **Backend**: Node.js, Express (예상, `docs/tech-stack.md`에 명시 필요)
- **Database**: MongoDB (예상, `docs/tech-stack.md`에 명시 필요)

*참고: 전체 기술 스택은 `docs/tech-stack.md` 파일에 최신 상태로 유지됩니다.*

## 📦 설치 및 실행 (Installation & Running)

**요구 사항:**
- Node.js (버전 명시 권장, 예: v18.x 이상)
- npm 또는 yarn
- MongoDB (현재 로컬 개발 환경에 연결되어 있습니다.)

```bash
# 1. 프로젝트 클론
git clone [repository-url]
cd palette

# 2. 클라이언트 (Frontend) 설정 및 실행
cd client
npm install
npm start # 또는 yarn start

# 3. 서버 (Backend) 설정 및 실행
# (별도의 터미널에서 실행)
cd ../server 
npm install
npm run dev # 또는 해당 스크립트 (예: node server.js)
```

**중요 참고 사항:**
*   현재 백엔드 서버는 개발자의 로컬 MongoDB 인스턴스와 연결되도록 설정되어 있습니다.
*   프론트엔드와 백엔드를 서로 다른 PC 또는 환경에서 실행하려면, 각 환경에 Node.js를 설치하고 백엔드 서버가 접근할 수 있는 MongoDB 데이터베이스를 별도로 설정해야 합니다. 현재 구성으로는 다른 환경에서 데이터베이스 연동이 원활하지 않을 수 있습니다. 이 부분은 추후 외부 DB 연결 또는 Docker 설정 등을 통해 개선될 예정입니다.

## 🌐 프로젝트 구조 (Project Structure)

자세한 프로젝트 구조는 [PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)를 참조해주세요.

## 🤝 기여 (Contributing)

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스 (License)

MIT License - 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요. 
