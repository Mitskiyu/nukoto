import { useImageStore } from "../lib/image-store";
import { handleUpload } from "../lib/handle-upload";
import { downloadImage, downloadAll } from "../lib/handle-download";
import pointer from "../assets/images/pointer.svg";
import alert from "../assets/images/alert.svg";
import undo from "../assets/images/undo.svg";
import cloudDownload from "../assets/images/cloud-download.svg";
import nukoKickingRock from "../assets/images/nukoKickingRock.gif";
import nukoClean from "../assets/images/nukoClean.gif";

function Output() {
    const images = useImageStore((state) => state.images);
    const settings = useImageStore((state) => state.settings);
    const hasDone = images.some((image) => image.status === "done");
    const hasImages = images.length > 0;

    if (!hasImages) {
        return (
            <div
                className="w-full h-[360px] mx-auto sm:h-[632px] flex flex-col font-koden bg-mochasurface0 outline-1 outline-mochasurface1 rounded-sm">
                <h1 className="text-xl sm:text-2xl ml-2.5 sm:ml-3.5 mt-2 sm:mt-3 text-mochalavender">
                    Output
                </h1>
                <hr className="border-1 mt-2 border-mochasurface1" />
                <div className="flex flex-col justify-center h-full items-center">
                    <img className="w-12 h-12 sm:w-14 sm:h-14" src={nukoKickingRock} alt="nuko cat kicking rock" />
                    <p className="text-mochapink sm:text-2xl text-lg pt-1">
                        Upload an image to start converting
                    </p>
                    <p className="text-mochatext sm:text-md text-sm pt-1">
                        Adjust settings to customize output
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="w-full h-[360px] sm:h-[632px] flex flex-col font-koden text-mochatext bg-mochasurface0 outline-1 outline-mochasurface1 rounded-sm">
            <div className="flex flex-row items-center">
                <h1 className="text-xl sm:text-2xl ml-2.5 sm:ml-3.5 mt-2 sm:mt-3 text-mochalavender">
                    Output
                </h1>
                <div className="mr-2.5 sm:mr-3.5 sm:text-lg text-sm flex w-full justify-end space-x-2 mt-2">
                    {hasDone && (
                        <button onClick={() => downloadAll()}
                            className="cursor-pointer hover:bg-mochasurface2 focus:outline-none sm:h-8 h-6 bg-mochasurface1
                text-mochapink rounded-md text-center w-24 sm:w-36 transition-colors duration-200"
                        >
                            Download All
                        </button>
                    )}
                    <button onClick={handleUpload}
                        className="cursor-pointer hover:bg-mochasurface2 focus:outline-none sm:h-8 h-6 bg-mochasurface1 text-mochapink rounded-md text-center sm:w-24 w-16 transition-colors duration-200">
                        Convert
                    </button>

                    <button onClick={() => useImageStore.getState().clearImages()}
                        className="cursor-pointer hover:bg-mochasurface2 focus:outline-none sm:h-8 h-6 bg-mochasurface1
                text-mochapink rounded-md text-center sm:w-20 w-12 transition-colors duration-200"
                    >
                        Clear
                    </button>
                </div>
            </div>
            <hr className="border-1 mt-2 border-mochasurface1" />
            <div className="flex flex-col mt-3 w-full overflow-y-auto">
                {images.map((image, index) => (
                    <div key={index} className="w-full px-2.5 sm:px-3.5">
                        <div className="w-full flex flex-row items-center">
                            <img className="w-12 h-12 sm:w-14 sm:h-14 rounded-sm" src={image.previewURL} alt="preview image" />
                            <div className="flex flex-col ml-2 overflow-hidden flex-1">
                                <p className="text-sm text-mochatext sm:text-lg text-clip">
                                    {image.status !== "done"
                                        ? image.file.name
                                        : `${image.file.name.split(".")[0]}.${image.convertedFormat?.toLowerCase()}`}
                                </p>
                                <div className="-mt-0.5 text-md text-mochapink">
                                    {image.status === "pending" && (
                                        <div className="flex flex-row items-center gap-x-2">
                                            <span className="text-clip">
                                                {image.file.name
                                                    .substring(image.file.name.lastIndexOf(".") + 1)
                                                    .toUpperCase()}
                                            </span>
                                            <img className="w-4 h-4" src={pointer} alt="pointer" />
                                            <span className="text-mochapink">{settings.format.toUpperCase()}</span>
                                        </div>
                                    )}
                                    {image.status === "converting" && (
                                        <img className="w-4 h-4 sm:w-5 sm:h-5" src={nukoClean} alt="nuko cat cleaning" />
                                    )}
                                    {image.status === "done" && (
                                        <div className="flex flex-row items-center gap-x-2">
                                            <span className="text-clip">
                                                {image.file.name
                                                    .substring(image.file.name.lastIndexOf(".") + 1)
                                                    .toUpperCase()}
                                            </span>
                                            <img className="w-4 h-4" src={pointer} alt="pointer" />
                                            <span className="text-mochapink">{image.convertedFormat?.toUpperCase()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center ml-auto">
                                {image.status === "done" && (
                                    <button onClick={() => downloadImage(image.id)}
                                        className="p-1 mr-1 hover:bg-mochasurface1 cursor-pointer rounded-sm"
                                    >
                                        <img className="w-4 h-4 sm:w-5 sm:h-5" src={cloudDownload} alt="download" />
                                    </button>
                                )}
                                {image.status === "error" && (
                                    <img className="w-4 h-4 sm:w-5 sm:h-5" src={alert} alt="alert" />
                                )}
                                <button onClick={() => useImageStore.getState().deleteImage(image.id)}
                                    className="p-1 hover:bg-mochasurface1 rounded-sm cursor-pointer"
                                >
                                    <img className="w-4 h-4 sm:w-5 sm:h-5" src={undo} alt="undo" />
                                </button>
                            </div>
                        </div>
                        <hr className="border-1 mt-2 mb-2 rounded-sm border-mochasurface1" />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Output;
