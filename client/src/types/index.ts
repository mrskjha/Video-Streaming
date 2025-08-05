
export interface User {
  accessToken: string;
  message: any;
	_id: string;
	username: string;
	email: string;
	fullname: string;
	avatar: File | string;
	coverImage: File | string;
}


export interface Video {
  id: any;
  message(message: any): unknown;
  _id: string;
  title: string;
  description: string;
  videoFile: string;
  thumbnail: string;
  duration: number;
  userId: string;
  likes: number;
  dislikes: number;
  views: number;
  isPublished: boolean;
  comments: Comment[];
  createdAt: Date;
  owner: {
  subscribersCount: number;
	_id: string;
	username: string;
	avatar: string;
  fullname: string;
}
}

export interface Comment {
  _id: string;
  videoId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}