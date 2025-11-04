<template>
  <div class="forum-page">
    <!-- 优化后的顶部区域 -->
    <div class="forum-header">
      <!-- 搜索和发布行 -->
      <div class="search-publish-row">
        <div class="search-container">
          <a-input-search
            v-model:value="searchParams.keyword"
            placeholder="搜索帖子内容..."
            enter-button="搜索"
            size="large"
            @search="handleSearch"
            allow-clear
            class="main-search-input"
          />
          
          <!-- 排序选择 -->
          <a-select
            v-model:value="searchParams.sortField"
            :options="sortOptions"
            @change="handleSortChange"
            class="sort-select"
          >
            <template #suffixIcon>
              <img src="https://unpkg.com/lucide-static@latest/icons/arrow-down-up.svg" class="sort-icon" alt="sort">
            </template>
          </a-select>
        </div>
        
        <a-button type="primary" @click="showCreate = true" class="publish-btn">
          <img src="https://unpkg.com/lucide-static@latest/icons/edit.svg" class="btn-icon" alt="edit">
          <span class="btn-text">发布帖子</span>
        </a-button>
      </div>
      
      
      <!-- 分类标签 -->
      <div class="category-tabs-wrapper">
        <a-tabs
          v-model:activeKey="searchParams.categoryId"
          @change="handleCategoryChange"
          class="category-tabs"
        >
          <a-tab-pane key="" tab="全部" />
          <a-tab-pane
            v-for="category in categories"
            :key="String(category.id)"
            :tab="category.name"
          />
        </a-tabs>
      </div>
    </div>

    <div class="grid">
      <div v-for="item in displayedPosts" :key="item.id || item.title" class="post-card">
        <!-- 第一部分：图片 -->
        <div class="post-image" @click="openDetail(item)">
          <img :src="item.coverUrl || defaultCover" alt="cover" />
          <div class="image-overlay">
            <div class="view-count">
              <img src="https://unpkg.com/lucide-static@latest/icons/eye.svg" class="count-icon" alt="view">
              {{ item.viewCount || 0 }}
            </div>
          </div>
        </div>

        <!-- 第二部分：精简描述 -->
        <div class="post-content" @click="openDetail(item)">
          <h3 class="post-title">{{ item.title || '未命名帖子' }}</h3>
          <p class="post-description">{{ getPostDescription(item.content) }}</p>
          <!-- 标签显示 -->
          <div v-if="item.tags && item.tags.length > 0" class="post-tags">
            <a-tag
              v-for="tag in item.tags.slice(0, 3)"
              :key="tag"
              color="blue"
              size="small"
              class="post-tag"
            >
              {{ tag }}
            </a-tag>
            <span v-if="item.tags.length > 3" class="more-tags">+{{ item.tags.length - 3 }}</span>
          </div>
        </div>

        <!-- 第三部分：用户信息和点赞功能 -->
        <div class="post-footer">
          <div class="user-section">
            <img
              :src="item.authorAvatar || defaultAvatar"
              :alt="item.authorName || '用户头像'"
              class="user-avatar"
            />
            <div class="user-details">
              <span class="user-name">{{ item.authorName || '匿名用户' }}</span>
              <span class="publish-time">{{ formatTime(item.createTime) }}</span>
            </div>
          </div>
          <div class="like-section">
            <a-button
              type="text"
              size="small"
              @click.stop="toggleLike(item)"
              :class="{ liked: item.id && likeMap[item.id] }"
            >
              <template #icon>
                <img src="https://unpkg.com/lucide-static@latest/icons/thumbs-up.svg" class="like-icon" alt="like">
              </template>
              <span class="like-count">{{ item.likeCount || 0 }}</span>
            </a-button>
          </div>
        </div>
      </div>
      <div v-if="!loading && (!displayedPosts || displayedPosts.length === 0)" class="empty">
        还没有帖子，快来发布第一条吧～
      </div>
    </div>

    <div class="pagination">
      <a-pagination
        :current="query.current"
        :pageSize="query.pageSize"
        :total="total"
        show-size-changer
        @change="onPageChange"
        @showSizeChange="onSizeChange"
      />
    </div>

    <!-- 发布帖子模态框 -->
    <a-modal
      v-model:open="showCreate"
      title="发布帖子"
      :confirm-loading="creating"
      @ok="handleCreate"
      @open="handleCreateModalOpen"
      width="600px"
    >
      <a-form :model="createForm" layout="vertical">
        <a-form-item label="标题">
          <a-input v-model:value="createForm.title" placeholder="请输入标题" allow-clear />
        </a-form-item>
        <a-form-item label="内容">
          <a-textarea v-model:value="createForm.content" :rows="5" placeholder="请输入内容" />
        </a-form-item>

        <!-- 分类选择 -->
        <a-form-item label="分类">
          <a-select
            v-model:value="createForm.categoryId"
            placeholder="请选择分类"
            allow-clear
            style="width: 100%"
            @change="onCategoryChange"
          >
            <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <!-- 标签选择 -->
        <a-form-item label="标签">
          <a-select
            v-model:value="createForm.tags"
            mode="multiple"
            placeholder="请选择标签（可多选）"
            allow-clear
            style="width: 100%"
            :options="tagOptions"
            :loading="tagsLoading"
            @search="handleTagSearch"
            @change="onTagsChange"
          />
          <div class="tag-tips">
            <span class="tag-tip">💡 提示：选择相关标签可以让更多人发现您的帖子</span>
          </div>
        </a-form-item>

        <div class="row-actions">
          <a-button @click="suggestTitle" :loading="suggesting">AI 生成标题</a-button>
        </div>

        <!-- 封面图片 -->
        <a-form-item label="封面图片">
          <div class="cover-upload">
            <a-upload
              v-model:file-list="coverFileList"
              :custom-request="handleCoverUpload"
              list-type="picture-card"
              @preview="handleCoverPreview"
              @change="handleCoverChange"
              :max-count="1"
              :before-upload="beforeCoverUpload"
            >
              <div v-if="!coverFileList || coverFileList.length < 1">
                <plus-outlined />
                <div style="margin-top: 8px">上传封面</div>
              </div>
            </a-upload>
            <a-modal
              :open="coverPreviewVisible"
              :title="coverPreviewTitle"
              :footer="null"
              @cancel="handleCoverCancel"
            >
              <img alt="封面预览" style="width: 100%" :src="coverPreviewImage" />
            </a-modal>
          </div>
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- Lightbox 全屏放大查看 -->
    <div v-if="lightboxVisible" class="lightbox-overlay" @click.self="closeLightbox">
      <button class="lightbox-close" @click="closeLightbox">✕</button>
      <button class="lightbox-prev" @click.stop="prevLightbox">‹</button>
      <div class="lightbox-content">
        <template v-if="galleryImages && galleryImages.length > 0">
          <component
            :is="isVideoUrl(galleryImages[activeImageIndex]) ? 'video' : 'img'"
            class="lightbox-media"
            :src="galleryImages[activeImageIndex]"
            controls
            autoplay
          />
        </template>
      </div>
      <button class="lightbox-next" @click.stop="nextLightbox">›</button>
      <div class="lightbox-thumbs">
        <div
          v-for="(img, idx) in galleryImages"
          :key="idx"
          class="lightbox-thumb"
          :class="{ active: idx === activeImageIndex }"
          @click.stop="activeImageIndex = idx"
        >
          <img :src="img" />
        </div>
      </div>
    </div>

    <!-- 帖子详情浮窗 - 修改后的部分 -->
    <a-modal
      v-model:open="detailModalOpen"
      :title="null"
      :footer="null"
      width="1200px"
      class="detail-modal"
      @cancel="closeDetailModal"
  :getContainer="getModalContainer"
      :zIndex="3000"
    >
      <div class="detail-modal-container" v-if="detailPost">
        <!-- 左侧：多图画廊展示 -->
        <div class="modal-image-section">
          <div class="gallery-wrapper">
            <!-- 主图：第一张作为封面，或根据 activeImageIndex 展示 -->
            <div class="modal-image-container" @click="openLightbox(activeImageIndex)">
              <template v-if="galleryImages && galleryImages.length > 0">
                <component
                  :is="isVideoUrl(galleryImages[activeImageIndex]) ? 'video' : 'img'"
                  class="modal-main-image"
                  :src="galleryImages[activeImageIndex]"
                  controls="false"
                  autoplay="false"
                  muted
                />
              </template>
              <div class="modal-image-overlay">
                <div class="modal-view-count">👁 {{ detailPost.viewCount || 0 }}</div>
              </div>
            </div>

            <!-- 缩略图列表 -->
            <div class="thumbnail-list">
              <div
                v-for="(img, idx) in galleryImages"
                :key="idx"
                class="thumbnail-item"
                :class="{ active: idx === activeImageIndex }"
                @click.stop="activeImageIndex = idx"
              >
                <img :src="img" alt="thumb" />
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：内容区域 -->
        <div class="modal-content-section">
          <!-- 上半部分：标题和描述 -->
          <div class="modal-post-info">
            <h1 class="modal-post-title">{{ detailPost.title || '未命名帖子' }}</h1>

            <!-- 标签显示 -->
            <div v-if="detailPost.tags && detailPost.tags.length > 0" class="modal-post-tags">
              <a-tag
                v-for="tag in detailPost.tags"
                :key="tag"
                color="blue"
                size="small"
                class="modal-tag"
              >
                {{ tag }}
              </a-tag>
            </div>

            <!-- 用户信息 -->
            <div class="modal-user-info">
              <img
                :src="detailPost.authorAvatar || defaultAvatar"
                :alt="detailPost.authorName || '用户头像'"
                class="modal-user-avatar"
              />
              <div class="modal-user-details">
                <span class="modal-user-name">{{ detailPost.authorName || '匿名用户' }}</span>
                <span class="modal-publish-time">{{ formatTime(detailPost.createTime) }}</span>
              </div>
            </div>

            <!-- 帖子内容 -->
            <div class="modal-post-content">
              <p>{{ detailPost.content || '暂无内容' }}</p>
            </div>

            <!-- 操作按钮 -->
            <div class="modal-action-buttons">
              <a-button
                type="primary"
                :class="{ liked: detailPost.id && likeMap[detailPost.id] }"
                @click="toggleLike(detailPost)"
                :loading="likeLoading"
              >
                <template #icon>
                  <img src="https://unpkg.com/lucide-static@latest/icons/thumbs-up.svg" class="action-icon" alt="like">
                </template>
                {{ detailPost.id && likeMap[detailPost.id] ? '已点赞' : '点赞' }} ({{
                  detailPost.likeCount || 0
                }})
              </a-button>

              <a-button
                :class="{ favorited: detailPost.id && favoriteMap[detailPost.id] }"
                @click="toggleFavorite(detailPost)"
                :loading="favoriteLoading"
              >
                <template #icon>
                  <img src="https://unpkg.com/lucide-static@latest/icons/star.svg" class="action-icon" alt="favorite">
                </template>
                {{ detailPost.id && favoriteMap[detailPost.id] ? '已收藏' : '收藏' }}
              </a-button>
            </div>
          </div>

          <!-- 下半部分：评论区 -->
          <div class="modal-comment-section">
            <div class="modal-comment-header">
              <h3 class="modal-comment-title">
                <img src="https://unpkg.com/lucide-static@latest/icons/message-circle.svg" class="comment-icon" alt="comment">
                评论区 ({{ modalCommentList.length }})
              </h3>
              <a-button
                type="text"
                size="small"
                @click="refreshComments"
                :loading="commentRefreshing"
                class="refresh-btn"
              >
                <template #icon>
                  <img src="https://unpkg.com/lucide-static@latest/icons/refresh-cw.svg" class="refresh-icon" alt="refresh">
                </template>
                刷新
              </a-button>
            </div>

            <!-- 发表评论 -->
            <div class="modal-comment-input">
              <div class="comment-input-header">
                <span class="input-label">发表评论</span>
                <span class="char-count">{{ modalNewComment.length }}/500</span>
              </div>
              <a-textarea
                v-model:value="modalNewComment"
                :rows="3"
                placeholder="分享你的想法..."
                :maxlength="500"
                class="comment-textarea"
                :class="{ 'has-content': modalNewComment.trim() }"
              />
              <div class="modal-comment-actions">
                <a-button
                  type="text"
                  @click="clearComment"
                  :disabled="!modalNewComment.trim()"
                  class="clear-btn"
                >
                  清空
                </a-button>
                <a-button
                  type="primary"
                  @click="submitModalComment"
                  :loading="modalCommentLoading"
                  :disabled="!modalNewComment.trim()"
                  class="submit-btn"
                >
                  <template #icon>
                    <img src="https://unpkg.com/lucide-static@latest/icons/send.svg" class="send-icon" alt="send">
                  </template>
                  发表评论
                </a-button>
              </div>
            </div>

            <!-- 评论列表 -->
            <div class="modal-comment-list" ref="commentListRef">
              <div v-for="comment in modalCommentList" :key="comment.id" class="modal-comment-item">
                <div class="comment-avatar-container">
                  <img
                    :src="getUserAvatar(comment.userId) || defaultAvatar"
                    :alt="getUserName(comment.userId) || '用户头像'"
                    class="modal-comment-avatar"
                  />
                </div>
                <div class="modal-comment-content">
                  <div class="comment-user-info">
                    <span class="comment-username">{{
                      getUserName(comment.userId) || '匿名用户'
                    }}</span>
                  </div>
                  <div class="comment-text">{{ comment.content }}</div>
                  <div class="comment-meta">
                    <span class="comment-time">{{ formatTime(comment.createTime) }}</span>
                    <div class="comment-actions">
                      <button class="action-btn like-btn">
                        <span class="action-icon">👍</span>
                        <span class="action-count">{{ comment.likeCount || 0 }}</span>
                      </button>
                      <button class="action-btn reply-btn">
                        <span class="action-text">回复</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="modalCommentList.length === 0" class="modal-no-comments">
                <div class="empty-icon">💭</div>
                <p class="empty-text">暂无评论，快来抢沙发吧～</p>
                <p class="empty-hint">成为第一个评论的人</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { addPost, listPostByCategory, getAllTags } from '@/api/postController'
