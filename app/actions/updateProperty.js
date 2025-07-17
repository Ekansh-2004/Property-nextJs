"use server";

import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getSessionUser } from "@/utils/getSessionUser";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function updateProperty(propertyId, formData) {
	await connectDB();

	const sessionUser = await getSessionUser();
	console.log(sessionUser);
	if (!sessionUser || !sessionUser.userId) {
		throw new Error("User Id is required");
	}

	const { userId } = sessionUser;

	const existingProperty = await Property.findById(propertyId);

	if (!existingProperty) {
		throw new Error("Property not found");
	}

	// Verify ownership
	if (existingProperty.owner.toString() !== userId) {
		throw new Error("Unauthorized");
	}

	const amenities = formData.getAll("amenities");

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
		images: existingProperty.images,
	};

	const updatedProperty = await Property.findByIdAndUpdate(propertyId, propertyData, { new: true });
	revalidatePath("/", "layout", "/properties");

	redirect(`/properties/${updatedProperty._id}`);
}

export default updateProperty;
