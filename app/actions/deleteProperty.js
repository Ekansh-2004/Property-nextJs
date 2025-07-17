"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";
import { revalidatePath } from "next/cache";

async function deleteProperty(propertyId) {
	const sessionUser = await getSessionUser();

	if (!sessionUser || !sessionUser.userId) {
		throw new Error("User Id is required");
	}

	const { userId } = sessionUser;

	// Connect to database
	await connectDB();

	const property = await Property.findById(propertyId);

	if (!property) {
		throw new Error("Property not found");
	}

	// Verify ownership
	if (property.owner.toString() !== userId) {
		throw new Error("Unauthorized");
	}

	// Extract public IDs properly for Cloudinary URLs with folders
	const publicIds = property.images.map((imageUrl) => {
		const parts = imageUrl.split("/");
		const uploadIndex = parts.findIndex((part) => part === "upload");
		if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
			// For URLs like: .../upload/v1234567890/folder/public_id.jpg
			const pathAfterVersion = parts.slice(uploadIndex + 2).join("/");
			return pathAfterVersion.split(".")[0]; // Remove file extension
		}
		// Fallback to original logic
		return parts.at(-1).split(".")[0];
	});

	// Delete images from Cloudinary
	if (publicIds.length > 0) {
		for (let publicId of publicIds) {
			try {
				await cloudinary.uploader.destroy(publicId);
			} catch (error) {
				console.error(`Failed to delete image ${publicId}:`, error);
				// Continue with other deletions even if one fails
			}
		}
	}

	// Delete property from database
	await Property.findByIdAndDelete(propertyId);

	// Revalidate the path
	revalidatePath("/", "layout", "/properties", "/profile");
}

export default deleteProperty;
