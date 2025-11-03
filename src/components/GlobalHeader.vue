<template>
  <div class="header" role="navigation">
    <div class="header-container">
      <div class="header-content">
        <!-- Logo 区域 -->
        <div class="logo-section">
        </div>

        <!-- 用户信息区域 -->
        <div class="user-section">
          <div v-if="loginUserStore.loginUser.id" class="user-logged">
            <a-dropdown>
              <a-space class="user-info">
                <a-avatar
                  :src="loginUserStore.loginUser.userAvatar || 'src/assets/image.png'"
                  size="medium"
                />
                <span class="username">{{ loginUserStore.loginUser.userName ?? '用户' }}</span>
              </a-space>
              <template #overlay>
                <a-menu>
                  <a-menu-item @click="doLogout">
                    <LogoutOutlined />
                    退出登录
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
          </div>
          <div v-else class="user-actions">
            <a-button type="primary" href="/user/login">
              登录
            </a-button>
            <a-button href="/user/register">
              注册
            </a-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { LogoutOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { useLoginUserStore } from '@/stores/useLoginUserStore.ts'
import { userLogout } from '@/api/userController.ts'

const loginUserStore = useLoginUserStore()
const router = useRouter()

// 用户注销
const doLogout = async () => {
  const res = await userLogout()
  if (res.data.code === 0) {
    loginUserStore.setLoginUser({
      userName: '未登录',
    })
    message.success('退出登录成功')
    await router.push('/user/login')
  } else {
    message.error('退出登录失败，' + res.data.message)
  }
}
</script>

<style scoped>
.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  gap: 20px;
}

/* 用户信息区域 */
.user-section {
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.user-logged {
  display: flex;
  align-items: center;
}

.user-info {
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background-color 0.3s;

}

.user-info:hover {
  background-color: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
  margin-left: 8px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    height: auto;
    padding: 10px 0;
  }

  .user-section {
    order: 2;
  }
}
</style>