import {
  searchPosts,
  searchPostsByTagNames,
  searchPostsByTagIds,
  searchTags,
  getHotTags,
} from '@/api/searchController'
import {
  checkPostFavorite,
  favoritePost,
  unfavoritePost,
  checkPostLike,
  likePost,
  unlikePost,
  getLatestPosts,
  getMostLikedPosts,
  getMostViewedPosts,
  getMostCommentedPosts,
} from '@/api/interactionController'
import { listAllCategories } from '@/api/categoryController'
import { addComment, listCommentByPage } from '@/api/commentController'
import { getUserVoById } from '@/api/userController'
import { chat1 as chat } from '@/api/aiController'
import request from '@/request'
import { formatTime } from '@/util/timeUtils'
import { ReloadOutlined, DownOutlined, PlusOutlined } from '@ant-design/icons-vue'
import type { UploadProps, UploadFile } from 'ant-design-vue'
// 示例图片（用于演示画廊功能），使用项目内已有资源作为占位
// 备用示例图（字符串路径，避免图片模块声明报错）
// 注意：当前使用项目中的本地占位图片作为示例（会在详情画廊中重复三次用于演示）。
// TODO: 真实数据应由后端提供图片数组（pictureUrls / images / coverUrl 等），请在后端接口可用后替换此处逻辑。
const sampleImg = '/src/assets/user-avatar.jpg'

const loading = ref(false)
const total = ref(0)
const postList = ref<API.PostVO[]>([])
const categories = ref<API.Category[]>([])
const tags = ref<API.Tag[]>([])
const hotTags = ref<API.Tag[]>([])
const filterLoading = ref(false)
const lastRequestTime = ref(0)
const tagsLoading = ref(false)
const tagOptions = ref<{ label: string; value: string }[]>([])
const tagSearchKeyword = ref('')
const hotTagOptions = ref<{ label: string; value: string }[]>([])
// 标签名称到ID的映射
const tagNameToIdMap = ref<Record<string, number>>({})

