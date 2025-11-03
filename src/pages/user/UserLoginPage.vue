<template>
  <div class="background">
    <div class="login-container">
      <!-- 登录表单区域 -->
      <div class="login">
        <div class="login-form-container">
          <div class="form-header">
            <h1 class="brand-title">旅行助手</h1>
            <p class="brand-subtitle">探索世界，记录美好</p>
          </div>

          <a-form
            :model="formState"
            name="basic"
            autocomplete="off"
            @finish="handleSubmit"
            class="login-form"
          >
            <!-- 用户名输入框 -->
            <a-form-item
              name="userAccount"
              :rules="[{ required: true, message: '请输入用户名!' }]">
              <a-input
                v-model:value="formState.userAccount"
                placeholder="请输入用户名"
                size="large"
                class="form-input"
              >
                <template #prefix>
                  <UserOutlined style="color: #bfbfbf" />
                </template>
              </a-input>
            </a-form-item>

            <!-- 密码输入框 -->
            <a-form-item
              name="userPassword"
              :rules="[{ required: true, message: '请输入密码!' }, { min: 8, message: '密码长度不能小于8位' }]">
              <a-input-password
                v-model:value="formState.userPassword"
                placeholder="请输入密码"
                size="large"
                class="form-input"
              >
                <template #prefix>
                  <LockOutlined style="color: #bfbfbf" />
                </template>
              </a-input-password>
            </a-form-item>

            <!-- 登录按钮 -->
            <a-form-item class="login-button-item">
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                class="login-button"
                :loading="loading"
              >
                登录
              </a-button>
            </a-form-item>

            <!-- 底部注册链接 -->
            <div class="form-footer">
              <div class="footer-links">
                <div class="register-link">
                  没有账号？
                  <router-link to="/user/register" class="link">立即注册</router-link>
                </div>
              </div>
            </div>
          </a-form>
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
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

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
    console.log('表单验证状态:', formState);

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
      
      // 根据用户角色跳转到不同页面
      const userRole = res.data.data.userRole;
      if (userRole === 'admin') {
        router.push({ path: '/admin/userManage', replace: true });
      } else if (userRole === 'merchant') {
        router.push({ path: '/merchant/products', replace: true });
      } else {
        router.push({ path: '/', replace: true });
      }
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

<style scoped>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-image: url(https://open.saintic.com/api/bingPic);
  background-size: 100%;
  background-position: center;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.login {
  background: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 20px;
}

.form-title {
  font-size: 24px;
  font-weight: bold;
}

.form-subtitle {
  font-size: 14px;
  color: #888;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.register-link,
.merchant-link {
  font-size: 14px;
  color: #007bff;
}

.footer-links .link {
  color: #1890ff;
  text-decoration: none;
}

.footer-links .link:hover {
  text-decoration: underline;
}

.form-input {
  width: 100%;
}

.login-button {
  width: 100%;
}

.login-button-item {
  margin-top: 20px;
}
</style>
