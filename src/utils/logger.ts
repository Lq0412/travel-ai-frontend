/**
 * 日志级别枚举
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR'
}

/**
 * 日志配置接口
 */
interface LoggerConfig {
  /** 是否启用日志，默认根据环境判断 */
  enabled?: boolean
  /** 最小日志级别 */
  minLevel?: LogLevel
  /** 是否显示时间戳 */
  showTimestamp?: boolean
  /** 是否显示调用栈 */
  showStack?: boolean
  /** 自定义日志前缀 */
  prefix?: string
}

/**
 * 日志记录类
 */
class Logger {
  private config: Required<LoggerConfig>

  constructor(config: LoggerConfig = {}) {
    this.config = {
      enabled: config.enabled ?? import.meta.env.MODE === 'development',
      minLevel: config.minLevel ?? LogLevel.DEBUG,
      showTimestamp: config.showTimestamp ?? true,
      showStack: config.showStack ?? false,
      prefix: config.prefix ?? ''
    }
  }

  /**
   * 获取格式化的时间戳
   */
  private getTimestamp(): string {
    if (!this.config.showTimestamp) return ''
    const now = new Date()
    return `[${now.toLocaleTimeString()}.${now.getMilliseconds()}]`
  }

  /**
   * 获取日志前缀
   */
  private getPrefix(level: LogLevel): string {
    const parts: string[] = []
    
    if (this.config.showTimestamp) {
      parts.push(this.getTimestamp())
    }
    
    parts.push(`[${level}]`)
    
    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`)
    }
    
    return parts.join(' ')
  }

  /**
   * 检查是否应该记录该级别的日志
   */
  private shouldLog(level: LogLevel): boolean {
    if (!this.config.enabled) return false

    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR]
    const minLevelIndex = levels.indexOf(this.config.minLevel)
    const currentLevelIndex = levels.indexOf(level)

    return currentLevelIndex >= minLevelIndex
  }

  /**
   * DEBUG级别日志（仅开发环境）
   */
  debug(message: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return
    console.log(this.getPrefix(LogLevel.DEBUG), message, ...args)
  }

  /**
   * INFO级别日志
   */
  info(message: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.INFO)) return
    console.info(this.getPrefix(LogLevel.INFO), message, ...args)
  }

  /**
   * WARN级别日志
   */
  warn(message: string, ...args: any[]): void {
    if (!this.shouldLog(LogLevel.WARN)) return
    console.warn(this.getPrefix(LogLevel.WARN), message, ...args)
  }

  /**
   * ERROR级别日志（始终记录）
   */
  error(message: string, error?: any): void {
    if (!this.shouldLog(LogLevel.ERROR)) return
    
    console.error(this.getPrefix(LogLevel.ERROR), message)
    
    if (error) {
      console.error('错误详情:', error)
      
      if (this.config.showStack && error?.stack) {
        console.error('调用栈:', error.stack)
      }
    }
  }

  /**
   * 创建带特定前缀的子logger
   */
  createChild(prefix: string): Logger {
    return new Logger({
      ...this.config,
      prefix: this.config.prefix ? `${this.config.prefix}:${prefix}` : prefix
    })
  }

  /**
   * 更新配置
   */
  updateConfig(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

/**
 * 默认logger实例
 */
export const logger = new Logger()

/**
 * 创建模块专用logger
 * @param moduleName 模块名称
 * @returns Logger实例
 */
export function createLogger(moduleName: string): Logger {
  return logger.createChild(moduleName)
}

/**
 * API请求日志记录器
 */
export const apiLogger = createLogger('API')

/**
 * 组件日志记录器工厂
 * @param componentName 组件名称
 */
export function createComponentLogger(componentName: string): Logger {
  return createLogger(`Component:${componentName}`)
}

/**
 * 性能日志记录器
 */
export const perfLogger = createLogger('Performance')

/**
 * 性能监控辅助函数
 * @param name 监控点名称
 * @param fn 要监控的函数
 */
export async function measurePerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now()
  perfLogger.debug(`${name} 开始`)
  
  try {
    const result = await fn()
    const duration = performance.now() - startTime
    perfLogger.debug(`${name} 完成，耗时: ${duration.toFixed(2)}ms`)
    return result
  } catch (error) {
    const duration = performance.now() - startTime
    perfLogger.error(`${name} 失败，耗时: ${duration.toFixed(2)}ms`, error)
    throw error
  }
}

/**
 * 开发环境专用日志（生产环境自动禁用）
 */
export const devLogger = new Logger({
  enabled: import.meta.env.MODE === 'development',
  minLevel: LogLevel.DEBUG,
  showTimestamp: true,
  prefix: 'DEV'
})

// 导出默认logger
export default logger

