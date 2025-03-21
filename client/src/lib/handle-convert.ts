import { useImageStore } from "./image-store";

export function handleConvert(img: {
	id: string;
	originalFormat: string;
	convertedFormat: string;
	data: string;
	error: boolean;
}) {
	const originalImage = useImageStore
		.getState()
		.images.find((image) => image.id === img.id);

	if (!originalImage) {
		console.error(`Could not find image with id: ${img.id}`);
	}

	const binaryData = atob(img.data);
	const bytes = new Uint8Array(binaryData.length);
	for (let i = 0; i < binaryData.length; i++) {
		bytes[i] = binaryData.charCodeAt(i);
	}

	let mimeType;
	switch (img.convertedFormat.toLowerCase()) {
		case "png":
			mimeType = "image/png";
			break;
		case "jpg":
		case "jpeg":
			mimeType = "image/jpeg";
			break;
		case "webp":
			mimeType = "image/webp";
			break;
		case "avif":
			mimeType = "image/avif";
			break;
		default:
			mimeType = "application/octet-stream";
	}

	const blob = new Blob([bytes], { type: mimeType });
	const url = URL.createObjectURL(blob);

	useImageStore.getState().updateStatus(img.id, "done", {
		convertedURL: url,
		convertedFormat: img.convertedFormat,
	});
}
