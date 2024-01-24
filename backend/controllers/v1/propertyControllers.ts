import { Request, Response } from 'express';
import * as PropertyService from '../../services/v1/propertyServices';

interface AuthenticatedRequest extends Request {
    userId?: string;
}

const createProperty = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId: string | undefined = req.userId
        const propertyData = req.body;
        if (userId === undefined) {
            throw new Error('userId is undefined')
        }
        const newProperty = await PropertyService.createProperty(propertyData, userId);
        return res.status(201).json({ message: 'Property created successfully', newProperty })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getUserProperties = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {

        const userId: string | undefined = req.userId
        if (userId === undefined) {
            throw new Error('userId is undefined')
        }
        const properties = await PropertyService.getUserProperties(userId);
        return res.status(200).json({ message: "Properties fetch successfully", properties })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getProperties = async (req: Request, res: Response): Promise<any> => {
    try {
        const properties = await PropertyService.getProperties();
        return res.status(200).json({ message: "Properties fetch successfully", properties })
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" })
    }
}

const getPropertyById = async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Please provide a valid Id" })
        }
        const property = await PropertyService.getPropertyById(id);
        return res.status(201).json({ message: "Property fetch successfully", property })
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" })
    }
}

const updateProperty = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Please provide a valid Id" })
        }
        const updatedProperty = PropertyService.updateProperty(id, req.body)
        return res.status(201).json({ message: "Value updated Successfully", updatedProperty })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const deleteProperty = async (req: Request, res: Response) => {
    try {

        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "Please provide a valid Id" })
        }
        const deletedProperty = await PropertyService.deleteProperty(id);
        return res.status(201).json({ message: "Property deleted successfully", deletedProperty })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const getPropertiesByStatus = async (req: Request, res: Response) => {
    try {
        const { propertyStatus } = req.params;
        const properties = await PropertyService.getPropertiesByStatus(propertyStatus);
        res.status(200).json({ message: 'Properties fetch successfully', properties })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const getPropertiesForSale = async (req: Request, res: Response) => {
    try {
        const properties = await PropertyService.getPropertiesForSale()
        res.status(200).json({ message: 'Properties fetch successfully', properties })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

const getPropertiesForRent = async (req: Request, res: Response) => {
    try {
        const properties = await PropertyService.getPropertiesForRent()
        res.status(200).json({ message: 'Properties fetch successfully', properties })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getLatestPropertiesForSale = async (req: Request, res: Response) => {
    try {
        const properties = await PropertyService.getLatestPropertiesForSale()
        res.status(200).json({ message: 'Properties fetch successfully', properties })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export const getLatestPropertiesForRent = async (req: Request, res: Response) => {
    try {
        const properties = await PropertyService.getLatestPropertiesForRent()
        res.status(200).json({ message: 'Properties fetch successfully', properties })
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

export { createProperty, getProperties, getPropertyById, updateProperty, deleteProperty, getUserProperties, getPropertiesByStatus, getPropertiesForSale, getPropertiesForRent }