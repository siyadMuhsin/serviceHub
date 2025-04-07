import { IExpert } from "../../../types/Expert";

export interface IExpertRepository {
    createExpert(data: Partial<IExpert>, userId: string): Promise<IExpert>;
    getExperts(): Promise<IExpert[]>;
    getExpertBy_limit(page: number, limit: number, query: any): Promise<{ experts: IExpert[]; totalRecords: number }>;
    findById(id: string): Promise<IExpert | null>;
    findByIdAndUpdate(id: string, update: Partial<IExpert>): Promise<IExpert | null>;
    findOne(query: object): Promise<IExpert | null>;
    pushToField(experId:string,field:keyof IExpert,value:any):Promise<IExpert|null>
    pullFromField(expert:string,field:keyof IExpert,value:any):Promise<IExpert|null>
}