import nukoCamera from "../assets/images/nukoCamera.gif";
import github from "../assets/images/github.svg";

function Header() {
	return (
		<header className="w-full sm:h-16 h-12 bg-mochamantle flex justify-center border-b-mochacrust border-b-2">
			<div className="w-full max-w-6xl px-4 mx-auto flex items-center justify-between">
				<div className="flex gap-x-2 items-center">
					<h1 className="font-koden text-mochalavender sm:text-6xl text-4xl">
						nukoto
					</h1>
					<img
						className="sm:h-14 sm:w-14 w-10 h-10"
						src={nukoCamera}
						alt="nuko cat with camera"
					/>
				</div>
				<a
					className="sm:h-12 sm:w-12 h-10 w-10 rounded-xl bg-mochasurface0 flex items-center justify-center cursor-pointer hover:bg-mochaoverlay0/40 outline-mochacrust outline-2"
					href="https://github.com/Mitskiyu/nukoto"
				>
					<img
						className="sm:h-10 sm:w-10 h-8 w-8"
						src={github}
						alt="github logo"
					/>
				</a>
			</div>
		</header>
	);
}

export default Header;
