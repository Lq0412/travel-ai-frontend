<template>
  <div class="background">
    <div class="login-container">
      <!-- 登录表单区域 -->
      <div class="login">
        <div class="login-form-container">
          <div class="form-header">
            <h1 class="brand-title">商家登录</h1>
            <p class="brand-subtitle">商家管理平台</p>
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
                placeholder="请输入商家账号"
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
                商家登录
              </a-button>
            </a-form-item>

            <!-- 底部链接 -->
            <div class="form-footer">
              <div class="footer-links">
                <router-link to="/user/login" class="link">普通用户登录</router-link>
                <span class="divider">|</span>
                <router-link to="/" class="link">返回首页</router-link>
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

    if (!values.userAccount || !values.userPassword) {
      message.error('请填写完整的登录信息');
      return;
    }

    const res = await userLogin(values);

    if (res.data.code === 0 && res.data.data) {
      await loginUserStore.fetchLoginUser();
      
      // 验证用户角色是否为商家
      const userRole = res.data.data.userRole;
      if (userRole !== 'merchant' && userRole !== 'admin') {
        message.error('您不是商家，无法使用商家登录');
        // 清除登录状态
        await loginUserStore.fetchLoginUser();
        return;
      }
      
      message.success('登录成功');
      // 商家登录后跳转到商品管理页面
      router.push({ path: '/merchant/products', replace: true });
    } else {
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
  background: rgba(255, 255, 255, 0.9);
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  max-width: 420px;
  width: 100%;
}

.form-header {
  text-align: center;
  margin-bottom: 30px;
}

.brand-title {
  font-size: 28px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
}

.brand-subtitle {
  font-size: 14px;
  color: #666;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
}

.footer-links {
  font-size: 14px;
  color: #666;
}

.footer-links .link {
  color: #1890ff;
  text-decoration: none;
  margin: 0 8px;
}

.footer-links .link:hover {
  text-decoration: underline;
}

.divider {
  color: #d9d9d9;
  margin: 0 8px;
}

.form-input {
  width: 100%;
}

.login-button {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

.login-button-item {
  margin-top: 24px;
  margin-bottom: 0;
}
</style>

