import Expert from "../../models/expert.model";
import { IExpert } from "../../types/Expert";
class ExpertRepository {
    async createExpert(data: Partial<IExpert>,userId:string): Promise<IExpert> {
        try {
            const newData= {...data,userId}
            const expert = new Expert(newData);
            return await expert.save();
        } catch (error:any) {
            throw new Error(`Error in ExpertRepository: ${error.message}`);
        }
    }

    async getExperts(): Promise<IExpert[]> {
        return await Expert.find().populate("userId categoryId serviceId");
    }
}

export default new ExpertRepository();
