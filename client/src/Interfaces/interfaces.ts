

export interface ExpertInfo {
    fullName: string;
    dob: string;
    gender: string;
    contact: string;
    category: string;
    service: string;
    experience: string;
    certificate: File | null;
}

export interface Category {
    _id: string;
    name: string;
}

export interface Service {
    id: string;
    name: string;
    categoryId: { _id: string };
}