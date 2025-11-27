export interface Person {
  id: string;
  name: string;
  age: number;
  bio: string;
  photos: any;
  distance?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}

export interface LikeDislikeRequest {
  personId: string;
  action: "like" | "dislike";
}

export interface LikeDislikeResponse {
  success: boolean;
  message?: string;
  match?: boolean;
}
