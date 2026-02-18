import { z } from 'zod';
import PersonalDetailsFormFiller from '../components/Dashboards/PersonalDetailsFormFiller';
import NavigateToService from '../components/Dashboards/NavigateToService';

/**
 * Tambo component registry.
 * The AI agent picks the right component based on user messages.
 */
export const tamboComponents = [
    {
        name: 'NavigateToService',
        description:
            'Use this when the user wants to navigate to a specific banking service or feature. ' +
            'For example: "I want to open an account", "open account", "start account opening", ' +
            '"apply for a loan", "get a credit card". Renders a card and auto-navigates to the service. ' +
            'Only "account" is currently available; all others are coming soon.',
        component: NavigateToService,
        propsSchema: z.object({
            service: z
                .enum(['account', 'loans', 'cards', 'invest', 'insurance', 'tax'])
                .describe(
                    'The service to navigate to. Use "account" for account opening, "loans" for loans, etc.'
                ),
            title: z.string().optional().describe('Optional display title override'),
            description: z.string().optional().describe('Optional description override'),
        }),
    },
    {
        name: 'PersonalDetailsFormFiller',
        description:
            'Renders a summary card of personal details and auto-fills Step 1 (Personal Details) of the bank account opening form. ' +
            'Use this ONLY when the user is already on the account opening form AND provides their personal information ' +
            'like date of birth, gender, marital status, parent name, or nationality. ' +
            'Do NOT use this to navigate — use NavigateToService for navigation.',
        component: PersonalDetailsFormFiller,
        propsSchema: z.object({
            fullName: z
                .string()
                .optional()
                .describe("The applicant's full name"),
            dob: z
                .string()
                .optional()
                .describe(
                    "Date of birth in YYYY-MM-DD format, e.g. '1998-05-14'. Must be 18+ years ago from today."
                ),
            gender: z
                .enum(['male', 'female', 'other'])
                .optional()
                .describe("Gender: 'male', 'female', or 'other'"),
            maritalStatus: z
                .enum(['single', 'married', 'divorced', 'widowed'])
                .optional()
                .describe("Marital status: 'single', 'married', 'divorced', or 'widowed'"),
            parentsName: z
                .string()
                .optional()
                .describe("Full name of the applicant's father or mother"),
            nationality: z
                .string()
                .optional()
                .describe("Nationality, e.g. 'Indian'. Defaults to 'Indian' if not specified."),
        }),
    },
];

/**
 * Tambo tools — callable functions the AI can invoke to get context.
 */
export const tamboTools = [
    {
        name: 'get-app-context',
        description:
            'Returns context about the current app state: which view is active, what services are available, and what the user can do.',
        tool: () => ({
            availableServices: [
                { id: 'account', label: 'Account Opening', available: true },
                { id: 'loans', label: 'Loans', available: false },
                { id: 'cards', label: 'Cards', available: false },
                { id: 'invest', label: 'Invest', available: false },
                { id: 'insurance', label: 'Insurance', available: false },
                { id: 'tax', label: 'Tax', available: false },
            ],
            note: 'Only Account Opening is currently available. All others are coming soon.',
        }),
        inputSchema: z.object({}),
        outputSchema: z.object({
            availableServices: z.array(
                z.object({ id: z.string(), label: z.string(), available: z.boolean() })
            ),
            note: z.string(),
        }),
    },
    {
        name: 'get-form-context',
        description:
            'Returns context about which form step is currently active and what fields are required. Call this when the user is filling the account opening form.',
        tool: () => ({
            currentStep: 1,
            stepName: 'Personal Details',
            requiredFields: ['dob', 'parentsName'],
            optionalFields: ['fullName', 'gender', 'maritalStatus', 'nationality'],
            notes:
                'Full Name is editable. Date of birth must be at least 18 years in the past.',
        }),
        inputSchema: z.object({}),
        outputSchema: z.object({
            currentStep: z.number(),
            stepName: z.string(),
            requiredFields: z.array(z.string()),
            optionalFields: z.array(z.string()),
            notes: z.string(),
        }),
    },
];
