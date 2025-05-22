const Comment = require('../models/Comment.model');
const Post = require('../models/Post.model');
const User = require('../models/User'); // User 모델의 실제 경로에 맞게 수정 필요

// @desc    Create a new comment on a post
// @route   POST /api/posts/:postId/comments
// @access  Private (User must be logged in)
async function createComment(req, res, next) {
    try {
        const { postId } = req.params;
        const { content, parentCommentId } = req.body; // parentCommentId는 대댓글일 경우 제공됨
        const userId = req.user.id; // authMiddleware에서 설정된 사용자 ID

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Cannot create comment.' });
        }

        if (!content) {
            return res.status(400).json({ message: 'Comment content is required.' });
        }

        // 1. 해당 게시물이 존재하는지 확인
        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ message: 'Post not found. Cannot add comment.' });
        }

        // 2. (대댓글의 경우) 부모 댓글이 존재하는지, 그리고 같은 게시물에 속하는지 확인
        let parentComment = null;
        if (parentCommentId) {
            parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ message: 'Parent comment not found.' });
            }
            if (parentComment.post.toString() !== postId) {
                return res.status(400).json({ message: 'Parent comment does not belong to this post.' });
            }
            // 대댓글의 깊이 제한 로직 추가 가능 (예: 부모 댓글이 이미 대댓글이면 더 이상 대댓글 불가 등)
        }

        // 3. 새 댓글 생성
        const newComment = new Comment({
            post: postId,
            user: userId,
            content,
            parentComment: parentCommentId || null, // parentCommentId가 없으면 null (최상위 댓글)
        });

        const savedComment = await newComment.save();

        // 4. Post 모델의 comments 배열에 새 댓글 ID 추가 및 commentsCount 업데이트
        postExists.comments.push(savedComment._id);
        postExists.commentsCount = (postExists.commentsCount || 0) + 1;
        await postExists.save();

        // 5. (대댓글의 경우) 부모 댓글의 childrenCount 업데이트
        if (parentComment) {
            parentComment.childrenCount = (parentComment.childrenCount || 0) + 1;
            await parentComment.save();
        }
        
        // 6. 생성된 댓글 정보 반환 (작성자 정보 populate)
        const populatedComment = await Comment.findById(savedComment._id)
                                            .populate('user', 'nickname profileImage email');

        res.status(201).json(populatedComment);

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Post ID, User ID, or Parent Comment ID format.' });
        }
        next(error);
    }
}

// @desc    Get all comments for a specific post (top-level comments first)
// @route   GET /api/posts/:postId/comments
// @access  Public
async function getCommentsByPostId(req, res, next) {
    try {
        const { postId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt_asc' } = req.query; // 댓글은 보통 오래된 순 또는 최신순

        // 1. 해당 게시물이 존재하는지 확인 (선택 사항이지만, 댓글 없는 게시물에 대한 요청 방지 가능)
        const postExists = await Post.findById(postId);
        if (!postExists) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const query = {
            post: postId,
            isDeleted: false, // 삭제되지 않은 댓글만
            parentComment: null, // 최상위 댓글만 우선 조회 (대댓글은 필요시 클라이언트가 추가 요청 또는 서버에서 2단계 populate)
        };

        const sortOptions = {};
        if (sortBy) {
            const parts = sortBy.split('_');
            const field = parts[0];
            const order = parts[1] === 'desc' ? -1 : 1;
            sortOptions[field] = order;
        }

        const comments = await Comment.find(query)
            .populate('user', 'nickname profileImage email') // 댓글 작성자 정보
            // .populate({ // 만약 대댓글도 한 번에 가져오고 싶다면 (계층 구조)
            //     path: 'children', // Comment 모델에 children: [Schema.Types.ObjectId] 필드가 있다고 가정
            //     match: { isDeleted: false },
            //     populate: { path: 'user', select: 'nickname profileImage email' }
            // })
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Comment.countDocuments(query);

        res.status(200).json({
            comments,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalComments: count, // 해당 게시물의 최상위 댓글 총 개수
        });

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }
        next(error);
    }
}

