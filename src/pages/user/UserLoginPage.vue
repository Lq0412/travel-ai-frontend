<template>
  <div class="auth-page">
    <!-- 动态背景 -->
    <div class="auth-background">
      <div class="gradient-orb orb-1"></div>
      <div class="gradient-orb orb-2"></div>
      <div class="gradient-orb orb-3"></div>
    </div>
    
    <!-- 返回首页按钮 -->
    <router-link to="/" class="back-home">
      <img src="https://unpkg.com/lucide-static@latest/icons/arrow-left.svg" alt="back" class="back-icon">
      <span>返回首页</span>
    </router-link>
    
    <!-- 主内容区 -->
    <div class="auth-container">
      <div class="auth-content">
        <!-- 左侧品牌区 -->
        <div class="auth-brand">
          <div class="brand-logo">
            <img src="https://unpkg.com/lucide-static@latest/icons/compass.svg" alt="logo" class="logo-icon">
            <span class="logo-text">AI 旅游</span>
          </div>
          <h1 class="brand-title">欢迎回来</h1>
          <p class="brand-description">登录您的账户，开启旅程管理之旅</p>
          
          <!-- 装饰性特性列表 -->
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">
                <img src="https://unpkg.com/lucide-static@latest/icons/sparkles.svg" alt="ai">
              </div>
              <div class="feature-text">
                <div class="feature-title">AI 智能推荐</div>
                <div class="feature-desc">个性化旅游建议</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <img src="https://unpkg.com/lucide-static@latest/icons/map-pin.svg" alt="location">
              </div>
              <div class="feature-text">
                <div class="feature-title">海量景点</div>
                <div class="feature-desc">10,000+ 全球景点</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <img src="https://unpkg.com/lucide-static@latest/icons/shield-check.svg" alt="secure">
              </div>
              <div class="feature-text">
                <div class="feature-title">安全可靠</div>
                <div class="feature-desc">数据加密保护</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧登录表单 -->
        <div class="glass-card auth-form-card">
          <div class="form-header">
            <h2 class="form-title">账户登录</h2>
            <p class="form-subtitle">输入您的账户信息</p>
          </div>
          
          <a-form
            :model="formState"
            name="loginForm"
            autocomplete="off"
            @finish="handleSubmit"
            class="auth-form"
          >
            <!-- 用户名 -->
            <div class="form-group">
              <label class="form-label">
                <img src="https://unpkg.com/lucide-static@latest/icons/user.svg" alt="user" class="label-icon">
                用户名
              </label>
              <a-form-item
                name="userAccount"
                :rules="[{ required: true, message: '请输入用户名' }]"
              >
                <a-input
                  v-model:value="formState.userAccount"
                  placeholder="请输入用户名"
                  size="large"
                  class="custom-input"
                />
              </a-form-item>
            </div>
            
            <!-- 密码 -->
            <div class="form-group">
              <label class="form-label">
                <img src="https://unpkg.com/lucide-static@latest/icons/lock.svg" alt="lock" class="label-icon">
                密码
              </label>
              <a-form-item
                name="userPassword"
                :rules="[
                  { required: true, message: '请输入密码' },
                  { min: 8, message: '密码长度不能小于8位' }
                ]"
              >
                <a-input-password
                  v-model:value="formState.userPassword"
                  placeholder="请输入密码"
                  size="large"
                  class="custom-input"
                />
              </a-form-item>
            </div>
            
            <!-- 记住密码和忘记密码 -->
            <div class="form-options">
              <a-checkbox>记住密码</a-checkbox>
              <a class="forgot-link">忘记密码？</a>
            </div>
            
            <!-- 登录按钮 -->
            <a-form-item class="submit-item">
              <button type="submit" class="submit-btn" :disabled="loading">
                <span v-if="!loading">登录</span>
                <span v-else>登录中...</span>
                <img src="https://unpkg.com/lucide-static@latest/icons/arrow-right.svg" alt="arrow" class="btn-arrow">
              </button>
            </a-form-item>
          </a-form>
          
          <!-- 注册链接 -->
          <div class="auth-footer">
            <span class="footer-text">还没有账号？</span>
            <router-link to="/user/register" class="footer-link">
              立即注册
              <img src="https://unpkg.com/lucide-static@latest/icons/arrow-right.svg" alt="arrow" class="link-arrow">
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { userLogin } from '@/api/userController';
import { useLoginUserStore } from '@/stores/useLoginUserStore';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const formState = reactive<API.UserLoginRequest>({
  userAccount: '',
  userPassword: '',
});
const loading = ref(false);
const router = useRouter();
const loginUserStore = useLoginUserStore();

