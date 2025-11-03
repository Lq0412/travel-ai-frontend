declare namespace API {
  type adminGetMerchantParams = {
    id: number
  }

  type adminGetProductParams = {
    id: number
  }

  type getProductByIdParams = {
    id: number
  }

  type listProductsParams = {
    merchantId?: number
    category?: string
    name?: string
    current?: number
    pageSize?: number
  }

  type AIConversation = {
    id?: number
    userId?: number
    title?: string
    provider?: string
    model?: string
    status?: string
    createTime?: string
    updateTime?: string
    isDelete?: boolean
  }

  type AIConversationVO = {
    id?: number
    userId?: number
    title?: string
    provider?: string
    model?: string
    status?: string
    createTime?: string
    updateTime?: string
    messageCount?: number
    lastMessage?: string
    lastMessageTime?: string
  }

  type AIMessage = {
    id?: number
    conversationId?: number
    role?: string
    content?: string
    tokensUsed?: number
    responseTime?: number
    createTime?: string
    isDelete?: boolean
  }

  type AIRequest = {
    provider?: string
    message: string
    systemPrompt?: string
    model?: string
    temperature?: number
    maxTokens?: number
    stream?: boolean
    history?: Message[]
    parameters?: Record<string, any>
  }

  type AIResponse = {
    content?: string
    model?: string
    provider?: string
    success?: boolean
    errorMessage?: string
    tokensUsed?: number
    responseTime?: number
    conversationTitle?: string
    metadata?: Record<string, any>
    fromCache?: boolean
    nullCacheMarker?: boolean
    errorCacheMarker?: boolean
  }

  type BaseResponseBoolean = {
    code?: number
    data?: boolean
    message?: string
  }

  type BaseResponseCategory = {
    code?: number
    data?: Category
    message?: string
  }

  type BaseResponseInteger = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseIPageMerchant = {
    code?: number
    data?: IPageMerchant
    message?: string
  }

  type BaseResponseIPageOrder = {
    code?: number
    data?: IPageOrder
    message?: string
  }

  type BaseResponseIPageProduct = {
    code?: number
    data?: IPageProduct
    message?: string
  }

  type BaseResponseListCategory = {
    code?: number
    data?: Category[]
    message?: string
  }

  type BaseResponseListMerchant = {
    code?: number
    data?: Merchant[]
    message?: string
  }

  type BaseResponseListOrderItem = {
    code?: number
    data?: OrderItem[]
    message?: string
  }

  type BaseResponseListScenicMessageWallVO = {
    code?: number
    data?: ScenicMessageWallVO[]
    message?: string
  }

  type BaseResponseListScenicSpot = {
    code?: number
    data?: ScenicSpot[]
    message?: string
  }

  type BaseResponseListTag = {
    code?: number
    data?: Tag[]
    message?: string
  }

  type BaseResponseLoginUserVO = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type BaseResponseLong = {
    code?: number
    data?: number
    message?: string
  }

  type BaseResponseMapStringObject = {
    code?: number
    data?: Record<string, any>
    message?: string
  }

  type BaseResponseMerchant = {
    code?: number
    data?: Merchant
    message?: string
  }

  type BaseResponseMessageWallVO = {
    code?: number
    data?: MessageWallVO
    message?: string
  }

  type BaseResponseOrder = {
    code?: number
    data?: Order
    message?: string
  }

  type BaseResponsePageComment = {
    code?: number
    data?: PageComment
    message?: string
  }

  type BaseResponsePageMessageWallVO = {
    code?: number
    data?: PageMessageWallVO
    message?: string
  }

  type BaseResponsePagePicture = {
    code?: number
    data?: PagePicture
    message?: string
  }

  type BaseResponsePagePictureVO = {
    code?: number
    data?: PagePictureVO
    message?: string
  }

  type BaseResponsePagePost = {
    code?: number
    data?: PagePost
    message?: string
  }

  type BaseResponsePagePostVO = {
    code?: number
    data?: PagePostVO
    message?: string
  }

  type BaseResponsePageUserVO = {
    code?: number
    data?: PageUserVO
    message?: string
  }

  type BaseResponsePicture = {
    code?: number
    data?: Picture
    message?: string
  }

  type BaseResponsePictureTagCategory = {
    code?: number
    data?: PictureTagCategory
    message?: string
  }

  type BaseResponsePictureVO = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type BaseResponsePostVO = {
    code?: number
    data?: PostVO
    message?: string
  }

  type BaseResponseListCartVO = {
    code?: number
    data?: CartVO[]
    message?: string
  }

  type BaseResponseProduct = {
    code?: number
    data?: Product
    message?: string
  }

  type BaseResponseScenicMessageWallVO = {
    code?: number
    data?: ScenicMessageWallVO
    message?: string
  }

  type BaseResponseScenicSpot = {
    code?: number
    data?: ScenicSpot
    message?: string
  }

  type BaseResponseUser = {
    code?: number
    data?: User
    message?: string
  }

  type BaseResponseUserVO = {
    code?: number
    data?: UserVO
    message?: string
  }

  type cancelLikeMessageParams = {
    messageId: number
  }

  type Cart = {
    id?: number
    userId?: number
    productId?: number
    merchantId?: number
    quantity?: number
    specs?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type CartVO = {
    id?: number
    userId?: number
    productId?: number
    merchantId?: number
    quantity?: number
    specs?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
    product?: Product
    subtotal?: number
  }

  type Category = {
    id?: number
    name?: string
    icon?: string
    sort?: number
  }

  type chatParams = {
    message: string
    voiceId?: number
    voiceSpeed?: number
  }

  type checkCommentLikeParams = {
    commentId: number
  }

  type checkPostFavoriteParams = {
    postId: number
  }

  type checkPostLikeParams = {
    postId: number
  }

  type clearPictureCacheParams = {
    pictureId: number
  }

  type Comment = {
    id?: number
    userId?: number
    postId?: number
    content?: string
    likeCount?: number
    parentId?: number
    replyToUserId?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type CommentAddRequest = {
    postId?: number
    content?: string
    parentId?: number
    replyToUserId?: number
  }

  type CommentLikeRequest = {
    commentId?: number
  }

  type CommentQueryRequest = {
    postId?: number
    current?: number
    pageSize?: number
    commentId?: number
  }

  type createConversationParams = {
    userId: number
    title?: string
    provider?: string
    model?: string
  }

  type CreateOrderItem = {
    productId?: number
    quantity?: number
    price?: number
    specs?: string
  }

  type CreateOrderRequest = {
    merchantId?: number
    contactName?: string
    contactPhone?: string
    shippingAddress?: string
    remark?: string
    payMethod?: number
    items?: CreateOrderItem[]
  }

  type deleteCategoryParams = {
    id: number
  }

  type deleteCommentParams = {
    commentId: number
  }

  type deleteConversationParams = {
    conversationId: number
    userId: number
  }

  type deleteMessageParams = {
    messageId: number
  }

  type DeleteRequest = {
    id?: number
  }

  type digitalHumanStreamParams = {
    task: string
    context?: string
    goal?: string
    constraints?: string
    conversationId?: number
  }

  type getCategoryByIdParams = {
    id: number
  }

  type getConversationMessagesParams = {
    conversationId: number
    userId: number
  }

  type getConversationParams = {
    conversationId: number
    userId: number
  }

  type getHotTagsParams = {
    limit?: number
  }

  type getMerchantDetailParams = {
    merchantId: number
  }

  type getMerchantListParams = {
    queryRequest: MerchantQueryRequest
  }

  type getMerchantProductsParams = {
    merchantId: number
    queryRequest: MerchantQueryRequest
  }

  type getMyOrderDetailParams = {
    orderId: number
  }

  type getPictureByIdParams = {
    id: number
  }

  type getPictureVOByIdParams = {
    id: number
  }

  type getPostByIdParams = {
    id: number
  }

  type getRecentMessagesParams = {
    conversationId: number
    userId: number
    limit?: number
  }

  type getRecommendedMerchantsParams = {
    limit?: number
  }

  type getScenicDetailParams = {
    id: number
  }

  type getTagsByPostIdParams = {
    postId: number
  }

  type getUserByIdParams = {
    id: number
  }

  type getUserConversationsParams = {
    userId: number
    pageNum?: number
    pageSize?: number
  }

  type getUserVOByIdParams = {
    id: number
  }

  type IPageMerchant = {
    size?: number
    current?: number
    records?: Merchant[]
    total?: number
    pages?: number
  }

  type IPageOrder = {
    size?: number
    current?: number
    records?: Order[]
    total?: number
    pages?: number
  }

  type IPageProduct = {
    size?: number
    current?: number
    records?: Product[]
    total?: number
    pages?: number
  }

  type likeMessageParams = {
    messageId: number
  }

  type LikeRequest = {
    postId?: number
  }

  type listMyOrdersParams = {
    current?: number
    size?: number
  }

  type listOrderItemsParams = {
    orderId: number
  }

  type LoginUserVO = {
    id?: number
    userAzccount?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    editTime?: string
    createTime?: string
    updateTime?: string
  }

  type Merchant = {
    id?: number
    userId?: number
    name?: string
    type?: number
    introduction?: string
    coverUrl?: string
    logoUrl?: string
    longitude?: number
    latitude?: number
    location?: string
    openHours?: string
    contactPhone?: string
    rating?: number
    status?: number
    minPrice?: number
    maxPrice?: number
    tags?: string
    businessHours?: string
    serviceScore?: number
    environmentScore?: number
    featureTags?: string
    isVerified?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type MerchantQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    name?: string
    type?: number
    status?: number
    userId?: number
    searchText?: string
    minRating?: number
    maxRating?: number
    location?: string
  }

  type Message = {
    role?: string
    content?: string
    timestamp?: number
  }

  type MessageWallDTO = {
    scenicSpotId: number
    content?: string
    textColor?: string
    fontSize?: number
    backgroundColor?: string
    backgroundId?: number
    isBarrage?: boolean
    barrageSpeed?: number
    barrageTrajectory?: number
    isAnonymous?: boolean
    messageType?: number
  }

  type MessageWallQueryRequest = {
    scenicSpotId?: number
    userId?: number
    messageType?: number
    status?: number
    isBarrage?: boolean
    keyword?: string
    pageSize?: number
    current?: number
  }

  type MessageWallVO = {
    id?: number
    scenicSpotId?: number
    userId?: number
    userName?: string
    userAvatar?: string
    content?: string
    likes?: number
    textColor?: string
    fontSize?: number
    backgroundColor?: string
    backgroundId?: number
    backgroundUrl?: string
    isBarrage?: boolean
    barrageSpeed?: number
    barrageTrajectory?: number
    isAnonymous?: boolean
    messageType?: number
    status?: number
    isLiked?: boolean
    createTime?: string
  }

  type Order = {
    id?: number
    orderNo?: string
    userId?: number
    merchantId?: number
    totalAmount?: number
    actualAmount?: number
    discountAmount?: number
    status?: number
    payTime?: string
    payMethod?: number
    transactionId?: string
    contactName?: string
    contactPhone?: string
    remark?: string
    shippingAddress?: string
    invoiceInfo?: string
    cancelReason?: string
    refundReason?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type OrderItem = {
    id?: number
    orderId?: number
    productId?: number
    productName?: string
    productImage?: string
    price?: number
    quantity?: number
    totalPrice?: number
    specs?: string
    refundStatus?: number
    createTime?: string
  }

  type PageComment = {
    records?: Comment[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageComment
    searchCount?: PageComment
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageMessageWallVO = {
    records?: MessageWallVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageMessageWallVO
    searchCount?: PageMessageWallVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePicture = {
    records?: Picture[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePicture
    searchCount?: PagePicture
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePictureVO = {
    records?: PictureVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePictureVO
    searchCount?: PagePictureVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePost = {
    records?: Post[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePost
    searchCount?: PagePost
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PagePostVO = {
    records?: PostVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PagePostVO
    searchCount?: PagePostVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type PageUserVO = {
    records?: UserVO[]
    total?: number
    size?: number
    current?: number
    orders?: OrderItem[]
    optimizeCountSql?: PageUserVO
    searchCount?: PageUserVO
    optimizeJoinOfCountSql?: boolean
    maxLimit?: number
    countId?: string
    pages?: number
  }

  type Picture = {
    id?: number
    url?: string
    thumbnailUrl?: string
    name?: string
    introduction?: string
    category?: string
    tags?: string
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    userId?: number
    createTime?: string
    editTime?: string
    updateTime?: string
    reviewStatus?: number
    reviewMessage?: string
    reviewerId?: number
    reviewTime?: string
    isDelete?: number
  }

  type PictureEditRequest = {
    id?: number
    name?: string
    introduction?: string
    category?: string
    tags?: string[]
  }

  type PictureQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    name?: string
    introduction?: string
    category?: string
    tags?: string[]
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    searchText?: string
    userId?: number
    reviewStatus?: number
    reviewMessage?: string
    reviewerId?: number
    startEditTime?: string
    endEditTime?: string
  }

  type PictureReviewRequest = {
    id?: number
    reviewStatus?: number
    reviewMessage?: string
  }

  type PictureTagCategory = {
    tagList?: string[]
    categoryList?: string[]
  }

  type PictureUpdateRequest = {
    id?: number
    name?: string
    introduction?: string
    category?: string
    tags?: string[]
  }

  type PictureUploadByBatchRequest = {
    searchText?: string
    count?: number
    namePrefix?: string
  }

  type PictureUploadRequest = {
    id?: number
    fileUrl?: string
    picName?: string
  }

  type PictureVO = {
    id?: number
    url?: string
    thumbnailUrl?: string
    name?: string
    introduction?: string
    tags?: string[]
    category?: string
    picSize?: number
    picWidth?: number
    picHeight?: number
    picScale?: number
    picFormat?: string
    userId?: number
    createTime?: string
    editTime?: string
    updateTime?: string
    user?: UserVO
  }

  type Post = {
    id?: number
    userId?: number
    title?: string
    content?: string
    coverUrl?: string
    viewCount?: number
    likeCount?: number
    commentCount?: number
    status?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
    categoryId?: number
  }

  type PostAddRequest = {
    title?: string
    content?: string
    coverUrl?: string
    categoryId?: number
    tags?: string[]
  }

  type PostQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    keyword?: string
    tagName?: string
    tagNames?: string[]
    tagId?: number
    tagIds?: number[]
    categoryId?: number
  }

  type PostVO = {
    id?: number
    title?: string
    content?: string
    coverUrl?: string
    viewCount?: number
    likeCount?: number
    commentCount?: number
    createTime?: string
    authorName?: string
    authorAvatar?: string
    tags?: string[]
  }

  type Product = {
    id?: number
    merchantId?: number
    name?: string
    categoryId?: number
    category?: string
    price?: number
    originalPrice?: number
    coverUrl?: string
    images?: string
    description?: string
    specs?: string
    stock?: number
    sales?: number
    status?: number
    isRecommend?: number
    weight?: number
    serviceGuarantee?: string
    limitPerUser?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type ProductQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type ResponseDTOAIConversation = {
    code?: number
    message?: string
    data?: AIConversation
    timestamp?: number
  }

  type ResponseDTOAIResponse = {
    code?: number
    message?: string
    data?: AIResponse
    timestamp?: number
  }

  type ResponseDTOBoolean = {
    code?: number
    message?: string
    data?: boolean
    timestamp?: number
  }

  type ResponseDTOListAIConversationVO = {
    code?: number
    message?: string
    data?: AIConversationVO[]
    timestamp?: number
  }

  type ResponseDTOListAIMessage = {
    code?: number
    message?: string
    data?: AIMessage[]
    timestamp?: number
  }

  type reviewMessageParams = {
    messageId: number
    status: number
  }

  type ScenicMessageWallDTO = {
    scenicSpotId: number
    title: string
    description?: string
  }

  type ScenicMessageWallVO = {
    scenicSpotId?: number
    scenicSpotName?: string
    title?: string
    description?: string
    messageCount?: number
    createTime?: string
    updateTime?: string
  }

  type ScenicSpot = {
    id?: number
    name?: string
    introduction?: string
    coverUrl?: string
    messageWallTitle?: string
    messageWallDescription?: string
    location?: string
    longitude?: number
    latitude?: number
    tags?: string
    openHours?: string
    ticketInfo?: string
    rating?: number
    heatValue?: number
    viewCount?: number
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type searchTagsParams = {
    keyword: string
  }

  type SseEmitter = {
    timeout?: number
  }

  type Tag = {
    id?: number
    name?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type tourismStreamParams = {
    task: string
    context?: string
    goal?: string
    constraints?: string
    conversationId?: number
  }

  type updateConversationTitleParams = {
    conversationId: number
    userId: number
    title: string
  }

  type updatePostTagsParams = {
    postId: number
  }

  type uploadPictureParams = {
    pictureUploadRequest: PictureUploadRequest
  }

  type User = {
    id?: number
    userAccount?: string
    userPassword?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    editTime?: string
    createTime?: string
    updateTime?: string
    isDelete?: number
  }

  type UserAddRequest = {
    userName?: string
    userAccount?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
  }

  type UserLoginRequest = {
    userPassword?: string
    userAccount?: string
  }

  type UserQueryRequest = {
    current?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    id?: number
    userName?: string
    userAccount?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    userAccount?: string
    userPassword?: string
    checkPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    id?: number
    userAccount?: string
    userName?: string
    userAvatar?: string
    userProfile?: string
    userRole?: string
    createTime?: string
  }
}
