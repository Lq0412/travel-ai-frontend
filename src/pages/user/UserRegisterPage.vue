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
          <h1 class="brand-title">开启旅程</h1>
          <p class="brand-description">创建您的账户，探索无限精彩旅程</p>
          
          <!-- 装饰性特性列表 -->
          <div class="feature-list">
            <div class="feature-item">
              <div class="feature-icon">
                <img src="https://unpkg.com/lucide-static@latest/icons/zap.svg" alt="fast">
              </div>
              <div class="feature-text">
                <div class="feature-title">快速注册</div>
                <div class="feature-desc">30秒创建账户</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <img src="https://unpkg.com/lucide-static@latest/icons/gift.svg" alt="gift">
              </div>
              <div class="feature-text">
                <div class="feature-title">新人礼包</div>
                <div class="feature-desc">注册即享优惠</div>
              </div>
            </div>
            <div class="feature-item">
              <div class="feature-icon">
                <img src="https://unpkg.com/lucide-static@latest/icons/heart.svg" alt="love">
              </div>
              <div class="feature-text">
                <div class="feature-title">专属服务</div>
                <div class="feature-desc">个性化推荐</div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧注册表单 -->
        <div class="glass-card auth-form-card">
          <div class="form-header">
            <h2 class="form-title">创建账户</h2>
            <p class="form-subtitle">填写信息完成注册</p>
          </div>
          
          <a-form
            :model="formState"
            name="registerForm"
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
                  placeholder="至少8位字符"
                  size="large"
                  class="custom-input"
                />
              </a-form-item>
            </div>
            
            <!-- 确认密码 -->
            <div class="form-group">
              <label class="form-label">
                <img src="https://unpkg.com/lucide-static@latest/icons/shield-check.svg" alt="confirm" class="label-icon">
                确认密码
              </label>
              <a-form-item
                name="checkPassword"
                :rules="[
                  { required: true, message: '请确认密码' },
                  { validator: validatePassword }
                ]"
              >
                <a-input-password
                  v-model:value="formState.checkPassword"
                  placeholder="再次输入密码"
                  size="large"
                  class="custom-input"
                />
              </a-form-item>
            </div>
            
            <!-- 服务条款 -->
            <div class="form-agreement">
              <a-checkbox>
                我已阅读并同意
                <a class="agreement-link">服务条款</a>
                和
                <a class="agreement-link">隐私政策</a>
              </a-checkbox>
            </div>
            
            <!-- 注册按钮 -->
            <a-form-item class="submit-item">
              <button type="submit" class="submit-btn" :disabled="loading">
                <span v-if="!loading">创建账户</span>
                <span v-else>注册中...</span>
                <img src="https://unpkg.com/lucide-static@latest/icons/arrow-right.svg" alt="arrow" class="btn-arrow">
              </button>
            </a-form-item>
          </a-form>
          
          <!-- 登录链接 -->
          <div class="auth-footer">
            <span class="footer-text">已有账号？</span>
            <router-link to="/user/login" class="footer-link">
              立即登录
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
import { userRegister } from '@/api/userController';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
});

const loading = ref(false);
const router = useRouter();

// 密码确认验证
const validatePassword = async (_rule: unknown, value: string) => {
  if (value !== formState.userPassword) {
    throw new Error('两次输入的密码不一致');
  }
};

// 提交表单
const handleSubmit = async (values: API.UserRegisterRequest) => {
  try {
    loading.value = true;
    console.log('开始注册，表单数据:', values);

    if (!values.userAccount || !values.userPassword || !values.checkPassword) {
      console.error('表单数据不完整:', values);
      message.error('请填写完整的注册信息');
      return;
    }

    if (values.userPassword !== values.checkPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    const res = await userRegister({
      userAccount: values.userAccount,
      userPassword: values.userPassword,
      checkPassword: values.checkPassword
    });
    console.log('注册响应:', res);

    if (res.data.code === 0) {
      console.log('注册成功');
      message.success('注册成功，请登录');
      router.push({
        path: '/user/login',
        replace: true,
      });
    } else {
      console.log('注册失败:', res.data.message);
      message.error('注册失败，' + res.data.message);
    }
  } catch (error) {
    console.error('注册过程中发生错误:', error);
    message.error('注册失败，请检查网络连接');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
// 复用登录页样式
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

.auth-form {
  .form-group {
    margin-bottom: 20px;
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

// 注册页特有：服务协议
.form-agreement {
  margin-bottom: 24px;
  
  ::v-deep .ant-checkbox-wrapper {
    color: rgba(255, 255, 255, 0.8);
    font-size: 14px;
  }
  
  ::v-deep .ant-checkbox-inner {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  .agreement-link {
    color: #667eea;
    text-decoration: none;
    cursor: pointer;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

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
