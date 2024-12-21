import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/app/ui/Logo.jpg';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between bg-blue-800 px-4 py-3 text-white shadow-md">
      {/* Logo Section */}
      <div className="flex items-center">
        <Image
          src={Logo}
          width={50} // Smaller and more professional size
          height={50}
          alt="Novetiv Logo"
          className="rounded-full" // Optional: Add rounded style for a polished look
        />
        <span className="ml-2 text-lg font-semibold">Novetiv</span>
      </div>

      {/* Navigation Links */}
      <ul className="flex items-center gap-4">
        <li>
          <Link href="/" className="hover:text-gray-200 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-gray-200 transition-colors">
            About
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-gray-200 transition-colors">
            Contact
          </Link>
        </li>
        <li>
          <Link
            href="/login"
            className="rounded bg-white px-4 py-2 text-blue-800 font-medium transition-colors hover:bg-gray-100"
          >
            Log In
          </Link>
        </li>
      </ul>
    </nav>
  );
}
