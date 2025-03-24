import { useImageStore } from "./image-store";

export const downloadImage = (id: string) => {
	const images = useImageStore.getState().images;
	const image = images.find((img) => img.id === id);

	if (!image) {
		console.error(`Could not find image with ID: ${id}`);
		return;
	}

	if (!image.convertedURL) {
		console.error(`Could not find blob URL for: ${image.file.name}`);
		return;
	}

	const link = document.createElement("a");
	link.href = image.convertedURL;
	link.download = `${image.file.name.split(".")[0]}.${image.convertedFormat?.toLowerCase()}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

export const downloadAll = () => {
	const images = useImageStore.getState().images;
	const doneImages = images.filter((image) => image.status === "done");

	if (doneImages.length === 0) {
		console.error("Could not find any images to download");
		return;
	}

	doneImages.forEach((image, index) => {
		setTimeout(() => {
			const link = document.createElement("a");
			link.href = image.convertedURL!;
			link.download = `${image.file.name.split(".")[0]}.${image.convertedFormat?.toLowerCase()}`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}, index * 100);
	});
};
