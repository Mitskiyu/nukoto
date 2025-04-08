import { useImageStore, Format } from "../lib/image-store";
import arrow from "../assets/images/arrow.svg";

function Settings() {
	const updateSettings = useImageStore((state) => state.updateSettings);
	const currentQuality = useImageStore((state) => state.settings.quality);

	const handleQuality = (e: React.ChangeEvent<HTMLInputElement>) => {
		const updatedQuality = +e.target.value;
		updateSettings({ quality: updatedQuality });
	};

	const handleFormat = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const updatedFormat = e.target.value as Format;
		updateSettings({ format: updatedFormat });
	};

	return (
		<div className="w-full font-koden text-mochatext sm:h-[360px] h-[280px] flex flex-col bg-mochasurface0 outline-1 outline-mochasurface1 rounded-sm">
			<h1 className="text-2xl mb-4 ml-3.5 mt-3 text-mochalavender">Settings</h1>
			<div className="w-full flex flex-col -mt-2">
				<div className="flex justify-between items-center w-11/12 mx-auto">
					<label className="text-xl">Quality</label>
					<span className="text-lg text-mochapink">{currentQuality}</span>
				</div>
				<div className="w-11/12 mx-auto">
					<input
						type="range"
						min="1"
						max="100"
						step="1"
						value={currentQuality}
						onChange={handleQuality}
						className="w-full h-2 focus:outline-none bg-mochasurface1 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-mochamauve"
					/>
					<span className="text-xs text-mochasubtext0">
						Higher values may result in large file sizes
					</span>
				</div>
				<div className="w-11/12 mx-auto mt-4">
					<label className="text-xl">Convert to</label>
					<div className="relative mt-2">
						<select
							onChange={handleFormat}
							className="w-full cursor-pointer focus:outline-none h-8 bg-mochasurface1 text-mochapink text-lg rounded-md appearance-none pl-2 pr-8 hover:bg-mochasurface2"
						>
							<option>PNG</option>
							<option>JPG</option>
							<option>WEBP</option>
							<option>AVIF</option>
						</select>
						<img
							className="absolute right-2 z-10 top-1/2 transform -translate-y-1/2 pointer-events-none"
							src={arrow}
							alt="dropdown arrow"
						/>
					</div>
				</div>
				<div className="w-11/12 mx-auto mt-6 flex items-center">
					<input
						type="checkbox"
						id="compress"
						disabled={true}
						className="w-4 h-4 cursor-pointer accent-mochamauve focus:outline-none bg-mochasurface1 rounded"
					/>
					<label htmlFor="compress" className="text-xl ml-2 cursor-pointer">
						Compress
						<span className="text-sm ml-2 text-mochasubtext0">coming soon</span>
					</label>
				</div>
			</div>
		</div>
	);
}

export default Settings;
