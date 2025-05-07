import { FaCopyright } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white py-3 mt-12">
      <div className="max-w-screen-xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2">
          <FaCopyright className="h-4 w-4" />
          <span>EventHub 2025. All rights reserved.</span>
        </div>
        <div>
          Developed by{" "}
          <a
            href="https://github.com/Ma5Codes"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-300"
            aria-label="Developer GitHub Profile"
          >
            Ma5Codes
          </a>
        </div>
      </div>
    </footer>
  );
}
