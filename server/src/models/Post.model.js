const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User is required.'],
    },
    postType: {
        type: String,
        enum: ['fashion', 'free', 'qna', 'market', 'groupbuy', 'ootd'], // 예시 유형, 필요에 따라 추가/수정
        required: [true, 'Post type is required.'],
        index: true,
    },
    title: {
        type: String,
        required: [true, 'Title is required.'],
        trim: true,
        maxlength: [200, 'Title cannot be more than 200 characters.'],
    },
    content: {
        type: String,
        required: [true, 'Content is required.'],
    },
    images: {
        type: [String], // Array of image URLs
        default: [],
    },
    tags: {
        type: [String],
        trim: true,
        default: [],
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    // 댓글은 Comment 모델에서 post 필드를 통해 이 Post를 참조하도록 하고,
    // 여기서는 댓글 수를 저장하거나, populate를 위해 Comment 모델 배열을 참조할 수 있습니다.
    // 사용자 요청에 따라 Comment 모델 배열을 직접 참조합니다.
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment',
    }],
    commentsCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    viewCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    isPinned: {
        type: Boolean,
        default: false,
        index: true,
    },
    status: {
        type: String,
        enum: ['published', 'draft', 'pending_review', 'deleted', 'archived'],
        default: 'published',
        index: true,
    },
    additionalFields: {
        type: Schema.Types.Mixed, // 유연한 필드, 유형별 특정 데이터 저장
        default: {},
    },
    // 예시: 패션 게시글의 경우 additionalFields에 포함될 수 있는 내용
    // style: String, (additionalFields.style)
    // season: String, (additionalFields.season)
    // items: [{ category: String, brand: String, name: String, link: String }] (additionalFields.items)

    // 예시: 투표 게시글의 경우 additionalFields에 포함될 수 있는 내용
    // pollOptions: [{ optionText: String, votes: Number }], (additionalFields.pollOptions)
    // pollEndDate: Date (additionalFields.pollEndDate)
}, {
    timestamps: true, // createdAt, updatedAt 자동 생성
    collection: 'posts',
});

// 검색을 위한 텍스트 인덱스 (제목, 내용, 태그)
postSchema.index({ title: 'text', content: 'text', tags: 'text' });

// 자주 사용될 필드에 대한 복합 인덱스
postSchema.index({ postType: 1, status: 1, createdAt: -1 }); // 유형별, 상태별 최신순 정렬
postSchema.index({ user: 1, status: 1, createdAt: -1 });    // 사용자별, 상태별 최신순 정렬
postSchema.index({ isPinned: -1, createdAt: -1 });        // 공지사항 정렬

const Post = mongoose.model('Post', postSchema);

module.exports = Post; 