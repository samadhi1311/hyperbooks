export const PLAN_LIMITS = {
	starter: {
		invoicesPerMonth: 5,
		billsPerMonth: 5,
		exports: 20,
		branding: true,
		customTheme: false,
		dailyAnalytics: 30,
		ai: false,
	},
	pro: {
		invoicesPerMonth: 25,
		billsPerMonth: 25,
		exports: Infinity,
		branding: false,
		customTheme: true,
		dailyAnalytics: 90,
		ai: true,
	},
	ultimate: {
		invoicesPerMonth: 500,
		billsPerMonth: 500,
		exports: Infinity,
		branding: false,
		customTheme: true,
		dailyAnalytics: 365,
		ai: true,
	},
};
