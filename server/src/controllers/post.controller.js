const Post = require('../models/Post.model');
const User = require('../models/User'); // User 모델의 실제 경로에 맞게 수정 필요
// Comment 모델도 필요하면 require('../models/Comment.model'); 추가

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private (User must be logged in)
async function createPost(req, res, next) {
    try {
        // Validation errors are handled by the validator middleware

        if (!req.user || !req.user.id) {
            // This check is also present in authMiddleware, but as a safeguard:
            return res.status(401).json({ message: 'User not authenticated. Cannot create post.' });
        }

        let {
            postType,
            title,
            content,
            // images, // 이제 req.files에서 처리합니다.
            tags,
            isPinned, // Only admins should ideally set this directly on creation, or handle via separate endpoint
            status,
            additionalFields = {} // Default to empty object if not provided
        } = req.body;

        const newPostData = {
            user: req.user.id,
            postType,
            title,
            content,
            images: [], // 초기화
            tags: tags || [],     // Ensure tags is an array
            status: status || 'published', // Default status if not provided
            additionalFields: { ...additionalFields }, // Clone to avoid modifying req.body.additionalFields directly
        };

        // 처리된 이미지 URL들을 저장할 배열
        if (req.files && req.files.length > 0) {
            newPostData.images = req.files.map(file => {
                // file.path는 'server\public\uploads\posts\filename.jpg'와 같은 형태일 수 있습니다.
                // 웹 접근 가능한 URL로 변환합니다. 'server/public' 부분을 제거합니다.
                return file.path.replace(/^server[\\\/]public[\\\/]/, '/').replace(/\\/g, '/');
            });
        }

        // Handle OOTD specific fields from additionalFields as per validator structure
        if (postType === 'ootd') {
            if (req.body.additionalFields && req.body.additionalFields.style !== undefined) {
                newPostData.additionalFields.style = req.body.additionalFields.style;
            }
            if (req.body.additionalFields && req.body.additionalFields.season !== undefined) {
                newPostData.additionalFields.season = req.body.additionalFields.season;
            }
            // isPinned could be handled here if general users are allowed to suggest it
            // or if specific postTypes have different default pinning rules.
            // For now, only admin can pin via update, or a separate pinning endpoint.
        }

        // Admins might have permission to pin any post on creation
        if (req.user.role === 'admin' && isPinned !== undefined) {
            newPostData.isPinned = isPinned;
        } else {
            newPostData.isPinned = false; // Default for non-admins or if not specified by admin
        }

        const newPost = new Post(newPostData);
        const savedPost = await newPost.save();
        
        // Populate user information before sending the response
        const populatedPost = await Post.findById(savedPost._id).populate('user', 'nickname profileImage email');
        
        res.status(201).json(populatedPost);

    } catch (error) {
        // Mongoose validation errors (though most are caught by express-validator now)
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error from Model', errors: messages });
        }
        // Log other errors for debugging
        console.error('Error creating post:', error); 
        next(error); // Pass to global error handler
    }
}

// @desc    Get all published posts (with pagination and filtering)
// @route   GET /api/posts
// @access  Public
async function getPosts(req, res, next) {
    try {
        const { 
            page = 1, 
            limit = 10, 
            postType, 
            userId, // 작성자 ID로 필터링
            tags,   // 쉼표로 구분된 태그 문자열
            sortBy = 'createdAt_desc', // 정렬 옵션 (예: createdAt_desc, viewCount_desc, likesCount_desc)
            searchTerm,
            // OOTD specific filters
            style, 
            season  
        } = req.query;

        const query = { status: 'published' }; // 기본적으로 'published' 상태의 게시물만 조회

        if (postType) query.postType = postType;
        if (userId) query.user = userId;
        if (tags) {
            query.tags = { $in: tags.split(',').map(tag => tag.trim()) };
        }
        if (searchTerm) {
            query.$text = { $search: searchTerm };
        }

        // Add OOTD specific filters if postType is 'ootd' or if they are provided generally
        if (postType === 'ootd' || style || season) {
            if (style) query['additionalFields.style'] = style;
            if (season) query['additionalFields.season'] = season;
        }

        const sortOptions = {};
        if (sortBy) {
            const parts = sortBy.split('_');
            const field = parts[0];
            const order = parts[1] === 'desc' ? -1 : 1;
            // likesCount, commentsCount 등 모델에 실제 필드가 있어야 정렬 가능. 현재는 likes.length 등으로 처리해야 함.
            // Post 모델에 likesCount, commentsCount 필드를 추가하거나, 집계 파이프라인을 사용해야 정확한 정렬이 가능.
            // 여기서는 단순 필드명으로 가정하고 진행.
            sortOptions[field] = order;
        }

        const posts = await Post.find(query)
            .populate('user', 'nickname profileImage email') // User 모델에 nickname, profileImage, email 필드 가정
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean(); // 더 빠른 조회를 위해 .lean() 사용, mongoose 문서를 일반 객체로 변환

        const count = await Post.countDocuments(query);

        res.status(200).json({
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            totalPosts: count,
        });

    } catch (error) {
        next(error);
    }
}

