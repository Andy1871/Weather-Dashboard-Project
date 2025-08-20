import { Home } from "lucide-react";
import Link from "next/link";

export default function HomeButton() {
  return (
    <Link href="/" aria-label="Go to home" className="inline-flex items-center">
      <Home
        className="mr-2 h-4 w-4 text-gray-200 hover:text-gray-400"
        aria-hidden="true"
      />
    </Link>
  );
}