// 移除不需要的状态

// 搜索参数
const searchParams = reactive({
  keyword: '',
  sortField: 'latest',
  categoryId: '',
  selectedTags: [] as string[],
})

// 移除不需要的计算属性

// 排序选项
const sortOptions = [
  { label: '最新帖子', value: 'latest' },
  { label: '最热帖子', value: 'mostLiked' },
  { label: '最热浏览', value: 'mostViewed' },
  { label: '最热评论', value: 'mostCommented' },
]

const query = reactive<API.PostQueryRequest>({
  current: 1,
  pageSize: 10,
  sortField: 'latest',
})

const favoriteMap = ref<Record<number, boolean>>({})
// 点赞状态映射：记录当前用户对每个帖子的点赞状态
// 规则：每个用户每个帖子只能点赞一次，可以取消点赞后重新点赞
const likeMap = ref<Record<number, boolean>>({})
const userMap = ref<Record<number, API.UserVO>>({})
const defaultCover = '/placeholder.svg'
const defaultAvatar = '/placeholder.svg'

// 画廊与放大镜状态
const galleryImages = ref<string[]>([])
const activeImageIndex = ref(0)
const lightboxVisible = ref(false)

function isVideoUrl(url?: string) {
  if (!url) return false
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url)
}

function openLightbox(index = 0) {
  activeImageIndex.value = index
  lightboxVisible.value = true
}

function closeLightbox() {
  lightboxVisible.value = false
}

function prevLightbox() {
  if (galleryImages.value.length === 0) return
  activeImageIndex.value = (activeImageIndex.value - 1 + galleryImages.value.length) % galleryImages.value.length
}

function nextLightbox() {
  if (galleryImages.value.length === 0) return
  activeImageIndex.value = (activeImageIndex.value + 1) % galleryImages.value.length
}

// 详情浮窗相关
const detailModalOpen = ref(false)
const detailPost = ref<API.PostVO | null>(null)
const likeLoading = ref(false)
const favoriteLoading = ref(false)

// 评论相关
const modalCommentList = ref<API.Comment[]>([])
const modalNewComment = ref('')
const modalCommentLoading = ref(false)
const commentRefreshing = ref(false)
const commentListRef = ref<HTMLElement>()

const displayedPosts = computed(() => {
  const list = postList.value || []
  return list
})

// 获取排序标签
function getSortLabel(sortField: string) {
  const sortOption = sortOptions.find((s) => s.value === sortField)
  return sortOption?.label || '最新帖子'
}

// 获取帖子描述（截取前100个字符）
function getPostDescription(content?: string) {
  if (!content) return '暂无内容'
  return content.length > 100 ? content.substring(0, 100) + '...' : content
}

// 注意：formatTime函数已移至 @/util/timeUtils 统一管理

// 获取用户头像
function getUserAvatar(userId?: number) {
  if (!userId) return null
  return userMap.value[userId]?.userAvatar
}

// 获取用户名
function getUserName(userId?: number) {
  if (!userId) return null
  return userMap.value[userId]?.userName
}

