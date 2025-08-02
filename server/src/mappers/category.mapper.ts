import { ICategory } from "../types/Admin";

export interface CategoryDTO {
    _id: string;
    name: string;
    description: string;
    isActive:boolean;
    image:string;
}
export const mapCategoryToDTO = (category: ICategory): CategoryDTO => {
    return {
        _id: category._id.toString(),
        name: category.name,
        description: category.description,
        isActive: category.isActive,
        image:category.image
    };
};