// @desc    Get a single post by ID and increment view count
// @route   GET /api/posts/:postId
// @access  Public
async function getPostById(req, res, next) {
    try {
        const postId = req.params.postId;

        // 조회수 증가 및 게시물 가져오기 (원자적 연산)
        const post = await Post.findOneAndUpdate(
            { _id: postId, status: 'published' }, // 'published' 상태인 게시물만 조회
            { $inc: { viewCount: 1 } },
            { new: true } // 업데이트된 문서를 반환
        )
        .populate('user', 'nickname profileImage email') // User 모델에 nickname, profileImage, email 필드 가정
        .populate({
            path: 'comments', // Post 모델의 comments 필드 (Comment 모델 ID 배열)
            match: { isDeleted: false }, // 삭제되지 않은 댓글만
            populate: { path: 'user', select: 'nickname profileImage email' } // 댓글 작성자 정보
            // 추가적으로 댓글의 대댓글도 populate 가능 (계층 구조)
        })
        .lean(); 

        if (!post) {
            // 게시물이 없거나 'published' 상태가 아닐 경우
            return res.status(404).json({ message: 'Post not found or not available.' });
        }

        res.status(200).json(post);

    } catch (error) {
        // postId 형식이 잘못된 경우 ObjectId 관련 에러 발생 가능
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }
        next(error);
    }
}

// @desc    Like/Unlike a post
// @route   POST /api/posts/:postId/like  (일반적으로 PUT 또는 PATCH를 사용하기도 하나, 계획에 따라 POST로 진행)
// @access  Private (User must be logged in)
async function toggleLikePost(req, res, next) {
    try {
        const postId = req.params.postId;
        const userId = req.user.id; // authMiddleware에서 설정된 사용자 ID

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Cannot like/unlike post.' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // 이미 '좋아요'를 눌렀는지 확인
        const likeIndex = post.likes.findIndex(like => like.toString() === userId);

        let isLiked;
        if (likeIndex > -1) {
            // 이미 눌렀으므로, '좋아요' 취소 (배열에서 제거)
            post.likes.splice(likeIndex, 1);
            isLiked = false;
        } else {
            // 누르지 않았으므로, '좋아요' 추가 (배열에 추가)
            post.likes.push(userId);
            isLiked = true;
        }

        // (선택 사항) Post 모델에 likesCount 필드가 있다면 여기서 업데이트
        // post.likesCount = post.likes.length;

        const updatedPost = await post.save();

        res.status(200).json({
            likesCount: updatedPost.likes.length,
            likedByCurrentUser: isLiked,
            likes: updatedPost.likes // (선택적) 업데이트된 전체 좋아요 목록 반환
        });

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Post ID or User ID format.' });
        }
        next(error);
    }
}

