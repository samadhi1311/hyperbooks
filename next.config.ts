import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	output: 'export',
	experimental: {
		esmExternals: 'loose',
	},
};

export default nextConfig;
