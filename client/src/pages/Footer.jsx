// Footer.jsx
import React from "react";

const footerLinks = [
  { name: "About", url: "#" },
  { name: "Download the X app", url: "#" },
  { name: "Grok", url: "#" },
  { name: "Help Center", url: "#" },
  { name: "Terms of Service", url: "#" },
  { name: "Privacy Policy", url: "#" },
  { name: "Cookie Policy", url: "#" },
  { name: "Accessibility", url: "#" },
  { name: "Ads info", url: "#" },
  { name: "Blog", url: "#" },
  { name: "Careers", url: "#" },
  { name: "Brand Resources", url: "#" },
  { name: "Advertising", url: "#" },
  { name: "Marketing", url: "#" },
  { name: "X for Business", url: "#" },
  { name: "Developers", url: "#" },
  { name: "Directory", url: "#" },
  { name: "Settings", url: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 p-6 text-sm">
      <div className="flex flex-wrap gap-2 md:gap-4">
        {footerLinks.map((link, idx) => (
          <a key={idx} href={link.url} className="hover:text-white">
            {link.name}
          </a>
        ))}
      </div>
      <div className="mt-4">&copy; 2025 X Corp.</div>
    </footer>
  );
}