// @desc    Update a specific post
// @route   PUT /api/posts/:postId
// @access  Private (Author or Admin)
async function updatePost(req, res, next) {
    try {
        const postId = req.params.postId;
        const updates = req.body;
        const userId = req.user.id;
        const userRole = req.user.role;

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Cannot update post.' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the user is the author or an admin
        if (post.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to update this post.' });
        }

        // 업데이트할 필드들
        if (updates.title !== undefined) post.title = updates.title;
        if (updates.content !== undefined) post.content = updates.content;
        if (updates.postType !== undefined) post.postType = updates.postType;
        if (updates.tags !== undefined) post.tags = updates.tags; // 클라이언트가 전체 태그 배열을 보내야 함
        if (updates.status !== undefined) { // 관리자 또는 특정 조건에서만 상태 변경 허용 가능
            if (userRole === 'admin' || post.status === 'draft') { // 예: 관리자거나, 초안 상태일 때만 직접 변경 가능
                post.status = updates.status;
            } else if (updates.status === 'deleted' && (post.user.toString() === userId || userRole === 'admin')) {
                // 삭제 요청은 deletePost 핸들러를 사용하는 것이 더 적절할 수 있으나, 여기서도 처리 가능
                post.status = 'deleted'; // 직접 삭제 상태로 변경 (소프트 삭제)
            } else {
                // 일반 사용자가 임의의 status로 변경하는 것을 방지
            }
        }

        if (updates.additionalFields) {
            // 기존 additionalFields를 완전히 교체하거나 병합할 수 있습니다.
            // 여기서는 병합을 선택합니다. 특정 필드만 업데이트하려면 클라이언트에서 해당 필드만 보내야 합니다.
            post.additionalFields = { ...post.additionalFields, ...updates.additionalFields };
            // Mongoose는 Mixed 타입의 변경을 감지하기 위해 markModified를 필요로 할 수 있습니다.
            post.markModified('additionalFields');
        }

        // 이미지 업데이트 처리
        let newImageUrls = [];
        if (req.files && req.files.length > 0) {
            newImageUrls = req.files.map(file => {
                return file.path.replace(/^server[\\\/]public[\\\/]/, '/').replace(/\\/g, '/');
            });
        }

        // 클라이언트가 기존 이미지 URL 목록(updates.images)을 보냈는지 확인
        // 이 목록은 유지하고 싶은 기존 이미지 + 새로 업로드되어 경로가 치환될 placeholder들일 수 있음
        // 여기서는 단순하게, 새로 업로드된 이미지가 있으면 기존 이미지를 모두 대체하거나,
        // 클라이언트가 보내는 updates.images 배열 (문자열 URL 배열)을 사용하고, 거기에 새 이미지를 추가하는 로직을 선택할 수 있습니다.

        // 예제: 클라이언트가 images 필드를 보내면 그걸 사용하고, 없으면 기존것에 새 이미지를 추가.
        // 더 나은 방법: 클라이언트가 최종 이미지 URL 목록을 images 필드로 보내고,
        // 서버는 req.files로 업로드된 것들을 이 목록에 추가하거나 교체해주는 방식.
        // 여기서는 좀 더 명확하게, updates.images가 제공되면 그것을 새 이미지 목록으로 간주하고, req.files는 여기에 추가되는 것으로 가정합니다.
        let finalImageUrls = [];
        if (updates.images && Array.isArray(updates.images)) {
            // 기존 이미지 URL 문자열들을 그대로 사용
            finalImageUrls.push(...updates.images.filter(url => typeof url === 'string'));
        } else if (!req.files || req.files.length === 0) {
            // 새 업로드도 없고, 클라이언트가 images 배열도 안보냈으면 기존 이미지 유지 (아무것도 안함)
            // 만약 images 필드를 빈 배열로 보내면 모든 이미지 삭제로 간주할 수도 있음. 정책 필요.
        }

        // 새로 업로드된 이미지 URL들을 최종 목록에 추가
        finalImageUrls.push(...newImageUrls);

        // 중복 제거 (만약 있을 수 있다면)
        finalImageUrls = [...new Set(finalImageUrls)];
        
        // post.images가 finalImageUrls와 다를 경우에만 업데이트 (불필요한 DB 업데이트 방지)
        // 주의: 이 비교는 순서까지 고려하지는 않음. 단순 배열 내용 비교가 필요하면 JSON.stringify 등으로 비교.
        // 여기서는 그냥 할당합니다.
        if (req.files && req.files.length > 0 || updates.images) { // 새 파일이 있거나 클라이언트가 images를 보냈을 때만 images 필드 업데이트
             post.images = finalImageUrls;
        }

        // 관리자만 isPinned를 직접 설정 가능 (또는 특정 조건)
        if (userRole === 'admin' && updates.isPinned !== undefined) {
            post.isPinned = updates.isPinned;
        }

        const updatedPost = await post.save();
        const populatedPost = await Post.findById(updatedPost._id)
            .populate('user', 'nickname profileImage email');
            // 필요하다면 댓글도 populate
            // .populate({
            //     path: 'comments',
            //     match: { isDeleted: false },
            //     populate: { path: 'user', select: 'nickname profileImage email' }
            // });
        
        res.status(200).json(populatedPost);

    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error', errors: messages });
        }
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }
        next(error);
    }
}

