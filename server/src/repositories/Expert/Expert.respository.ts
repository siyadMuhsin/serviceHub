import Expert from "../../models/expert.model";
import { IExpert } from "../../types/Expert";
class ExpertRepository {
    async createExpert(data: Partial<IExpert>,userId:string): Promise<IExpert> {
        try {
            console.log(data)
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
    async getExpertBy_limit(page: number, limit: number,query:any) {
        try {
            const skip = (page - 1) * limit;

            const experts = await Expert.find(query)
                .populate('userId', 'name email') 
                .populate('categoryId', 'name') 
                .populate('serviceId', 'name') 
                .skip(skip)
                .limit(limit);

            const totalRecords = await Expert.countDocuments(query);

            return { experts, totalRecords };
        } catch (error) {
            console.error('Error in fetching experts:', error);
            throw error;
        }
    }
}

export default new ExpertRepository();
