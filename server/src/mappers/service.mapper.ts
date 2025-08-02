import { IServices } from "../types/Admin";
import { ObjectId } from "mongoose";
export interface ServiceDTO {
  _id: string;
  name: string;
  categoryId: ObjectId;
  description: string;
  isActive?: boolean;
  image: string;
  createdAt?: Date;
}
export const mapServiceToDTO = (service: IServices): ServiceDTO => {
  return {
    _id: service._id.toString(),
    name: service.name,
    categoryId: service.categoryId,
    description: service.description,
    isActive: service.isActive,
    image: service.image,
  };
};
