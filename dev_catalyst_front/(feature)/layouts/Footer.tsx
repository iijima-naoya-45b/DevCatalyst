import { Brain } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-6 px-4 bg-gradient-to-br from-gold to-bronze text-navy-deepest">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center space-x-2">
          <Brain className="w-6 h-6 text-gold" />
          <p className="text-sm">&copy; 2025 My App. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
