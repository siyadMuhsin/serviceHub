

export interface ExpertData {
    AccountName: string;
    dob: string;
    gender: string;
    contact: string;
    experience: string;
    service: string;
    category: string;
    certificate: File | FileList | null;
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