const handleSubmit = async (values: API.UserLoginRequest) => {
  try {
    loading.value = true;
    console.log('开始登录，表单数据:', values);

    if (!values.userAccount || !values.userPassword) {
      console.error('表单数据不完整:', values);
      message.error('请填写完整的登录信息');
      return;
    }

    const res = await userLogin(values);
    console.log('登录响应:', res);

    if (res.data.code === 0 && res.data.data) {
      console.log('登录成功，用户信息:', res.data.data);
      await loginUserStore.fetchLoginUser();
      message.success('登录成功');
      
      // 登录成功后统一跳转到仪表板
      router.push({ path: '/dashboard', replace: true });
    } else {
      console.log('登录失败:', res.data.message);
      message.error('登录失败，' + res.data.message);
    }
  } catch (error) {
    console.error('登录过程中发生错误:', error);
    message.error('登录失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
// 页面容器
.auth-page {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #0a0e27;
  padding: 20px;
}

// 动态背景
.auth-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.gradient-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.6;
  animation: float-orb 20s ease-in-out infinite;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  top: -10%;
  left: -10%;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  bottom: -15%;
  right: -10%;
  animation-delay: 7s;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  top: 50%;
  right: 20%;
  animation-delay: 14s;
}

@keyframes float-orb {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 30px) scale(0.9);
  }
}

// 返回首页按钮
.back-home {
  position: fixed;
  top: 30px;
  left: 30px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  
  .back-icon {
    width: 16px;
    height: 16px;
    filter: brightness(0) invert(1);
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(-4px);
  }
  
  @media (max-width: 768px) {
    top: 20px;
    left: 20px;
    padding: 8px 16px;
    font-size: 13px;
  }
}

// 主内容区
.auth-container {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 1200px;
}

.auth-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  
  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

// 左侧品牌区
.auth-brand {
  color: #fff;
  
  @media (max-width: 968px) {
    text-align: center;
  }
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  
  @media (max-width: 968px) {
    justify-content: center;
  }
  
  .logo-icon {
    width: 40px;
    height: 40px;
    filter: brightness(0) invert(1);
  }
  
  .logo-text {
    font-size: 24px;
    font-weight: 700;
  }
}

.brand-title {
  font-size: 48px;
  font-weight: 900;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
}

.brand-description {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 48px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
}

// 特性列表
.feature-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  
  @media (max-width: 968px) {
    display: none;
  }
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 16px;
}

.feature-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  img {
    width: 24px;
    height: 24px;
    filter: brightness(0) invert(1);
  }
}

.feature-text {
  .feature-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 4px;
  }
  
  .feature-desc {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.6);
  }
}

// 玻璃拟态表单卡片
.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.auth-form-card {
  padding: 48px;
  
  @media (max-width: 768px) {
    padding: 32px 24px;
  }
}

.form-header {
  margin-bottom: 32px;
  
  .form-title {
    font-size: 28px;
    font-weight: 700;
    color: #fff;
    margin-bottom: 8px;
  }
  
  .form-subtitle {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.6);
  }
}

// 表单样式
.auth-form {
  .form-group {
    margin-bottom: 24px;
  }
  
  .form-label {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
    
    .label-icon {
      width: 16px;
      height: 16px;
      filter: brightness(0) invert(1);
      opacity: 0.7;
    }
  }
}

// 自定义输入框
.custom-input {
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: #fff !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  
  &:hover,
  &:focus {
    background: rgba(255, 255, 255, 0.15) !important;
    border-color: rgba(255, 255, 255, 0.3) !important;
  }
  
  ::v-deep .ant-input {
    background: transparent !important;
    color: #fff !important;
    
    &::placeholder {
      color: rgba(255, 255, 255, 0.4) !important;
    }
  }
  
  ::v-deep .ant-input-password-icon {
    color: rgba(255, 255, 255, 0.6) !important;
  }
}

// 表单选项
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  ::v-deep .ant-checkbox-wrapper {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }
  
  ::v-deep .ant-checkbox-inner {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .forgot-link {
    font-size: 14px;
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    cursor: pointer;
    
    &:hover {
      color: #fff;
    }
  }
}

// 提交按钮
.submit-item {
  margin-bottom: 24px;
}

.submit-btn {
  width: 100%;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  .btn-arrow {
    width: 20px;
    height: 20px;
    filter: brightness(0) invert(1);
    transition: transform 0.3s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
    
    .btn-arrow {
      transform: translateX(4px);
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// 底部链接
.auth-footer {
  text-align: center;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  
  .footer-text {
    color: rgba(255, 255, 255, 0.6);
    font-size: 14px;
    margin-right: 8px;
  }
  
  .footer-link {
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.3s ease;
    
    .link-arrow {
      width: 14px;
      height: 14px;
      filter: brightness(0) invert(1);
      transition: transform 0.3s ease;
    }
    
    &:hover {
      color: #667eea;
      
      .link-arrow {
        transform: translateX(4px);
      }
    }
  }
}
</style>