// @desc    Update a specific comment
// @route   PUT /api/comments/:commentId 
//          (이 경로는 server/src/index.js에서 /api/comments/:commentId 로 직접 매핑되거나,
//           또는 /api/posts/:postId/comments/:commentId 형태로 중첩될 수 있습니다.
//           현재 comment.routes.js가 /api/posts/:postId/comments 로 마운트되어 있으므로,
//           이 파일 내에서는 /:commentId 로 정의하면 최종 경로는 /api/posts/:postId/comments/:commentId가 됩니다.
//           계획 상에서는 /api/comments/:commentId 이므로, 이 라우트 파일은 /api/comments로 index.js에 등록되어야 합니다.
//           일단 여기서는 :commentId 만 사용하고, index.js 등록 시 경로를 /api/comments 로 조정하는 것을 가정합니다.)
// @access  Private (Author or Admin)
async function updateComment(req, res, next) {
    try {
        const { commentId } = req.params;
        const { content } = req.body;
        const userId = req.user.id;
        const userRole = req.user.role; // authMiddleware에서 설정된 사용자 역할

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Cannot update comment.' });
        }

        if (!content || content.trim() === '') {
            return res.status(400).json({ message: 'Comment content cannot be empty.' });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        if (comment.isDeleted) {
            return res.status(400).json({ message: 'Cannot update a deleted comment.' });
        }

        // 작성자 또는 관리자만 수정 가능
        if (comment.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to update this comment.' });
        }

        comment.content = content;
        const updatedComment = await comment.save();
        
        const populatedComment = await Comment.findById(updatedComment._id)
                                            .populate('user', 'nickname profileImage email');

        res.status(200).json(populatedComment);

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Comment ID format.' });
        }
        next(error);
    }
}

// @desc    Delete a specific comment (Soft delete by setting isDeleted to true)
// @route   DELETE /api/posts/:postId/comments/:commentId (comment.routes.js 파일 내에서는 /:commentId)
// @access  Private (Author or Admin)
async function deleteComment(req, res, next) {
    try {
        const { commentId, postId } = req.params; // postId는 mergeParams: true로 인해 사용 가능
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Cannot delete comment.' });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // 댓글이 이미 삭제된 경우, 카운트를 다시 줄이지 않도록 합니다.
        if (comment.isDeleted) {
            return res.status(400).json({ message: 'Comment already deleted.' });
        }

        if (comment.post.toString() !== postId) {
             return res.status(400).json({ message: 'Comment does not belong to this post.' });
        }

        if (comment.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to delete this comment.' });
        }

        comment.isDeleted = true;
        const deletedComment = await comment.save();

        // 부모 댓글이 있었다면, 부모 댓글의 childrenCount를 감소
        if (deletedComment.parentComment) {
            const parent = await Comment.findById(deletedComment.parentComment);
            if (parent && parent.childrenCount > 0) {
                parent.childrenCount -= 1;
                await parent.save();
            }
        }

        // Post의 commentsCount 감소
        await Post.findByIdAndUpdate(postId, { $inc: { commentsCount: -1 } });

        res.status(200).json({ message: 'Comment marked as deleted successfully.' });

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Comment ID or Post ID format.' });
        }
        next(error);
    }
}

// @desc    Like/Unlike a specific comment
// @route   POST /api/posts/:postId/comments/:commentId/like 
//          (comment.routes.js 파일 내에서는 /:commentId/like 로 정의)
// @access  Private (User must be logged in)
async function toggleLikeComment(req, res, next) {
    try {
        const { commentId, postId } = req.params; // postId는 mergeParams: true로 인해 사용 가능, 여기선 commentId가 주 대상
        const userId = req.user.id; // authMiddleware에서 설정된 사용자 ID

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Cannot like/unlike comment.' });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        if (comment.isDeleted) {
            return res.status(400).json({ message: 'Cannot like/unlike a deleted comment.' });
        }
        
        // (선택적) 댓글이 올바른 게시물에 속하는지 확인
        if (comment.post.toString() !== postId) {
            return res.status(400).json({ message: 'Comment does not belong to the specified post context.'});
        }

        // 이미 '좋아요'를 눌렀는지 확인
        const likeIndex = comment.likes.findIndex(like => like.toString() === userId);

        let isLiked;
        if (likeIndex > -1) {
            // 이미 눌렀으므로, '좋아요' 취소 (배열에서 제거)
            comment.likes.splice(likeIndex, 1);
            isLiked = false;
        } else {
            // 누르지 않았으므로, '좋아요' 추가 (배열에 추가)
            comment.likes.push(userId);
            isLiked = true;
        }

        // Comment 모델에 likesCount 필드가 있다면 여기서 업데이트
        // comment.likesCount = comment.likes.length;

        const updatedComment = await comment.save();

        res.status(200).json({
            likesCount: updatedComment.likes.length,
            isLiked: isLiked, // 현재 사용자의 '좋아요' 상태
            likes: updatedComment.likes // (선택적) 업데이트된 전체 좋아요 목록 반환
        });

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Comment ID or User ID format.' });
        }
        next(error);
    }
}

module.exports = {
    createComment,
    getCommentsByPostId,
    updateComment,
    deleteComment,
    toggleLikeComment,
}; 