function Footer() {
    return (
        <footer className="w-full bg-mantle border-t-crust border-t-2">
            <div className="w-full max-w-6xl px-4 mx-auto py-4 flex items-center justify-center">
                <p className="font-koden text-lavender text-lg">
                    nukoto <span className="text-mauve">•</span> {new Date().getFullYear()}
                </p>
            </div>
        </footer>

    )
}

export default Footer;