// 获取用户信息
async function fetchUserInfo(userId: number) {
  if (userMap.value[userId]) return

  try {
    const res = await getUserVoById({ id: userId })
    if (res.data.code === 0 && res.data.data) {
      userMap.value[userId] = res.data.data
    }
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

// 检查点赞状态
async function checkLikeStatus(postId: number) {
  try {
    const res = await checkPostLike({ postId })
    likeMap.value[postId] = !!res.data.data
  } catch (error) {
    console.error('检查点赞状态失败:', error)
  }
}

// 检查收藏状态
async function checkFavoriteStatus(postId: number) {
  try {
    const res = await checkPostFavorite({ postId })
    favoriteMap.value[postId] = !!res.data.data
  } catch (error) {
    console.error('检查收藏状态失败:', error)
  }
}

// 获取评论列表
async function fetchModalComments() {
  if (!detailPost.value?.id) return

  try {
    const res = await listCommentByPage({
      postId: detailPost.value.id,
      current: 1,
      pageSize: 50,
    })

    if (res.data.code === 0 && res.data.data) {
      modalCommentList.value = res.data.data.records || []

      // 获取评论用户信息
      if (modalCommentList.value.length > 0) {
        const userIds = [
          ...new Set(
            modalCommentList.value
              .map((c: API.Comment) => c.userId)
              .filter((id): id is number => Boolean(id)),
          ),
        ]
        await Promise.all(userIds.map((id: number) => fetchUserInfo(id)))
      }
    } else {
      modalCommentList.value = []
    }
  } catch (error) {
    console.error('获取评论列表失败:', error)
    modalCommentList.value = []
  }
}

// 关闭详情浮窗
function closeDetailModal() {
  detailModalOpen.value = false
  detailPost.value = null
  modalCommentList.value = []
  modalNewComment.value = ''
}

// 提交评论
async function submitModalComment() {
  if (!detailPost.value?.id || !modalNewComment.value.trim()) return

  modalCommentLoading.value = true
  try {
    const res = await addComment({
      content: modalNewComment.value.trim(),
      postId: detailPost.value.id,
    })
    if (res.data.code === 0 && res.data.data) {
      message.success('评论成功')
      modalNewComment.value = ''
      // 重新获取评论列表
      await fetchModalComments()
      // 滚动到评论列表底部
      setTimeout(() => {
        scrollToBottom()
      }, 100)
    } else {
      message.error('评论失败：' + (res.data.message || ''))
    }
  } catch (error) {
    console.error('评论失败:', error)
    message.error('评论失败，请重试')
  } finally {
    modalCommentLoading.value = false
  }
}

// 清空评论输入
function clearComment() {
  modalNewComment.value = ''
}

// 刷新评论列表
async function refreshComments() {
  if (!detailPost.value?.id) return

  commentRefreshing.value = true
  try {
    await fetchModalComments()
    message.success('评论列表已刷新')
  } catch (error) {
    console.error('刷新评论失败:', error)
    message.error('刷新失败，请重试')
  } finally {
    commentRefreshing.value = false
  }
}

// 滚动到评论列表底部
function scrollToBottom() {
  if (commentListRef.value) {
    commentListRef.value.scrollTop = commentListRef.value.scrollHeight
  }
}

// 获取分类列表
async function fetchCategories() {
  try {
    const res = await listAllCategories()
    if (res.data.code === 0 && res.data.data) {
      categories.value = res.data.data
      console.log('获取到的分类列表:', res.data.data)
    } else {
      console.warn('获取分类列表失败:', res.data.message)
    }
  } catch (error) {
    console.error('获取分类列表失败:', error)
    message.error('获取分类列表失败，请重试')
  }
}

// 获取所有标签
async function fetchAllTags() {
  try {
    const res = await getAllTags()
    if (res.data.code === 0 && res.data.data) {
      tags.value = res.data.data
      updateTagOptions()
      buildTagNameToIdMap()
      console.log('获取到的标签列表:', res.data.data)
    } else {
      console.warn('获取标签列表失败:', res.data.message)
    }
  } catch (error) {
    console.error('获取标签列表失败:', error)
  }
}

// 获取热门标签
async function fetchHotTags() {
  try {
    const res = await getHotTags({ limit: 10 })
    if (res.data.code === 0 && res.data.data) {
      hotTags.value = res.data.data
      hotTagOptions.value = res.data.data.map((tag) => ({
        label: tag.name || '',
        value: tag.name || '',
      }))
      console.log('获取到的热门标签:', res.data.data)
    } else {
      console.warn('获取热门标签失败:', res.data.message)
    }
  } catch (error) {
    console.error('获取热门标签失败:', error)
  }
}

// 更新标签选项
function updateTagOptions() {
  tagOptions.value = tags.value.map((tag) => ({
    label: tag.name || '',
    value: tag.name || '',
  }))
}

// 构建标签名称到ID的映射
function buildTagNameToIdMap() {
  tagNameToIdMap.value = {}
  tags.value.forEach((tag) => {
    if (tag.name && tag.id) {
      tagNameToIdMap.value[tag.name] = tag.id
    }
  })
  console.log('标签名称到ID映射:', tagNameToIdMap.value)
}

// 标签搜索处理
async function handleTagSearch(value: string) {
  tagSearchKeyword.value = value
  if (value.trim()) {
    tagsLoading.value = true
    try {
      const res = await searchTags({ keyword: value })
      if (res.data.code === 0 && res.data.data) {
        tags.value = res.data.data
        updateTagOptions()
        buildTagNameToIdMap()
      }
    } catch (error) {
      console.error('搜索标签失败:', error)
    } finally {
      tagsLoading.value = false
    }
  } else {
    // 如果搜索词为空，显示所有标签
    await fetchAllTags()
  }
}

// 标签选择变化处理
function onTagsChange(value: string[]) {
  createForm.tags = value
  console.log('选择的标签:', value)
}

// 标签筛选变化处理
async function handleTagFilterChange(value: string[]) {
  searchParams.selectedTags = value
  console.log('筛选标签:', value)
  query.current = 1 // 重置到第一页
  await fetchPosts()
}

// 搜索功能
async function handleSearch() {
  query.current = 1
  await fetchPosts()
}

// 重置搜索
function handleReset() {
  searchParams.keyword = ''
  searchParams.sortField = 'latest'
  searchParams.categoryId = ''
  searchParams.selectedTags = []
  query.current = 1
  fetchPosts()
}

// 分类切换
async function handleCategoryChange(categoryId: string | number | undefined) {
  console.log('分类切换:', categoryId, '类型:', typeof categoryId)
  searchParams.categoryId = categoryId ? String(categoryId) : ''
  console.log('设置后的searchParams.categoryId:', searchParams.categoryId)
  query.current = 1
  await fetchPosts()
}

// 排序切换
async function handleSortChange(sortField: string) {
  searchParams.sortField = sortField
  query.current = 1
  await fetchPosts()
}

// 移除单个标签
// 移除不需要的函数

// 筛选按钮点击
function handleFilterClick() {
  // 可以在这里添加一些逻辑，比如显示筛选面板
  console.log('筛选按钮被点击')
}

// 排序菜单点击处理
async function handleSortMenuClick({ key }: { key: string }) {
  filterLoading.value = true

  try {
    await handleSortChange(key)
  } finally {
    filterLoading.value = false
  }
}

async function fetchPosts() {
  // 防抖：避免短时间内重复请求
  const now = Date.now()
  if (now - lastRequestTime.value < 300) {
    return
  }
  lastRequestTime.value = now

  loading.value = true
  try {
    // 构建查询参数
    const queryParams: API.PostQueryRequest = {
      current: query.current,
      pageSize: query.pageSize,
      sortField: searchParams.sortField,
    }

    // 只有非空值才添加到查询参数中
    if (searchParams.keyword && searchParams.keyword.trim()) {
      queryParams.keyword = searchParams.keyword.trim()
    }

    if (searchParams.categoryId && searchParams.categoryId !== '') {
      queryParams.categoryId = Number(searchParams.categoryId)
    }

    console.log('查询参数:', queryParams)

    // 根据搜索条件和排序选择不同的API
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let res: any = null
    if (searchParams.selectedTags && searchParams.selectedTags.length > 0) {
      // 有标签筛选，使用专门的标签搜索接口
      console.log('标签筛选参数:', {
        selectedTags: searchParams.selectedTags,
        queryParams: queryParams,
      })

      // 确保包含必需的keyword字段和标签名称
      const tagSearchParams = {
        ...queryParams,
        keyword: searchParams.keyword || '',
        tagNames: searchParams.selectedTags,
      }

      try {
        // 使用按标签名称搜索的专门接口
        console.log('按标签名称搜索:', searchParams.selectedTags)
        console.log('搜索参数:', tagSearchParams)
        res = await searchPostsByTagNames(tagSearchParams)
      } catch (error) {
        console.warn('按标签名称搜索失败，尝试按标签ID搜索:', error)

        // 如果按名称搜索失败，尝试按标签ID搜索
        const tagIds = searchParams.selectedTags
          .map((tagName) => tagNameToIdMap.value[tagName])
          .filter((id) => id !== undefined)

        if (tagIds.length > 0) {
          console.log('按标签ID搜索:', tagIds)
          const tagIdSearchParams = {
            ...queryParams,
            keyword: searchParams.keyword || '',
            tagIds: tagIds,
          }
          console.log('标签ID搜索参数:', tagIdSearchParams)
          res = await searchPostsByTagIds(tagIdSearchParams)
        } else {
          throw new Error('无法找到标签ID，搜索失败')
        }
      }
    } else if (searchParams.keyword?.trim()) {
      // 有关键词搜索，使用searchPosts接口
      res = await searchPosts(queryParams)
    } else if (searchParams.categoryId && searchParams.categoryId !== '') {
      // 只有分类筛选，使用listPostByCategory接口
      res = await listPostByCategory(queryParams)
    } else {
      // 根据排序字段选择对应的接口
      switch (searchParams.sortField) {
        case 'latest':
          res = await getLatestPosts(queryParams)
          break
        case 'mostLiked':
          res = await getMostLikedPosts(queryParams)
          break
        case 'mostViewed':
          res = await getMostViewedPosts(queryParams)
          break
        case 'mostCommented':
          res = await getMostCommentedPosts(queryParams)
          break
        default:
          // 默认使用最新帖子
          res = await getLatestPosts(queryParams)
      }
    }

    console.log('API响应:', res)

    if (res.data.code === 0 && res.data.data) {
      postList.value = res.data.data.records ?? []
      total.value = Number(res.data.data.total) ?? 0

      // 批量获取帖子的收藏和点赞状态
      await Promise.all(
        (postList.value || []).map(async (p) => {
          if (!p.id) return

          // 获取收藏状态
          try {
            const favRes = await checkPostFavorite({ postId: p.id })
            favoriteMap.value[p.id] = !!favRes.data.data
          } catch {}

          // 获取点赞状态
          try {
            const likeRes = await checkPostLike({ postId: p.id })
            likeMap.value[p.id] = !!likeRes.data.data
          } catch {}
        }),
      )
    } else {
      const errorMsg = res.data.message || '未知错误'
      console.error('API返回错误:', res.data)
      message.error('加载帖子失败：' + errorMsg)
    }
  } catch (error) {
    console.error('获取帖子列表失败:', error)
    message.error('网络错误，请检查网络连接后重试')
  } finally {
    loading.value = false
  }
}

function onPageChange(page: number) {
  query.current = page
  fetchPosts()
}

function onSizeChange(_: number, size: number) {
  query.pageSize = size
  query.current = 1
  fetchPosts()
}

async function openDetail(post: API.PostVO) {
  if (!post.id) return

  detailPost.value = post
  detailModalOpen.value = true

  // 获取用户信息（PostVO已包含作者信息，无需额外获取）
  // 如果需要更多信息可以根据authorName获取

  // 获取点赞和收藏状态
  await Promise.all([checkLikeStatus(post.id), checkFavoriteStatus(post.id), fetchModalComments()])

  // 准备画廊数据：优先使用帖子自己的图片列表或 coverUrl；否则使用示例图片三张
  try {
    // 提示：这里最终应由后端返回图片列表并赋值给 galleryImages。当前使用本地占位图作为演示。
    const imgs: string[] = []
    // 假定后端可能返回 pictureUrls 或 images 字段
    // 兼容性处理：优先使用常见字段，否则 fallback 到 coverUrl
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const anyPost: any = post as any
    if (Array.isArray(anyPost.pictureUrls) && anyPost.pictureUrls.length > 0) {
      anyPost.pictureUrls.forEach((u: string) => imgs.push(u))
    } else if (Array.isArray(anyPost.images) && anyPost.images.length > 0) {
      anyPost.images.forEach((u: string) => imgs.push(u))
    } else if (post.coverUrl) {
      imgs.push(post.coverUrl)
    }

    // 如果最终没有图片，则用示例图片重复三次展示效果（第一张为封面）
    if (imgs.length === 0) {
      imgs.push(sampleImg, sampleImg, sampleImg)
    }

    galleryImages.value = imgs
    activeImageIndex.value = 0
  } catch (error) {
    console.error('准备画廊数据失败:', error)
    galleryImages.value = [sampleImg, sampleImg, sampleImg]
    activeImageIndex.value = 0
  }
}

/**
 * 切换点赞状态
 * 规则：
 * 1. 每个用户每个帖子只能点赞一次
 * 2. 已点赞的帖子可以取消点赞
 * 3. 取消点赞后可以重新点赞
 * 4. 点赞数量显示所有用户的总点赞数
 */
async function toggleLike(post: API.PostVO) {
  if (!post.id) return
  const isLiked = likeMap.value[post.id]

  likeLoading.value = true
  try {
    if (isLiked) {
      // 取消点赞
      await unlikePost({ postId: post.id })
      likeMap.value[post.id] = false
      // 更新本地点赞数量
      if (post.likeCount && post.likeCount > 0) {
        post.likeCount = post.likeCount - 1
      }
      message.success('已取消点赞')
    } else {
      // 点赞
      await likePost({ postId: post.id })
      likeMap.value[post.id] = true
      // 更新本地点赞数量
      post.likeCount = (post.likeCount || 0) + 1
      message.success('已点赞')
    }
  } catch (error) {
    console.error('点赞操作失败:', error)
    message.error('操作失败，请重试')
  } finally {
    likeLoading.value = false
  }
}

// 切换收藏状态
async function toggleFavorite(post: API.PostVO) {
  if (!post.id) return
  const isFavorited = favoriteMap.value[post.id]

  favoriteLoading.value = true
  try {
    if (isFavorited) {
      // 取消收藏
      await unfavoritePost({ postId: post.id })
      favoriteMap.value[post.id] = false
      message.success('已取消收藏')
    } else {
      // 收藏
      await favoritePost({ postId: post.id })
      favoriteMap.value[post.id] = true
      message.success('已收藏')
    }
  } catch (error) {
    console.error('收藏操作失败:', error)
    message.error('操作失败，请重试')
  } finally {
    favoriteLoading.value = false
  }
}

// 列表项由瀑布流直接渲染

// 创建帖子
const showCreate = ref(false)
const creating = ref(false)
const suggesting = ref(false)
const createForm = reactive<{
  title: string
  content: string
  coverInputUrl?: string
  coverUrl?: string
  categoryId?: number
  tags?: string[]
}>({ title: '', content: '', coverInputUrl: '', coverUrl: '', categoryId: undefined, tags: [] })

// 打开创建帖子模态框时确保标签已加载
function handleCreateModalOpen() {
  if (tagOptions.value.length === 0) {
    fetchAllTags()
  }
}

// 封面上传相关
const coverFileList = ref<UploadProps['fileList']>([])
const coverPreviewVisible = ref(false)
const coverPreviewImage = ref('')
const coverPreviewTitle = ref('')
const coverUploading = ref(false)

async function suggestTitle() {
  if (!createForm.content?.trim()) {
    message.info('请先填写内容')
    return
  }
  suggesting.value = true
  try {
    const res = await chat({
      message: `请为以下内容生成一个简洁的中文标题：\n\n${createForm.content}`,
    })
    if (res?.data?.data?.success && res.data.data.content) {
      createForm.title = res.data.data.content
    } else {
      message.error('生成标题失败：' + (res?.data?.data?.errorMessage || '未知错误'))
    }
  } catch {
    message.error('生成标题失败')
  } finally {
    suggesting.value = false
  }
}

// 封面上传相关函数

// 上传前检查
function beforeCoverUpload(file: File) {
  // 检查文件类型
  const isJpgOrPng =
    file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
  if (!isJpgOrPng) {
    message.error('只能上传 JPG/PNG 格式的图片!')
    return false
  }

  // 检查文件大小
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过 2MB!')
    return false
  }

  // 检查文件名
  if (!file.name || file.name.trim() === '') {
    message.error('文件名不能为空!')
    return false
  }

  return true
}

// 自定义上传处理 - 使用 FormData 直接上传文件
async function handleCoverUpload(options: {
  file: File
  onSuccess: (response: unknown) => void
  onError: (error: unknown) => void
}) {
  const { file, onSuccess, onError } = options

  coverUploading.value = true
  try {
    // 创建 FormData 对象
    const formData = new FormData()
    formData.append('file', file)
    formData.append('picName', file.name)

    // 使用 axios 上传文件
    const result = await request.post('/picture/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    if (result.data?.code === 0 && result.data?.data) {
      // 上传成功，更新封面URL
      createForm.coverUrl = result.data.data.url
      onSuccess(result.data.data)
      message.success('封面上传成功')
    } else {
      throw new Error(result.data?.message || '上传失败')
    }
  } catch (error: unknown) {
    console.error('封面上传失败:', error)

    // 根据不同的错误类型显示不同的提示信息
    let errorMessage = '封面上传失败，请重试'

    if (error && typeof error === 'object' && 'message' in error) {
      const errorMsg = (error as { message: string }).message
      if (errorMsg.includes('没有空间权限')) {
        errorMessage = '没有上传权限，请联系管理员'
      } else if (errorMsg.includes('文件地址格式不正确')) {
        errorMessage = '文件格式不支持，请选择JPG或PNG格式的图片'
      } else if (errorMsg.includes('文件大小')) {
        errorMessage = '文件过大，请选择小于2MB的图片'
      } else if (errorMsg.includes('Network Error')) {
        errorMessage = '网络错误，请检查网络连接后重试'
      } else if (errorMsg.includes('404')) {
        errorMessage = '上传接口不存在，请联系管理员'
      } else if (errorMsg.includes('Unexpected end of JSON input')) {
        errorMessage = '服务器响应格式错误，请重试'
      } else if (errorMsg.includes('无权限')) {
        errorMessage = '没有上传权限，请联系管理员或检查账户状态'
      } else {
        errorMessage = `上传失败：${errorMsg}`
      }
    }

    message.error(errorMessage)
    onError(error)
  } finally {
    coverUploading.value = false
  }
}

// 封面预览
const handleCoverPreview = async (file: UploadFile) => {
  if (!file.url && !file.preview && file.originFileObj) {
    // 使用 URL.createObjectURL 创建预览URL，避免base64编码
    file.preview = URL.createObjectURL(file.originFileObj)
  }
  coverPreviewImage.value = file.url || file.preview || ''
  coverPreviewVisible.value = true
  coverPreviewTitle.value =
    file.name || (file.url ? file.url.substring(file.url.lastIndexOf('/') + 1) : '') || ''
}

// 封面变化处理
function handleCoverChange(info: { file: { status: string; response?: { url: string } } }) {
  if (info.file.status === 'done') {
    // 上传完成，更新封面URL
    if (info.file.response?.url) {
      createForm.coverUrl = info.file.response.url
    }
  } else if (info.file.status === 'error') {
    message.error('封面上传失败')
  }
}

// 取消封面预览
function handleCoverCancel() {
  coverPreviewVisible.value = false
  coverPreviewTitle.value = ''
}

// 分类选择变化处理
function onCategoryChange(value: number | undefined) {
  console.log('分类选择变化:', value, '类型:', typeof value)
  console.log('当前分类列表:', categories.value)
  createForm.categoryId = value
}

async function handleCreate() {
  if (!createForm.title?.trim() || !createForm.content?.trim()) {
    message.info('请填写标题和内容')
    return
  }

  if (createForm.categoryId === undefined || createForm.categoryId === null) {
    message.info('请选择分类')
    return
  }

  // 检查分类ID是否在有效范围内
  const validCategoryIds = categories.value.map((c) => c.id).filter((id) => id !== undefined)
  if (!validCategoryIds.includes(createForm.categoryId)) {
    message.error('请选择有效的分类')
    return
  }
  creating.value = true
  try {
    const postData = {
      title: createForm.title.trim(),
      content: createForm.content.trim(),
      coverUrl: createForm.coverUrl?.trim() || undefined,
      categoryId: Number(createForm.categoryId),
      tags: createForm.tags || [],
    }

    console.log('发送到后端的帖子数据:', postData)
    console.log('当前分类列表:', categories.value)
    const res = await addPost(postData)
    if (res.data.code === 0 && res.data.data) {
      message.success('发布成功')
      showCreate.value = false
      // 重置表单
      createForm.title = ''
      createForm.content = ''
      createForm.coverInputUrl = ''
      createForm.coverUrl = ''
      createForm.categoryId = undefined
      createForm.tags = []
      fetchPosts()
    } else {
      message.error('发布失败：' + (res.data.message || ''))
    }
  } catch {
    message.error('发布失败')
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  fetchCategories()
  fetchAllTags()
  fetchHotTags()
  fetchPosts()
})

// 返回模态框挂载容器（避免在模板中直接访问 document 导致类型检查错误）
const getModalContainer = () => {
  // 在 SSR 或特殊环境下 document 可能不可用，做保护判断
  return typeof document !== 'undefined' ? document.body : undefined
}
</script>

<style scoped>
/* 新增全局层级控制：将详情模态框挂载到 body，并确保其覆盖侧边栏 */
.detail-modal {
  position: fixed !important;
  z-index: 3000 !important; /* 高于侧边栏 */
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100vw !important;
  height: 100vh !important;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 6vh; /* 让 modal 离顶部有一定间距 */
  pointer-events: auto;
}

/* 确保模态框内容在最上层 */
.detail-modal :deep(.ant-modal-content) {
  position: relative;
  z-index: 3001 !important;
  max-width: 1200px !important;
  width: calc(100% - 32px) !important;
}


.header-container {
  display: flex;
  align-items: center;
  gap: 16px; /* 设置元素间距 */
  margin-bottom: 16px; /* 保持与下方内容的间距 */
}

.forum-page {
  padding: 16px;
  animation: fadeIn 0.6s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 论坛顶部区域 */
.forum-header {
  margin-bottom: 2rem;
  animation: fadeIn 0.6s ease;
}

/* 搜索和发布行 */
.search-publish-row {
  width: 60%;
  max-width: 900px;
  margin: 0 auto 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border-radius: 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }
  
  @supports not (backdrop-filter: blur(20px)) {
    background: rgba(255, 255, 255, 0.95);
  }
}

.search-container {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.main-search-input {
  flex: 1;
  
  :deep(.ant-input-search) {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 18px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(102, 126, 234, 0.3);
    }
    
    &:focus-within {
      border-color: #667eea;
      box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.08);
    }
  }
  
  :deep(.ant-input) {
    border: none;
    background: transparent;
    font-size: 15px;
    
    &::placeholder {
      color: #a0aec0;
    }
  }
  
  :deep(.ant-input-search-button) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    border-radius: 0 15px 15px 0;
    color: #fff;
    font-weight: 600;
    transition: all 0.3s ease;
    
    &:hover {
      background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
    }
  }
}

