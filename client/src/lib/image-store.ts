import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

export type Format = "png" | "jpg" | "webp" | "avif";
export type Status = "pending" | "converting" | "done" | "error";

type Settings = {
	format: Format;
	quality: number;
};

type Image = {
	id: string;
	file: File;
	status: Status;
	previewURL: string;
	convertedURL?: string;
	error?: string;
};

interface ImageStore {
	images: Image[];
	settings: Settings;
	addImages: (files: File[]) => void;
	deleteImage: (id: string) => void;
	clearImages: () => void;
	updateStatus: (id: string, status: Status, data: Partial<Image>) => void;
	updateSettings: (settings: Partial<Settings>) => void;
}

export const useImageStore = create<ImageStore>((set) => ({
	images: [],
	settings: {
		format: "png",
		quality: 80,
	},

	addImages: (files: File[]) =>
		set((state) => {
			const newImages = files.map((file) => {
				const id = uuidv4();
				const previewURL = URL.createObjectURL(file);
				return {
					id,
					file,
					status: "pending" as Status,
					previewURL,
				};
			});
			return { images: [...state.images, ...newImages] };
		}),

	deleteImage: (id: string) =>
		set((state) => {
			const imageToDelete = state.images.find((img) => img.id === id);
			if (imageToDelete) {
				URL.revokeObjectURL(imageToDelete.previewURL);
				if (imageToDelete.convertedURL) {
					URL.revokeObjectURL(imageToDelete.convertedURL);
				}
			}
			return {
				images: state.images.filter((img) => img.id !== id),
			};
		}),

	clearImages: () =>
		set((state) => {
			state.images.forEach((img) => {
				URL.revokeObjectURL(img.previewURL);
				if (img.convertedURL) {
					URL.revokeObjectURL(img.convertedURL);
				}
			});
			return { images: [] };
		}),

	updateStatus: (id: string, status: Status, data: Partial<Image>) =>
		set((state) => ({
			images: state.images.map((img) =>
				img.id === id ? { ...img, status, ...data } : img,
			),
		})),

	updateSettings: (settings: Partial<Settings>) =>
		set((state) => ({
			settings: { ...state.settings, ...settings },
		})),
}));
