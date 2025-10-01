export interface User {
  id: number;
  image: string;
  name: string;
  last_name: string;
  email: string;
  password_hash: string;
  department: string;
  phone: string;
  company_history: string;
  profile_image?: string;
  role: string;
  points: number
}

export interface News {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  authorId: number;
  author?: User;
  status?:string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  image: string;
  created_at: string;
  author_id: number;
  author?: User;
}

export interface Announcement {
  id: number;
  title: string;
  content: string;
  importance: 'low' | 'medium' | 'high';
  created_at: string;
  author_id: number;
  author?: User;
}

export interface FavoriteLink {
  id: number;
  title: string;
  url: string;
  description: string;
  created_at: string;
}

export interface Like {
  id:number;
  author: User;
  authorId: number;

  news:News;
  newsId:number;

  comment:Comment;
  commentId:number;
  commentNumber:number;
}

export interface Comment {
  newsId: number;
  commentNumber:number;
  text: string;
  author?: User;
  authorId: number;
  news?: News
}
