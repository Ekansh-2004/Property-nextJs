import PropertyDetail from "@/components/PropertyDetail";
import PropertyHeaderImage from "@/components/PropertyHeaderImage";
import PropertyImages from "@/components/PropertyImages";

import connectDB from "@/config/database";
import Property from "@/models/Property";

import Link from "next/link";

import { FaArrowLeft } from "react-icons/fa";

import { convertToSerializableObject } from "@/utils/convertToObject";

const PropertyPage = async ({ params }) => {
	await connectDB();

	const { id } = await params;
	const propertyDocs = await Property.findById(id).lean();
	const property = convertToSerializableObject(propertyDocs);

	if (!property) {
		return <h1 className="text-center text-2xl font-bold mt-10">Property Not Found</h1>;
	}

	return (
		<>
			<PropertyHeaderImage image={property.images[0]} />
			<section>
				<div className="container m-auto py-6 px-6">
					<Link
						href="/properties"
						className="text-blue-500 hover:text-blue-600 flex items-center"
					>
						<FaArrowLeft className="mr-2" /> Back to Properties
					</Link>
				</div>
			</section>

			<section className="bg-blue-50">
				<div className="container m-auto py-10 px-6">
					<div className="grid grid-cols-1 md:grid-cols-[70%_28%] w-full gap-6">
						<PropertyDetail property={property} />
					</div>
				</div>
			</section>
			<PropertyImages images={property.images} />
		</>
	);
};

export default PropertyPage;