// @desc    Delete a specific post (Soft delete by changing status to 'deleted')
// @route   DELETE /api/posts/:postId
// @access  Private (Author or Admin)
async function deletePost(req, res, next) {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        const userRole = req.user.role; // authMiddleware에서 설정된 사용자 역할

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated. Cannot delete post.' });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // 이미 'deleted' 상태인 경우 (선택적 처리)
        if (post.status === 'deleted') {
            return res.status(400).json({ message: 'Post already marked as deleted.' });
        }

        // 작성자 또는 관리자만 삭제 가능
        if (post.user.toString() !== userId && userRole !== 'admin') {
            return res.status(403).json({ message: 'User not authorized to delete this post.' });
        }

        // Soft delete: status를 'deleted'로 변경
        post.status = 'deleted';
        // deletedAt 필드가 있다면 현재 시간으로 설정 가능: post.deletedAt = new Date();
        
        await post.save();

        // 관련된 댓글들의 상태도 변경하거나, 게시물 조회 시 댓글을 필터링해야 함.
        // 예를 들어, Comment 모델에 status 필드를 추가하거나, isPostDeleted 같은 플래그를 둘 수 있음.
        // 또는, 게시물 상세 조회(getPostById) 시 post.status === 'deleted' 이면 댓글을 보여주지 않도록 처리.
        // 지금은 게시물 상태만 변경.

        res.status(200).json({ message: 'Post marked as deleted successfully.' });

    } catch (error) {
        if (error.name === 'CastError' && error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid Post ID format.' });
        }
        next(error);
    }
}

// @desc    Get weekly top OOTD posts (최근 7일간 좋아요가 많은 상위 10개 게시물)
// @route   GET /api/posts/top-ootd
// @access  Public
async function getWeeklyTopOotd(req, res, next) {
    try {
        const { limit = 10 } = req.query;
        
        // 현재 시점으로부터 7일 전 날짜 계산
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // 집계 파이프라인을 사용하여 좋아요 수를 계산하고 정렬
        const topOotdPosts = await Post.aggregate([
            {
                // 조건 필터링: OOTD 타입, published 상태, 7일 이내 작성된 게시물
                $match: {
                    postType: 'ootd',
                    status: 'published',
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                // 좋아요 수 계산 및 추가 필드 생성
                $addFields: {
                    likesCount: { $size: { $ifNull: ['$likes', []] } }
                }
            },
            {
                // 정렬: 좋아요 수 내림차순, 같으면 작성일 오름차순 (먼저 올린 것 우선)
                $sort: {
                    likesCount: -1,
                    createdAt: 1
                }
            },
            {
                // 상위 limit개만 선택
                $limit: parseInt(limit)
            },
            {
                // 사용자 정보 조인
                $lookup: {
                    from: 'users', // User 모델의 컬렉션 이름 (일반적으로 소문자 복수형)
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                    // 필요한 필드만 선택
                    pipeline: [
                        {
                            $project: {
                                nickname: 1,
                                profileImage: 1,
                                email: 1
                            }
                        }
                    ]
                }
            },
            {
                // user 배열을 객체로 변환 (lookup은 배열을 반환하므로)
                $unwind: '$user'
            },
            {
                // 응답에 포함할 필드 선택
                $project: {
                    _id: 1,
                    user: 1,
                    postType: 1,
                    title: 1,
                    content: 1,
                    images: 1,
                    tags: 1,
                    likes: 1,
                    likesCount: 1,
                    viewCount: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    additionalFields: 1,
                    isPinned: 1
                }
            }
        ]);

        res.status(200).json({
            posts: topOotdPosts,
            totalPosts: topOotdPosts.length,
            dateRange: {
                from: sevenDaysAgo.toISOString(),
                to: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Error fetching weekly top OOTD posts:', error);
        next(error);
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostById,
    toggleLikePost,
    updatePost,
    deletePost,
    getWeeklyTopOotd, // 새로운 함수 추가
    // 다른 컨트롤러 함수들 추가 예정
}; 