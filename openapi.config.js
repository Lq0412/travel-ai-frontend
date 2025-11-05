import { generateService } from '@umijs/openapi'
generateService({
  requestLibPath: "import request from '@/request'",
  schemaPath: 'http://127.0.0.1:8080/api/v3/api-docs',
  serversPath: './src',
})
