export interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface  IProduct {
    _id?: string
    name?: string
    description?: string
    price?: number
    stock_level?: number
    status?: string
    category?: string
    min_stock?: number
    image_url?: string
    createdAt?: string
    updatedAt?: string
    __v?: number
  }