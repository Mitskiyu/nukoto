import Header from "./components/header";
import Upload from "./components/upload";
import Settings from "./components/settings";
import Output from "./components/output";
import Footer from "./components/footer";

function App() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="container flex-1 w-full max-w-6xl mx-auto px-4 sm:mt-20 mt-4 grid md:grid-cols-12 gap-4">
                <div className="md:col-span-4 col-span-1 space-y-4">
                    <Upload />
                    <Settings />
                </div>
                <div className="md:col-span-8 col-span-1">
                    <Output />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default App;
