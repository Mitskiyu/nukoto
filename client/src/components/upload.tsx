import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useImageStore } from "../lib/image-store";
import nukoPeek from "../assets/images/nukoPeek.gif";

function Upload() {
	const addImages = useImageStore((state) => state.addImages);

	const onDrop = useCallback(
		(acceptedFiles: File[], fileRejections: FileRejection[]) => {
			if (acceptedFiles.length > 0) {
				addImages(acceptedFiles);
				// TODO
			}

			if (fileRejections.length > 0) {
				// TODO
			}
		},
		[],
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			"image/jpeg": [".jpg", ".jpeg", ".jfif", ".pjpeg", ".pjp"],
			"image/png": [".png"],
			"image/avif": [".avif"],
			"image/webp": [".webp"],
		},
		multiple: true,
		maxSize: 5 * 1024 * 1024,
		maxFiles: 30,
	});

	return (
		<div className="w-full h-[256px] bg-surface0 outline-1 outline-surface1 rounded-sm flex flex-col font-koden">
			<h2 className="text-2xl text-lavender ml-3.5 mt-3">Upload Image</h2>
			<div className="flex flex-1 items-center justify-center">
				<div
					{...getRootProps()}
					className="w-11/12 h-10/12 flex flex-col bg-transparent outline-2 outline-dashed outline-overlay0 cursor-pointer hover:outline-mauve rounded-sm items-center justify-center"
				>
					<input {...getInputProps()} />
					<img
						className="h-12 w-12 mt-8"
						src={nukoPeek}
						alt="nuko cat peek envelope"
					/>
					<p className="text-text text-md">
						Click to select or drag images here
					</p>
					<p className="text-subtext0 text-sm mt-2">
						Supports PNG, JPG, WEBP, AVIF.
					</p>
				</div>
			</div>
		</div>
	);
}

export default Upload;