.sort-select {
  width: 100px;
  
  :deep(.ant-select-selector) {
    background: rgba(255, 255, 255, 0.95);
    border: 2px solid rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    height: 40px;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: rgba(102, 126, 234, 0.3);
      background: rgba(102, 126, 234, 0.05);
    }
  }
  
  :deep(.ant-select-focused .ant-select-selector) {
    border-color: #667eea !important;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.08) !important;
    background: rgba(102, 126, 234, 0.05);
  }
  
  :deep(.ant-select-selection-item) {
    font-weight: 600;
    color: #667eea;
  }
  
  .sort-icon {
    width: 16px;
    height: 16px;
    opacity: 0.6;
  }
}

/* 发布按钮 */
.publish-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  height: 40px;
  padding: 0 20px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  
  .btn-icon {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
  }
  
  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.35);
    transform: translateY(-2px);
  }
}

/* 移除不需要的筛选相关样式 */

.reset-btn {
  flex-shrink: 0; /* 防止按钮被压缩 */
}

.sort-wrapper {
  flex-shrink: 0; /* 防止被压缩 */
}

.reset-btn {
  min-width: 100px;
  height: 40px;
  border-radius: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    border-color: #667eea;
    color: #5568d3;
  }
}

.search-row {
  display: flex;
  align-items: center;
  justify-content: space-between; /* 让左右两部分分开 */
  gap: 16px; /* 元素间距 */
}

