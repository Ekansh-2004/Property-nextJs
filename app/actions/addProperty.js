"use server";

import cloudinary from "@/config/cloudinary";
import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function addProperty(formData) {
	await connectDB();

	const sessionUser = await getSessionUser();
	console.log(sessionUser);
	if (!sessionUser || !sessionUser.userId) {
		throw new Error("User Id is required");
	}

	const { userId } = sessionUser;

	const amenities = formData.getAll("amenities");
	const images = formData.getAll("images").filter((image) => image.name !== "");

	const propertyData = {
		owner: userId,
		type: formData.get("type"),
		name: formData.get("name"),
		description: formData.get("description"),
		location: {
			street: formData.get("location.street"),
			city: formData.get("location.city"),
			state: formData.get("location.state"),
			zipcode: formData.get("location.zipcode"),
		},
		beds: formData.get("beds"),
		baths: formData.get("baths"),
		square_feet: formData.get("square_feet"),
		amenities: amenities,
		rates: {
			nightly: formData.get("rates.nightly"),
			weekly: formData.get("rates.weekly"),
			monthly: formData.get("rates.monthly"),
		},
		seller_info: {
			name: formData.get("seller_info.name"),
			email: formData.get("seller_info.email"),
			phone: formData.get("seller_info.phone"),
		},
	};

	const imageUrls = [];

	for (const imageFile of images) {
		try {
			const imageBuffer = await imageFile.arrayBuffer();
			const imageData = Buffer.from(imageBuffer);

			// Get the actual mime type or default to image/jpeg
			const mimeType = imageFile.type || "image/jpeg";
			const base64 = imageData.toString("base64");

			const result = await cloudinary.uploader.upload(`data:${mimeType};base64,${base64}`);

			imageUrls.push(result.secure_url);
		} catch (error) {
			console.error(`Failed to upload image ${imageFile.name}:`, error);
			// Decide whether to continue or throw based on your requirements
		}
	}

	propertyData.images = imageUrls;

	const newProperty = new Property(propertyData);

	await newProperty.save();
	revalidatePath("/", "layout", "/properties");
	redirect(`/properties/${newProperty._id}`);
}
export default addProperty;
