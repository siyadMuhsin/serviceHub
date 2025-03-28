import { inject, injectable } from "inversify";
import { IProfileController } from "../../core/interfaces/controllers/IProfileController";
import { Response } from "express";
import { AuthRequest } from "../../types/User";
import { HttpStatus } from "../../types/httpStatus";
import { TYPES } from "../../di/types";
import { IProfileService } from "../../core/interfaces/services/IProfileService";

@injectable()
export class ProfileController implements IProfileController {
    constructor(
           @inject(TYPES.ProfileService) private profileService: IProfileService
       ) {}
       async add_location(req: AuthRequest, res: Response): Promise<void> {
        try {
          const userId = req?.user?.userId;
          if (!userId) {
            return this.sendResponse(
              res,
              { success: false, message: "User not found" },
              HttpStatus.BAD_REQUEST
            );
          }
          
          const { location, lat, lng } = req.body;
          if (!lat || !lng) {
            return this.sendResponse(
              res,
              { success: false, message: "Latitude or longitude is missing!" },
              HttpStatus.BAD_REQUEST
            );
          }
    
          const response = await this.profileService.addLocation(userId, lat, lng);
          
          if (!response.success) {
            return this.sendResponse(
              res,
              { success: false, message: response.message || "Failed to add location" },
              HttpStatus.INTERNAL_SERVER_ERROR
            );
          }
    
          this.sendResponse(
            res,
            { success: true, message: "Location added successfully" },
            HttpStatus.OK
          );
        } catch (error) {
          console.error("Error in add_location:", error);
          this.sendResponse(
            res,
            { success: false, message: "Internal server error" },
            HttpStatus.INTERNAL_SERVER_ERROR
          );
        }
    }
  private sendResponse(res: Response, data: any, status: HttpStatus): void {
    res.status(status).json(data);
  }
}
