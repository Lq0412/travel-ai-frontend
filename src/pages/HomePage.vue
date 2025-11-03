<template>
  <div class="page-container">
    <a-card class="main-card">
      <div class="title">欢迎使用智能 AI 旅游推荐平台 🎉</div>
      <div class="subtitle">
        智能 AI 旅游推荐平台！在这里，您可以通过我们强大的平台探索世界各地的美景，规划您的完美旅行路线。 🛠
      </div>

      <!-- 介绍 -->
      <div class="intro-section">
        <div class="intro-item">
          😀 作为用户，您可以通过注册登录账户，浏览风景轮播图，查看最新公告，分享您的旅游攻略，与 AI 进行智能对话获取个性化旅游推荐，探索景点列表，规划景点路线，购买景点门票，并管理您的个人主页。
        </div>
        <div class="intro-item">
          💻 作为管理者，我们提供了用户管理、公告管理、旅游攻略管理、AI 对话管理、景点管理、景点路线管理、景点评分管理、景点门票管理以及用户订单管理功能。
        </div>
        <div class="intro-item">
          🤝 我们提供多种精心设计的旅游推荐功能，帮助您全方位规划旅行。您可以管理和跟踪每个景点的浏览和收藏情况，实时分析并优化您的旅行策略。无论是短途旅行还是长途探险，我们都将为您提供最全面的旅行支持。
        </div>
        <div class="intro-item">
          👌 我们还提供了个人旅游日历、订单详情查看、评论查看、收藏的旅游攻略查看以及个人详情信息查看功能。
        </div>
        <div class="intro-item intro-item-last">
          🏁 无论您是用户还是管理者，智能 AI 旅游推荐平台都致力于提供稳定、安全、高效的旅行规划服务，帮助您实现更快速、便捷的旅行体验。
        </div>
      </div>

      <div class="card_container">
        <a-card>
          <div class="card-title">⭐全方位的旅游推荐</div>
          <div class="card-content">
            🐼平台提供丰富多样的旅游景点推荐，涵盖从热门景点到冷门秘境，帮助您全面提升旅行体验，轻松规划完美行程。
          </div>
        </a-card>
        <a-card>
          <div class="card-title">⭐智能AI旅游推荐</div>
          <div class="card-content">
            🐶️平台提供AI智能对话功能，实时评估您的旅行偏好，分析您的旅行需求，帮助您规划个性化旅行路线。
          </div>
        </a-card>
        <a-card>
          <div class="card-title">⭐个人旅行进度跟踪</div>
          <div class="card-content">
            🐰️平台为您提供个性化的旅行进度跟踪，自动记录您的旅行计划，帮助您了解旅行进度并优化旅行安排。
          </div>
        </a-card>
        <a-card>
          <div class="card-title">⭐详尽的景点解析</div>
          <div class="card-content">
            🐨平台提供详细的景点解析，帮助您深入理解每个景点的特色与亮点，让您不仅仅了解景点，更懂得如何玩转景点。
          </div>
        </a-card>
        <a-card>
          <div class="card-title">⭐多种旅行方式支持</div>
          <div class="card-content">
            🐷平台支持多种旅行方式的推荐，您可以根据个人需求选择相应的旅行方式，全面提升您的旅行体验。
          </div>
        </a-card>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.page-container {
  display: flex;
  justify-content: center;
}

.main-card {
  width: 100%;
}

.title {
  font-size: 28px;
}

.subtitle {
  font-size: 20px;
  margin: 40px 0;
}

.intro-section {
  // 介绍区域样式
}

.intro-item {
  margin: 20px 0;
  
  &-last {
    margin-bottom: 20px;
  }
}

.card_container {
  margin: 40px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .ant-card {
    height: 250px;
    flex-basis: calc(20% - 1rem);
    margin: 0 0.5rem;
  }
}

.card-title {
  margin: 15px 0;
  font-size: 20px;
  font-weight: bold;
}

.card-content {
  font-size: 16px;
  font-weight: bold;
  line-height: 24px;
}

a {
  text-decoration: none;
  color: rgb(37, 130, 255);
  font-weight: bold;
}
</style>
