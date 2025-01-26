import type { NextConfig } from 'next';

const env = process.env.NEXT_CONFIG_ENV || 'production';

const config: Record<string, Partial<NextConfig>> = {
	development: {
		output: 'export',
	},
	production: {
		output: 'export',
		experimental: {
			esmExternals: 'loose',
		},
	},
};

const nextConfig: NextConfig = {
	...config[env],
};

export default nextConfig;
