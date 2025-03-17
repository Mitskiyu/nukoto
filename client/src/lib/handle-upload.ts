export async function handleUpload(files: File[]) {
	const formData = new FormData();

	files.forEach((file) => {
		formData.append("images", file);
	});

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
