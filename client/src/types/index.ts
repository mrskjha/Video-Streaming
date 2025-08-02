
export interface User {
	_id: string;
	username: string;
	email: string;
	fullName: string;
	avatar: File | string;
	coverImage: File | string;
}
export type LoginPayload = {
  email: string;
  password: string;
};

export interface Video {
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
	_id: string;
	username: string;
	avatar: string;
}
}

export interface Comment {
  _id: string;
  videoId: string;
  userId: string;
  content: string;
  createdAt: Date;
}