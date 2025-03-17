import nukoKickingRock from "../assets/images/nukoKickingRock.gif";

function Output() {
	return (
		<div className="w-full h-[360px] sm:h-[632px] flex flex-col font-koden bg-surface0 outline-1 outline-surface1 rounded-sm">
			<h1 className="text-2xl ml-3.5 mt-3 text-lavender">Output</h1>
			<hr className="border-1 mt-2 border-surface1" />
			<div className="flex flex-col justify-center h-full items-center">
				<img
					className="w-14 h-14"
					src={nukoKickingRock}
					alt="nuko cat kicking rock"
				/>
				<p className="text-text sm:text-2xl text-lg pt-1">
					Upload an image to start converting
				</p>
				<p className="text-subtext0 sm:text-md text-sm pt-1">
					Adjust settings to customize output
				</p>
			</div>
		</div>
	);
}

export default Output;
