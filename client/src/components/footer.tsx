function Footer() {
    return (
        <footer className="w-full bg-mantle border-t-crust border-t-2 h-8 sm:h-12 sm:mt-0 mt-4">
            <div className="w-full max-w-6xl mx-auto sm:py-2 flex items-center justify-center">
                <p className="font-koden text-lavender text-lg">
                    nukoto <span className="text-mauve">•</span> {new Date().getFullYear()}
                </p>
            </div>
        </footer>
    )
}
export default Footer;
