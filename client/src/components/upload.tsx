import { useCallback } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useImageStore } from "../lib/image-store";
import { toast } from "sonner";
import nukoPeek from "../assets/images/nukoPeek.gif";

function Upload() {
    const addImages = useImageStore((state) => state.addImages);

    const onDrop = useCallback(
        (acceptedFiles: File[], fileRejections: FileRejection[]) => {
            if (acceptedFiles.length > 0) {
                addImages(acceptedFiles);
            }

            if (fileRejections.length > 0) {
                fileRejections.forEach(({ file, errors }) => {
                    toast.error(
                        <div>
                            <strong>{file.name}:</strong>
                            <ul>
                                {errors.map((err, index) => (
                                    <li key={index}>{err.message}</li>
                                ))}
                            </ul>
                        </div>,
                    );
                });
            }
        },
        [addImages],
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
        maxSize: 20 * 1024 * 1024,
        maxFiles: 30,
    });

    return (
        <div className="w-full h-[256px] bg-mochasurface0 outline-1 outline-mochasurface1 rounded-sm flex flex-col font-koden">
            <h2 className="text-2xl text-mochalavender ml-3.5 mt-3">Upload Image</h2>
            <div className="flex flex-1 items-center justify-center">
                <div {...getRootProps()}
                    className="w-11/12 h-10/12 flex flex-col bg-transparent outline-2 outline-dashed outline-mochaoverlay0 cursor-pointer hover:outline-mochamauve hover:text-mochamauve rounded-sm items-center justify-center transition-colors duration-200">
                    <input {...getInputProps()} />
                    <img className="h-12 w-12 mt-8" src={nukoPeek} alt="nuko cat peek envelope" />
                    <p className="text-mochatext text-md">
                        Click to select or drag images here
                    </p>
                    <p className="text-mochasubtext0 text-sm mt-2">
                        Supports PNG, JPG, WEBP, AVIF.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Upload;
