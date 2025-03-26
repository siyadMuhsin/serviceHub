import servicesService from "../../services/Admin/services.service";
import ServicesService from "../../services/Admin/services.service";
import mongoose, { ObjectId } from "mongoose";
import { Request, Response } from "express";
import { HttpStatus } from "../../types/httpStatus"; // Adjust import path

class ServiceController {
  async createService(req: Request, res: Response): Promise<void> {
    try {
      const { name, categoryId, description } = req.body;
      if (!name?.trim() || !categoryId?.trim() || !description?.trim()) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: "All fields are required" 
        });
        return;
      }
      if (!req.file) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          success: false, 
          message: "Image is required" 
        });
        return;
      }
      const response = await ServicesService.createService(
        name,
        categoryId,
        description,
        req.file
      );
      res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async getAllServices(req: Request, res: Response): Promise<void> {
    try {
      const response = await ServicesService.getAllServices();
      res.status(HttpStatus.OK).json(response);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async getServiceById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await ServicesService.getServiceById(id);
      res.status(HttpStatus.OK).json(response);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async getServicesByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const response = await ServicesService.getServicesByCategory(categoryId);
      res.status(HttpStatus.OK).json(response);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async updateService(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await ServicesService.updateService(
        id,
        req.body,
        req.file
      );
      res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: error.message 
      });
    }
  }

  async ist_and_unlist(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const response = await servicesService.changeStatus(id);
      res.status(response.success ? HttpStatus.OK : HttpStatus.BAD_REQUEST).json(response);
    } catch (err: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async getServicesByCategory_limit(req: Request, res: Response): Promise<void> {
    try {
      const { categoryId } = req.params;
      const { page = 1, limit = 8 } = req.query;

      if (!categoryId) {
        res.status(HttpStatus.BAD_REQUEST).json({ 
          error: "Category ID is required" 
        });
        return;
      }

      const pageNumber = parseInt(page as string) || 1;
      const limitNumber = parseInt(limit as string) || 8;

      const search = typeof req.query.searchQuary === "string" 
        ? req.query.searchQuary 
        : "";

      const { services, totalServices } = await servicesService.getServicesByCategory_limit(
        categoryId,
        pageNumber,
        limitNumber,
        search
      );

      res.status(HttpStatus.OK).json({
        success: true,
        services,
        currentPage: pageNumber,
        totalPages: Math.ceil(totalServices / limitNumber),
      });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
    }
  }

  async getServicesToMange(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = typeof req.query.search === 'string' 
        ? req.query.search 
        : "";

      const response = await servicesService.getServicesToMange(page, limit, search);

      res.status(HttpStatus.OK).json({
        success: true,
        services: response.services,
        currentPage: page,
        totalPage: Math.ceil(response.totalServices / limit)
      });
    } catch (error: any) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ 
        error: error.message 
      });
    }
  }
}

export default new ServiceController();