import { z } from 'zod';
import PersonalDetailsFormFiller from '../components/Dashboards/PersonalDetailsFormFiller';
import NavigateToService from '../components/Dashboards/NavigateToService';
import ContactDetailsFormFiller from '../components/Dashboards/ContactDetailsFormFiller';
import { appContextBridge } from './appContextBridge';

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
            'Renders a summary card and auto-fills Step 1 (Personal Details) of the account opening form. ' +
            'Use this when the user provides personal info like DOB, gender, marital status, parent name. ' +
            'Do NOT use if the user is providing contact info (mobile, email, address) - use ContactDetailsFormFiller instead.',
        component: PersonalDetailsFormFiller,
        propsSchema: z.object({
            fullName: z.string().optional(),
            dob: z.string().optional().describe("YYYY-MM-DD format"),
            gender: z.enum(['male', 'female', 'other']).optional(),
            maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']).optional(),
            parentsName: z.string().optional(),
            nationality: z.string().optional(),
        }),
    },
    {
        name: 'ContactDetailsFormFiller',
        description:
            'Renders a summary card and auto-fills Step 2 (Contact Information) of the account opening form. ' +
            'Use this when the user provides contact info like mobile number, email, address, city, state, pin code. ' +
            'Also use this if the user says their permanent address is the same as current address.',
        component: ContactDetailsFormFiller,
        propsSchema: z.object({
            mobileNumber: z.string().optional().describe("10-digit mobile number"),
            email: z.string().optional().describe("Email address"),
            currentAddress: z.string().optional().describe("Current residential address"),
            permanentAddressSame: z.boolean().optional().describe("True if user says permanent address is same as current"),
            permanentAddress: z.string().optional().describe("Permanent address. If same as current, leave empty and set permanentAddressSame=true."),
            city: z.string().optional(),
            state: z.string().optional(),
            pincode: z.string().optional().describe("6-digit PIN code"),
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
            'Returns context about the current app state: available services and general navigation status.',
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
            'Returns context about the ACTIVE form step. Call this to know which fields to ask for (Personal vs Contact vs KYC).',
        tool: () => {
            const ctx = appContextBridge.get();
            return {
                currentStep: ctx.currentStep,
                stepName: ctx.stepName,
                requiredFields: ctx.requiredFields,
                optionalFields: ctx.optionalFields,
                notes: ctx.notes || '',
            };
        },
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
