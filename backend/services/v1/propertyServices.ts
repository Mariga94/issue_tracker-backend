
import PropertyModel, { IProperty } from "../../models/v1/propertyModel";
import UserModel from "../../models/v1/userModel";


const createProperty = async (propertyData: IProperty, userId: string): Promise<IProperty | null> => {
    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            throw new Error("Use cannot be found!")
        }
        const newProperty = await PropertyModel.create({
            ...propertyData,
            owner: user._id
        });
        user.properties.push(newProperty._id)
        user.save()
        return newProperty
    } catch (error: any) {
        throw new Error(`Error creating property ${error.message}`)
    }
}

const updateProperty = async (id: string, update: Partial<IProperty>): Promise<IProperty | null> => {
    try {
        const updatedProperty = await PropertyModel.findByIdAndUpdate(id, update, { new: true });
        return updatedProperty
    } catch (error: any) {
        throw new Error(`Error updating property: ${error.message}`)
    }
}

const getPropertyById = async (propertyId: string): Promise<IProperty | null> => {
    try {
        if (!propertyId) {
            throw new Error("Property Id is undefined");
        }
        const property = await PropertyModel.findById(propertyId);
        return property
    } catch (error: any) {
        throw new Error(`Error fetching property with ${propertyId}: ${error.message}`)
    }
}

const getProperties = async (): Promise<IProperty[] | null> => {
    try {
        const properties = await PropertyModel.find()
        return properties
    } catch (error: any) {
        throw new Error(`Error fetching properties ${error.message}`)
    }
}

const getUserProperties = async (userId: string): Promise<IProperty[] | null> => {
    try {
        console.log(userId)
        const properties = await PropertyModel.find({ owner: userId })
        return properties
    } catch (error: any) {
        throw new Error(`Error fetching properties ${error.message}`)
    }
}
const getPropertiesByStatus = async (propertyStatus: string): Promise<IProperty[] | null> => {
    try {
        const properties = await PropertyModel.find({ propertyStatus: propertyStatus })
        return properties
    } catch (err) {
        throw new Error('Error fetching properties by status')
    }
}

const getPropertiesForSale = async () => {
    try {
        const properties = await PropertyModel.find({ propertyStatus: 'Sale' })
        return properties
    } catch (error) {
        throw new Error('Error fetching properties for sale');
    }
}

const getPropertiesForRent = async () => {
    try {
        const properties = await PropertyModel.find({ propertyStatus: 'Rent' })
        return properties
    } catch (error) {
        throw new Error('Error fetching properties for sale');
    }
}
const deleteProperty = async (id: string) => {
    try {
        return await PropertyModel.findByIdAndDelete(id)

    } catch (error: any) {
        throw new Error(`Error deleting property: ${error.message}`);
    }
};

export const getLatestPropertiesForSale = async () => {
    try {
        const properties = await PropertyModel.find({ propertyStatus: 'Sale' })
        return properties.slice(0, 5)
    } catch (error: any) {
        throw new Error(`Error fetching properties: ${error.message}`)
    }
}

export const getLatestPropertiesForRent = async () => {
    try {
        const properties = await PropertyModel.find({ propertyStatus: 'Rent' })
        return properties.slice(0, 5)
    } catch (error: any) {
        throw new Error(`Error fetching properties: ${error.message}`)
    }
}

export { createProperty, updateProperty, deleteProperty, getProperties, getPropertyById, getUserProperties, getPropertiesByStatus, getPropertiesForSale, getPropertiesForRent }