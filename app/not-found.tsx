"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Get the current path from window.location
    const path = window.location.pathname;

    // Check if we're on GitHub Pages and the path doesn't include the repo name
    const repo = "team-decision-simulator";
    const isGitHubPages = window.location.hostname.includes("github.io");

    if (isGitHubPages && !path.includes(`/${repo}`)) {
      // Redirect to the correct path with the repo name
      const correctPath = `/${repo}${path}`;
      window.location.href = correctPath;
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <button
        onClick={() => router.push("/")}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        Go to Homepage
      </button>
    </div>
  );
}
