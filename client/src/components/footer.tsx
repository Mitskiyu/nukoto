function Footer() {
    return (
        <footer className="w-full bg-mochamantle border-t-mochacrust border-t-2 h-8 sm:h-12 sm:mt-0 mt-4">
            <div className="w-full max-w-6xl mx-auto sm:py-2 flex items-center justify-center">
                <p className="font-koden text-mochalavender text-lg">
                    nukoto <span className="text-mochamauve">•</span> {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    )
}
export default Footer;
