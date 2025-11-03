export interface ChatItem {
  role: 'user' | 'ai'
  text: string
  time: Date
}

export interface Conversation {
  id: string
  title: string
  updateTime?: string
}