.search-container {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1; /* 占据剩余空间 */
}

.toolbar {
  flex-shrink: 0; /* 防止被压缩 */
}

/* 发布按钮渐变样式 */
.publish-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  height: 40px;
  padding: 0 24px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }
  
  .btn-icon {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
  }
}



/* 分类和筛选区域样式 */
.filter-section {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 1rem;
}

/*.filter-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 16px;
}*/

.filter-container {
  margin-bottom: 16px;
}

/* 分类标签页样式 - 玻璃拟态胶囊设计 */
.category-tabs-wrapper {
  flex: 1;
  min-width: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 20px;
  padding: 8px;
  backdrop-filter: blur(10px);
}

.category-tabs {
  width: 100%;
}

:deep(.ant-tabs-nav) {
  margin-bottom: 0;
  
  &::before {
    border: none; /* 移除默认下边框 */
  }
}

:deep(.ant-tabs-tab) {
  padding: 10px 20px;
  font-weight: 600;
  border-radius: 12px;
  margin: 0 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: transparent;
  border: none;
  color: #718096;
  
  &:hover {
    color: #667eea;
    background: rgba(255, 255, 255, 0.6);
  }
}

:deep(.ant-tabs-tab-active) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: #fff !important;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  
  .ant-tabs-tab-btn {
    color: #fff !important;
  }
}

:deep(.ant-tabs-ink-bar) {
  display: none; /* 隐藏默认指示器，使用渐变背景替代 */
}

/* 排序筛选样式 - 玻璃拟态按钮 */
.sort-wrapper {
  flex-shrink: 0;
}

.sort-dropdown {
  border-radius: 12px;
  min-width: 140px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid rgba(102, 126, 234, 0.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-weight: 600;
  color: #667eea;
  
  &:hover {
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
    border-color: #667eea;
    transform: translateY(-2px);
    background: rgba(102, 126, 234, 0.05);
  }
  
  :deep(.ant-btn-icon) {
    filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
  }
}

/* 菜单项活跃状态 - 渐变背景 */
:deep(.ant-menu-item.active) {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%) !important;
  color: #667eea !important;
  border-radius: 8px;
  font-weight: 600;
}

:deep(.ant-menu-item.active .ant-menu-item-icon) {
  color: #667eea !important;
}

:deep(.ant-menu-item:hover) {
  background: rgba(102, 126, 234, 0.08) !important;
  border-radius: 8px;
}

.row-actions {
  margin: 8px 0 0;
}
.upload-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.small-tip {
  color: #52c41a;
}

/* 图片上传区域样式 */
.upload-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.upload-method {
  padding: 16px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  text-align: center;
  transition: border-color 0.3s ease;
}

.upload-method:hover {
  border-color: #1890ff;
}

.cover-preview {
  position: relative;
  max-width: 200px;
  margin: 0 auto;
}

.cover-preview img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.toolbar {
  display: flex;
  justify-content: flex-end;
}

.preview-actions {
  margin-top: 8px;
  text-align: center;
}

/* 响应式网格布局 */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 0 10px;
}

/* 帖子卡片 - 玻璃拟态设计（复用仪表板风格） */
.post-card {
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  will-change: transform;
  contain: layout style paint;
  
  /* 玻璃拟态效果 */
  @supports (backdrop-filter: blur(10px)) {
    background: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(10px) saturate(150%);
    -webkit-backdrop-filter: blur(10px) saturate(150%);
  }
}

