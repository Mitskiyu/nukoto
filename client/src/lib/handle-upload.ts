import { handleConvert } from "./handle-convert";
import { useImageStore } from "./image-store";
import { toast } from "sonner";

export async function handleUpload() {
	const images = useImageStore.getState().images;
	const settings = useImageStore.getState().settings;
	const formData = new FormData();

	images.forEach((image) => {
		if (image.status == "done") {
			return;
		}

		formData.append("images", image.file);
		formData.append("image-id", image.id);

		useImageStore.getState().updateStatus(image.id, "converting", {});
	});
	formData.append("settings", JSON.stringify(settings));

	try {
		const res = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		if (res.status === 429) {
			toast.error("Rate limit exceeded. Please try again later.");
			images.forEach((image) => {
				if (image.status === "converting") {
					useImageStore.getState().updateStatus(image.id, "pending", {});
				}
			});
			return;
		}

		if (!res.ok) {
			const error = await res.text();
			throw new Error(error);
		}

		const convertedImages = await res.json();
		convertedImages.forEach(
			(img: {
				id: string;
				originalFormat: string;
				convertedFormat: string;
				data: string;
				error: boolean;
			}) => {
				if (img.error) {
					useImageStore.getState().updateStatus(img.id, "error", {});
					return;
				}

				handleConvert(img);
			},
		);
	} catch (err) {
		console.error(err);
		toast.error("Failed to convert images. Please try again.");
		images.forEach((image) => {
			if (image.status === "converting") {
				useImageStore.getState().updateStatus(image.id, "pending", {});
			}
		});
	}
}
