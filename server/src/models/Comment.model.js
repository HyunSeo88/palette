const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post',
        required: [true, 'Post ID is required for a comment.'],
        index: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required for a comment.'],
    },
    content: {
        type: String,
        required: [true, 'Comment content cannot be empty.'],
        trim: true,
        maxlength: [1000, 'Comment content cannot be more than 1000 characters.'],
    },
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null, // null이면 최상위 댓글, ObjectId면 대댓글
        index: true,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    isDeleted: { // 소프트 삭제 지원
        type: Boolean,
        default: false,
        index: true,
    },
    // 대댓글이 있는 경우, 효율적인 UI 렌더링 및 추가 로딩을 위해 대댓글 수를 저장할 수 있습니다.
    // 또는 children 필드를 직접 두어 populate 할 수도 있습니다. 여기서는 count로 관리합니다.
    childrenCount: {
        type: Number,
        default: 0,
        min: 0
    }
    // 만약 대댓글을 직접 children으로 관리한다면:
    // children: [{
    //    type: Schema.Types.ObjectId,
    //    ref: 'Comment'
    // }]
}, {
    timestamps: true,
    collection: 'comments',
});

// 특정 게시물의 댓글들을 가져올 때 사용할 인덱스
commentSchema.index({ post: 1, parentComment: 1, createdAt: 1 }); // 게시물별, 부모댓글별 정렬
commentSchema.index({ post: 1, createdAt: 1 }); // 게시물별 최신순 정렬 (최상위 댓글용)

// 사용자가 작성한 댓글을 찾기 위한 인덱스
commentSchema.index({ user: 1, createdAt: -1 });

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment; 