.post-card:hover {
  transform: translate3d(0, -8px, 0);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

/* 第一部分：图片区域 - 优化版 */
.post-image {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  background: linear-gradient(135deg, #f7f7f7 0%, #e8e8e8 100%);
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
  transform: translate3d(0, 0, 0);
}

.post-card:hover .post-image img {
  transform: translate3d(0, 0, 0) scale(1.08);
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 12px;
  transition: background 0.3s ease;
}

.post-card:hover .image-overlay {
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%);
}

.view-count {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  
  .count-icon {
    width: 14px;
    height: 14px;
    filter: brightness(0) invert(1);
  }
}

/* 第二部分：内容描述 */
.post-content {
  padding: 16px;
  flex: 1;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 帖子标签样式 - 渐变胶囊 */
.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.post-tag {
  font-size: 12px;
  border-radius: 16px;
  padding: 4px 12px;
  font-weight: 600;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border: 1px solid rgba(102, 126, 234, 0.2);
  color: #667eea;
  transition: all 0.3s ease;
  
  &:hover {
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
    transform: translateY(-2px);
  }
}

.more-tags {
  font-size: 12px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  padding: 4px 12px;
  border-radius: 16px;
  border: 1px solid rgba(102, 126, 234, 0.15);
  font-weight: 600;
}

.post-stats {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #999;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 第三部分：用户信息和点赞功能 - 优化版 */
.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(247, 247, 247, 0.5) 100%);
  backdrop-filter: blur(5px);
}

.user-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e0e0e0;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  line-height: 1.2;
}

.publish-time {
  font-size: 11px;
  color: #999;
  line-height: 1.2;
}

.like-section {
  display: flex;
  align-items: center;
}

.like-section .ant-btn {
  padding: 6px 12px;
  height: auto;
  border: 2px solid rgba(102, 126, 234, 0.2);
  background: rgba(255, 255, 255, 0.9);
  color: #667eea;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.like-section .ant-btn:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.like-section .ant-btn.liked {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7a45 100%);
  border-color: #ff4d4f;
  color: #fff;
  
  &:hover {
    background: linear-gradient(135deg, #ff7875 0%, #ffa940 100%);
  }
}

.like-count {
  font-size: 13px;
  font-weight: 600;
}

.like-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
  transition: all 0.3s ease;
}

.ant-btn.liked .like-icon {
  filter: brightness(0) invert(1);
  animation: likeAnimation 0.3s ease;
}

@keyframes likeAnimation {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.3);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 16px;
}

.detail-modal {
  /* 保持上方定义，避免重复 transform 导致 stacking/context 问题 */
  top: 0 !important;
  transform: none !important;
  z-index: 3000 !important;
}

.detail-modal :deep(.ant-modal-content) {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 20px 80px rgba(0, 0, 0, 0.15);
}

.detail-modal :deep(.ant-modal-body) {
  padding: 0 !important;
  height: 85vh !important;
  overflow: hidden !important;
  max-height: 750px !important;
}

.detail-modal-container {
  display: flex;
  height: 100%;
  gap: 24px;
}

/* 左侧图片区域 */
.modal-image-section {
  flex: 1;
  max-width: 400px;
}

.modal-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f7f7f7;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.modal-main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.modal-image-container:hover .modal-main-image {
  transform: scale(1.02);
}

.modal-image-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
}

.modal-view-count {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 右侧内容区域 */
.modal-content-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
}

/* 帖子信息区域 - 玻璃拟态 */
.modal-post-info {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.modal-post-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  line-height: 1.4;
}

/* 模态框标签样式 */
.modal-post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.modal-tag {
  font-size: 13px;
  border-radius: 16px;
  padding: 4px 12px;
}

/* 标签提示样式 */
.tag-tips {
  margin-top: 8px;
}

.tag-tip {
  font-size: 12px;
  color: #666;
  background: #f0f8ff;
  padding: 4px 8px;
  border-radius: 4px;
  border-left: 3px solid #1890ff;
}

.modal-user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

.modal-user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.modal-user-name {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.modal-publish-time {
  font-size: 12px;
  color: #999;
}

.modal-post-content {
  margin-bottom: 16px;
}

.modal-post-content p {
  font-size: 14px;
  line-height: 1.6;
  color: #333;
  margin: 0;
  white-space: pre-wrap;
}

.modal-action-buttons {
  display: flex;
  gap: 12px;
}

.modal-action-buttons .ant-btn {
  height: 40px;
  padding: 0 20px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.15);
  }
}

.modal-action-buttons .ant-btn.liked {
  background: linear-gradient(135deg, #ff4d4f 0%, #ff7a45 100%);
  border-color: #ff4d4f;
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #ff7875 0%, #ffa940 100%);
  }
}

.modal-action-buttons .ant-btn.favorited {
  background: linear-gradient(135deg, #faad14 0%, #ffc53d 100%);
  border-color: #faad14;
  color: white;
  
  &:hover {
    background: linear-gradient(135deg, #ffc53d 0%, #ffd666 100%);
  }
}

/* 评论区 - 玻璃拟态 */
.modal-comment-section {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.modal-comment-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comment-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
}

.refresh-icon {
  width: 14px;
  height: 14px;
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(230deg) brightness(97%) contrast(90%);
}

.send-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0) invert(1);
}

.action-icon {
  width: 18px;
  height: 18px;
  filter: brightness(0) invert(1);
}

.refresh-btn {
  color: #667eea;
  font-size: 13px;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(102, 126, 234, 0.1);
    color: #5568d3;
  }
}

.modal-comment-input {
  margin-bottom: 16px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(250, 250, 250, 0.5) 100%);
  border-radius: 12px;
  padding: 20px;
  border: 2px solid rgba(102, 126, 234, 0.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.comment-input-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.input-label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.char-count {
  font-size: 12px;
  color: #999;
}

.comment-textarea {
  border: 2px solid transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  
  &:hover {
    border-color: rgba(102, 126, 234, 0.3);
  }
  
  &:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
  }
}

