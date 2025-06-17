export const ROUTES = {
	GUEST: {
		path: '/',
	},
	NOT_FOUND_PAGE: {
		path: '*',
	},
}
export const SUPER_ADMIN_ROUTES = {
	DEFAULT: {
		path: '/',
	},
	COMPANY: {
		path: '/company',
	},
	COMPANY_INNER: {
		path: '/company/:companyId',
	},
	TARIFFS: {
		path: '/tariffs',
	},
	SETTINGS: {
		path: '/settings',
	},
}
export const ADMIN_ROUTES = {
	DEFAULT: {
		path: '/',
	},
	CALENDAR_NOTIFICATION: {
		path: '/notifications',
	},
	MASTERS: {
		path: '/:id/masters',
	},
	MASTER: {
		path: '/:id/master/:masterID',
	},
	MASTER_APPOINTMENT: {
		path: '/:id/master/:masterID/appoinments',
	},
	MASTER_REWIEVS: {
		path: '/:id/master/:masterID/rewievs',
	},
	MASTER_SERVICE: {
		path: '/:id/master/:masterID/service',
	},
	MASTER_SPECIALIZATION: {
		path: '/:id/master/:masterID/specialization',
	},
	MASTER_ABOUT: {
		path: '/:id/master/:masterID/about-master',
	},
	SERVICES: {
		path: '/:id/services',
	},
	SERVICES_INNER: {
		path: '/service/:id',
	},
	USERS: {
		path: '/users',
	},
	SCHEDULES: {
		path: '/schedules',
	},
	SETTINGS: {
		path: '/settings',
	},
	REPORTS: {
		path: '/reports',
	},
	REPORT_DAY: {
		path: '/reports/report-day',
	},
	REPORT_MASTERS: {
		path: '/reports/masters',
	},
	REPORT_SALARY: {
		path: '/reports/salary',
	},
	REPORT_EXPENSES: {
		path: '/reports/expenses',
	},
	REPORT_HISTORY: {
		path: '/reports/history',
	},
	REPORT_DISCOUNT: {
		path: '/reports/discount',
	},
}

export const USER_ROUTES = {
	DEFAULT: {
		path: '/',
	},
	NOT_FOUND_PAGE: {
		path: '*',
	},
	PROFILE: {
		path: '/profile',
	},
	HISTORY: {
		path: '/history',
	},
	HISTORY_INFO: {
		path: '/history/:id',
	},
	PARTNER: {
		path: '/partner',
	},
	CONTACTS: {
		path: '/contacts',
	},
	CATEGORY: {
		path: '/:typeBranch',
	},
	PRIVACY: {
		path: '/privacy',
	},
	TERMS: {
		path: '/terms',
	},
	APPOINTMENT: {
		path: ':id/service/:AppoinmentId',
	},
	APPOINTMENTMASTER: {
		path: ':id/master/:AppoinmentId',
	},
	APPOINTMENTMASTERTOSERVICE: {
		path: ':id/master/:AppoinmentId/:serviceId',
	},
	MASTER_PAGE: {
		path: '/:branchId/masterinfo/:id',
	},
}

export const MASTER_ROUTES = {
	DEFAULT: {
		path: '/',
	},
	DASHBOARD: {
		path: '/dashboard',
	},
	USERS: {
		path: '/users',
	},
	USERS_INNER: {
		path: '/users/:userId',
	},
	ANNOUNCEMENTS: {
		path: '/announcements',
	},
	SUPPORT: {
		path: '/supports',
	},
}

export const PERSONAL_ROUTES = {
	DEFAULT: {
		path: '/',
	},
	CALENDAR: {
		path: '/calendar',
	},
	CALENDAR_NOTIFICATION: {
		path: '/calendar/notifications',
	},
	SCHEDULE: {
		path: '/schedule',
	},
	SERVICE: {
		path: '/service',
	},
	CLIENTS: {
		path: '/clients',
	},
	VISITS: {
		path: '/visits',
	},
	WORKS: {
		path: '/works',
	},
	REPORTS: {
		path: '/reports',
	},
	REPORT_DAY: {
		path: '/reports/report-day',
	},
	REPORT_EXPENSES: {
		path: '/reports/expenses',
	},
	REPORT_HISTORY: {
		path: '/reports/history',
	},
	REPORT_DISCOUNT: {
		path: '/reports/discount',
	},
	BANNER: {
		path: '/banner',
	},
	SOCIAL: {
		path: '/socials',
	},
	SETTINGS: {
		path: '/settings',
	},
	SUBSCRIPTION: {
		path: '/subscription',
	},
	SUBSCRIPTION_EXTENSION: {
		path: '/subscription/extension',
	},
}

export const OWNER_ROUTES = {
	SCHEDULES: {
		path: '/schedules',
	},
	DEFAULT: {
		path: '/',
	},
	DASHBOARD: {
		path: '/dashboard',
	},
	AFFILIATE: {
		path: '/affiliate',
	},
	PROFILE: {
		path: '/profile',
	},
	AFFILIATECREATE: {
		path: '/affiliate/create',
	},
	ADMINS: {
		path: '/admins',
	},
	SERVICES: {
		path: '/services',
	},
	SETTINGS: {
		path: '/settings',
	},
	ADMINSCREATE: {
		path: '/admins/create-admin',
	},
	SUPPORT: {
		path: '/supports',
	},
	BONUS: {
		path: '/bonus',
	},
	PROMOCODE: {
		path: '/promocode',
	},
	OURWORKS: {
		path: '/settings/works',
	},
	FACILITES: {
		path: '/settings/facilities',
	},
	SAMPLE: {
		path: '/settings/sample',
	},
	SERVICES_INNER: {
		path: '/service/:id',
	},
	MASTER: {
		path: '/:id/master/:masterID',
	},
	MASTER_APPOINTMENT: {
		path: '/:id/master/:masterID/appoinments',
	},
	MASTER_REWIEVS: {
		path: '/:id/master/:masterID/rewievs',
	},
	MASTER_SERVICE: {
		path: '/:id/master/:masterID/service',
	},
	MASTER_SPECIALIZATION: {
		path: '/:id/master/:masterID/specialization',
	},
	MASTER_ABOUT: {
		path: '/:id/master/:masterID/about-master',
	},
	MASTER_PRIVILAGE: {
		path: '/:id/master/:masterID/privilage',
	},
	SUBSCRIPTION: {
		path: '/subscription',
	},
	SUBSCRIPTION_EXTENSION: {
		path: '/subscription/extension',
	},
	ANALYTICS: {
		path: '/analytics',
	},
	REPORTS: {
		path: '/reports',
	},
	MARKETING: {
		path: '/marketing',
	},
}
