import type { NextConfig } from "next";

const githubPagesPathRaw = process.env.NEXT_PUBLIC_GITHUB_PAGES_BASE_PATH?.trim() ?? ''
const githubPagesTrimmed = githubPagesPathRaw.replace(/\/$/, '')
const normalizedGithubPagesPath = githubPagesTrimmed
    ? githubPagesTrimmed.startsWith('/')
        ? githubPagesTrimmed
        : `/${githubPagesTrimmed}`
    : ''

const baseConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'placehold.co',
            },
            {
                protocol: 'https',
                hostname: 'loremflickr.com',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
        ],
    },
    experimental: {
        optimizePackageImports: ['lucide-react'],
    },
}

const githubPagesConfig: Partial<NextConfig> = normalizedGithubPagesPath
    ? {
          basePath: normalizedGithubPagesPath,
          assetPrefix: normalizedGithubPagesPath,
      }
    : {}

const nextConfig: NextConfig = {
    ...baseConfig,
    ...githubPagesConfig,
}

export default nextConfig;