.comment-textarea.has-content {
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.modal-comment-actions {
  margin-top: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-btn {
  color: #999;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    background: linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
    transform: translateY(-2px);
  }
}

.modal-comment-list {
  flex: 1;
  overflow-y: auto;
  max-height: 200px;
  padding-right: 8px;
}

.modal-comment-list::-webkit-scrollbar {
  width: 4px;
}

.modal-comment-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.modal-comment-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.modal-comment-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.modal-comment-item {
  display: flex;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 8px;
}

.modal-comment-item:last-child {
  border-bottom: none;
}

.modal-comment-item:hover {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.modal-comment-item.new-comment {
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 8px;
  padding: 16px 8px;
  margin: 0 -8px;
  animation: highlight 2s ease-out;
}

@keyframes highlight {
  0% {
    background: #f6ffed;
  }
  100% {
    background: transparent;
  }
}

.comment-avatar-container {
  position: relative;
  flex-shrink: 0;
}

.modal-comment-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e8e8e8;
}

.modal-comment-content {
  flex: 1;
  min-width: 0;
}

.comment-user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.comment-username {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.comment-location {
  font-size: 12px;
  color: #999;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 10px;
}

.comment-text {
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  white-space: pre-wrap;
  margin-bottom: 8px;
  word-break: break-word;
}

.comment-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.comment-time {
  font-size: 12px;
  color: #999;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #999;
  transition: color 0.3s ease;
}

.action-btn:hover {
  color: #ff2442;
}

.like-btn:hover .action-icon {
  transform: scale(1.1);
}

.action-icon {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.action-count {
  font-size: 12px;
}

.action-text {
  font-size: 12px;
}

/* 回复样式 */
.comment-replies {
  margin-top: 12px;
  padding-left: 12px;
  border-left: 2px solid #f0f0f0;
}

.reply-item {
  display: flex;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid #f8f8f8;
}

.reply-item:last-child {
  border-bottom: none;
}

.reply-avatar {
  flex-shrink: 0;
}

.reply-avatar-img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e8e8e8;
}

.reply-content {
  flex: 1;
  min-width: 0;
}

.reply-user-info {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.reply-username {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.reply-location {
  font-size: 11px;
  color: #999;
  background: #f5f5f5;
  padding: 1px 4px;
  border-radius: 8px;
}

.reply-text {
  font-size: 13px;
  line-height: 1.4;
  color: #333;
  white-space: pre-wrap;
  margin-bottom: 6px;
  word-break: break-word;
}

.reply-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.reply-time {
  font-size: 11px;
  color: #999;
}

.reply-actions {
  display: flex;
  gap: 12px;
}

.expand-replies {
  margin-top: 8px;
}

.expand-btn {
  background: none;
  border: none;
  color: #ff2442;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 0;
  transition: color 0.3s ease;
}

.expand-btn:hover {
  color: #ff2442;
  text-decoration: underline;
}

.modal-no-comments {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  margin: 0 0 8px 0;
  color: #666;
}

.empty-hint {
  font-size: 12px;
  margin: 0;
  color: #999;
}

/* ======================== 响应式设计 ======================== */

/* 大屏幕 */
@media (max-width: 1300px) {
  .detail-modal-container {
    flex-direction: column;
    gap: 16px;
  }

  .modal-image-section {
    max-width: none;
    height: 300px;
  }

  .modal-post-title {
    font-size: 18px;
  }

  .modal-action-buttons {
    flex-direction: column;
  }

  .modal-action-buttons .ant-btn {
    width: 100%;
  }
}

/* 平板 */
@media (max-width: 968px) {
  .search-publish-row {
    width: 85%;
    flex-direction: column;
    padding: 16px;
    gap: 12px;
  }
  
  .search-container {
    width: 100%;
  }
  
  .sort-select {
    width: 130px;
  }
  
  .publish-btn {
    width: 100%;
    justify-content: center;
    
    &:hover {
      transform: translateY(-2px);
    }
  }
  
  .category-tabs-wrapper {
    padding: 6px;
    border-radius: 16px;
  }
  
  :deep(.ant-tabs-tab) {
    padding: 8px 16px;
    font-size: 14px;
  }
}

/* 手机 */
@media (max-width: 768px) {
  .forum-page {
    padding: 12px;
  }
  
  .forum-header {
    margin-bottom: 1.5rem;
  }
  
  .search-publish-row {
    width: 95%;
    padding: 12px;
    border-radius: 16px;
    backdrop-filter: blur(8px) saturate(120%);
    -webkit-backdrop-filter: blur(8px) saturate(120%);
  }
  
  .main-search-input :deep(.ant-input) {
    font-size: 14px;
  }
  
  .sort-select {
    width: 120px;
    
    :deep(.ant-select-selector) {
      height: 36px;
    }
  }
  
  .publish-btn {
    height: 36px;
    padding: 0 16px;
    font-size: 14px;
    
    .btn-icon {
      width: 14px;
      height: 14px;
    }
  }
  
  /* 分类标签页滚动优化 */
  .category-tabs {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }

  :deep(.ant-tabs-nav) {
    overflow-x: auto;
    white-space: nowrap;
  }
  
  .grid {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 0;
  }
  
  .post-card {
    border-radius: 16px;
    
    @supports (backdrop-filter: blur(10px)) {
      backdrop-filter: blur(8px) saturate(130%);
    }
  }
  
  .post-content {
    padding: 14px;
  }
  
  .post-title {
    font-size: 16px;
  }
  
  .post-description {
    font-size: 13px;
  }
  
  .post-footer {
    padding: 12px 14px;
  }

  /* Detail Modal */
  .modal-image-section {
    height: 220px;
  }

  .modal-post-title {
    font-size: 16px;
  }
  
  .modal-post-info,
  .modal-comment-section {
    padding: 16px;
    border-radius: 12px;
  }
}

/* 小手机 */
@media (max-width: 576px) {
  .search-publish-row {
    width: 100%;
    padding: 10px;
  }
  
  .sort-select {
    width: 110px;
    
    :deep(.ant-select-selector) {
      height: 34px;
    }
    
    :deep(.ant-select-selection-item) {
      font-size: 13px;
    }
  }
  
  .publish-btn .btn-text {
    display: none;
  }
  
  .publish-btn {
    width: auto;
    padding: 0 12px;
  }
  
  .category-tabs-wrapper {
    padding: 4px;
  }

  :deep(.ant-tabs-tab) {
    padding: 6px 10px;
    font-size: 13px;
    margin: 0 2px;
  }

  .post-card {
    border-radius: 14px;
  }

  .post-image {
    height: 180px;
  }
  
  .post-title {
    font-size: 15px;
  }
  
  .post-description {
    font-size: 13px;
  }

  .post-footer {
    padding: 10px;
  }

  .like-section .ant-btn {
    font-size: 13px;
    padding: 6px 14px;
  }

  .modal-comment-section {
    max-height: 250px;
  }
}

/* 封面上传样式 */
.cover-upload {
  width: 100%;
}

.cover-upload :deep(.ant-upload-select-picture-card) {
  width: 104px;
  height: 104px;
  border-radius: 8px;
  border: 1px dashed #d9d9d9;
  background: #fafafa;
  transition: all 0.3s ease;
}

.cover-upload :deep(.ant-upload-select-picture-card:hover) {
  border-color: #1890ff;
  background: #f0f8ff;
}

.cover-upload :deep(.ant-upload-select-picture-card i) {
  font-size: 32px;
  color: #999;
}

.cover-upload :deep(.ant-upload-select-picture-card .ant-upload-text) {
  margin-top: 8px;
  color: #666;
  font-size: 12px;
}

.cover-upload :deep(.ant-upload-list-picture-card) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cover-upload :deep(.ant-upload-list-picture-card .ant-upload-list-item) {
  width: 104px;
  height: 104px;
  border-radius: 8px;
  overflow: hidden;
}

.cover-upload :deep(.ant-upload-list-picture-card .ant-upload-list-item-thumbnail) {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-upload :deep(.ant-upload-list-picture-card .ant-upload-list-item-actions) {
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.cover-upload :deep(.ant-upload-list-picture-card .ant-upload-list-item-actions .anticon) {
  color: white;
  font-size: 16px;
}

.cover-upload :deep(.ant-upload-list-picture-card .ant-upload-list-item-actions .anticon:hover) {
  color: #1890ff;
}

/* 画廊缩略图和 Lightbox 样式 */
.gallery-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.thumbnail-list {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  overflow-x: auto;
}

.thumbnail-item {
  width: 72px;
  height: 72px;
  border-radius: 8px;
  overflow: hidden;
  flex: 0 0 auto;
  cursor: pointer;
  border: 2px solid transparent;
}

.thumbnail-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumbnail-item.active {
  border-color: rgba(24, 144, 255, 0.9);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.12);
}

.lightbox-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 4000;
  flex-direction: column;
  padding: 40px 20px;
}

.lightbox-content {
  max-width: 1200px;
  max-height: 80vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.lightbox-media {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: 28px;
  right: 28px;
  background: rgba(255,255,255,0.06);
  border: none;
  color: #fff;
  font-size: 20px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  z-index: 4010;
}

.lightbox-prev, .lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255,255,255,0.04);
  border: none;
  color: #fff;
  font-size: 40px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 4010;
}

.lightbox-prev { left: 20px }
.lightbox-next { right: 20px }

.lightbox-thumbs {
  display: flex;
  gap: 8px;
  margin-top: 18px;
  max-width: 90vw;
  overflow-x: auto;
  padding-bottom: 6px;
}

.lightbox-thumb {
  width: 64px;
  height: 64px;
  border-radius: 6px;
  overflow: hidden;
  flex: 0 0 auto;
  opacity: 0.8;
  cursor: pointer;
  border: 2px solid transparent;
}

.lightbox-thumb.active { border-color: rgba(24,144,255,0.9); opacity: 1 }

@media (max-width: 768px) {
  .modal-image-section { height: 220px }
  .thumbnail-item { width: 56px; height: 56px }
  .lightbox-prev, .lightbox-next { width: 44px; height: 44px; font-size: 28px }
}
</style>
