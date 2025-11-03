<template>
  <div class="background">
    <div class="register-container">
      <!-- 右侧注册表单区域 -->
      <div class="register-right">
        <div class="register-form-container">
          <div class="form-header">
            <h2 class="form-title">用户注册</h2>
            <p class="form-subtitle">创建新账号，开始您的旅行之旅</p>
          </div>

          <a-form
            :model="formState"
            name="basic"
            autocomplete="off"
            @finish="handleSubmit"
            class="register-form"
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
              :rules="[ { required: true, message: '请输入密码!' }, { min: 8, message: '密码长度不能小于8位' } ]">
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

            <!-- 确认密码输入框 -->
            <a-form-item
              name="checkPassword"
              :rules="[ { required: true, message: '请确认密码!' }, { validator: validatePassword } ]">
              <a-input-password
                v-model:value="formState.checkPassword"
                placeholder="请再次输入密码"
                size="large"
                class="form-input"
              >
                <template #prefix>
                  <LockOutlined style="color: #bfbfbf" />
                </template>
              </a-input-password>
            </a-form-item>

            <!-- 注册按钮 -->
            <a-form-item class="register-button-item">
              <a-button
                type="primary"
                html-type="submit"
                size="large"
                class="register-button"
                :loading="loading"
              >
                注册
              </a-button>
            </a-form-item>

            <!-- 底部注册链接 -->
            <div class="form-footer">
              <div class="login-link">
                已有账号？
                <router-link to="/user/login" class="link">立即登录</router-link>
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
import { userRegister } from '@/api/userController';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';

const formState = reactive<API.UserRegisterRequest>({
  userAccount: '',
  userPassword: '',
  checkPassword: '',
});

const loading = ref(false);
const router = useRouter()

/**
 * 密码确认验证
 */
const validatePassword = async (_rule: unknown, value: string) => {
  if (value !== formState.userPassword) {
    throw new Error('两次输入的密码不一致!');
  }
};

/**
 * 提交表单
 * @param values
 */
const handleSubmit = async (values: API.UserRegisterRequest) => {
  try {
    loading.value = true;
    console.log('开始注册，表单数据:', values)
    console.log('表单验证状态:', formState)

    // 检查表单数据是否完整
    if (!values.userAccount || !values.userPassword || !values.checkPassword) {
      console.error('表单数据不完整:', values)
      message.error('请填写完整的注册信息')
      return
    }

    // 检查密码是否一致
    if (values.userPassword !== values.checkPassword) {
      message.error('两次输入的密码不一致')
      return
    }

    const res = await userRegister({
      userAccount: values.userAccount,
      userPassword: values.userPassword,
      checkPassword: values.checkPassword
    })
    console.log('注册响应:', res)

    // 注册成功
    if (res.data.code === 0) {
      console.log('注册成功')
      message.success('注册成功，请登录')
      // 跳转到登录页
      router.push({
        path: '/user/login',
        replace: true,
      })
    } else {
      console.log('注册失败:', res.data.message)
      message.error('注册失败，' + res.data.message)
    }
  } catch (error) {
    console.error('注册过程中发生错误:', error)
    message.error('注册失败，请检查网络连接')
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.background {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background-image: url(https://open.saintic.com/api/bingPic);
  background-size: cover;
  background-position: center;
}

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.register-right {
  width: 400px;
  background: rgba(255, 255, 255, 0.8);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.login-link {
  font-size: 14px;
  color: #007bff;
}

.login-link .link {
  text-decoration: none;
}

.login-link .link:hover {
  text-decoration: underline;
}

.form-input {
  width: 100%;
}

.register-button {
  width: 100%;
}

.register-button-item {
  margin-top: 20px;
}
</style>
