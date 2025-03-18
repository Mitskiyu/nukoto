import { useImageStore } from "./image-store";

export async function handleUpload() {
	const images = useImageStore.getState().images;
	const settings = useImageStore.getState().settings;
	const formData = new FormData();

	images.forEach((image) => {
		formData.append("images", image.file);
		formData.append("image-id", image.id);
	});
	formData.append("settings", JSON.stringify(settings));

	try {
		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		if (!res.ok) {
			throw new Error("Failed to upload");
		}

		console.log("Success");
	} catch (err) {
		console.error(err);
	}
}
