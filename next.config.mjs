/** @type {import('next').NextConfig} */
const nextConfig = {
    // Explicitly set the root to the current project directory to avoid 
    // root inference conflicts with parent directory lockfiles.
    experimental: {
        turbopackRoot: '.',
    }
};

export default nextConfig;
