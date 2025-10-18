import { Brain } from "lucide-react";

export function Header() {
  return (
    <header className="p-4 bg-gradient-to-br from-gold to-bronze text-navy-deepest">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white">
            <Brain className="w-6 h-6 text-gold" />
          </div>
          <h1 className="text-lg font-bold">My App</h1>
        </div>
        <nav className="flex space-x-4 items-center">
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:underline">Home</a></li>
            <li><a href="#" className="hover:underline">About</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
