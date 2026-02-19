import { z } from 'zod';
import PersonalDetailsFormFiller from '../components/Dashboards/PersonalDetailsFormFiller';
import NavigateToService from '../components/Dashboards/NavigateToService';
import ContactDetailsFormFiller from '../components/Dashboards/ContactDetailsFormFiller';
import KYCFormFiller from '../components/Dashboards/KYCFormFiller';
import AccountDetailsFormFiller from '../components/Dashboards/AccountDetailsFormFiller';
import FinancialDetailsFormFiller from '../components/Dashboards/FinancialDetailsFormFiller';
import NomineeDetailsFormFiller from '../components/Dashboards/NomineeDetailsFormFiller';
import ServicesSelectionFormFiller from '../components/Dashboards/ServicesSelectionFormFiller';
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
            'For example: "I want to open an account". Renders a card and auto-navigates.',
        component: NavigateToService,
        propsSchema: z.object({
            service: z.enum(['account', 'loans', 'cards', 'invest', 'insurance', 'tax']),
            title: z.string().optional(),
            description: z.string().optional(),
        }),
    },
    {
        name: 'PersonalDetailsFormFiller',
        description: 'Auto-fills Step 1 (Personal Details). Use for DOB, gender, marital status, parents name.',
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
        description: 'Auto-fills Step 2 (Contact Information). Use for mobile, email, address, city, state, pincode.',
        component: ContactDetailsFormFiller,
        propsSchema: z.object({
            mobileNumber: z.string().optional(),
            email: z.string().optional(),
            currentAddress: z.string().optional(),
            permanentAddressSame: z.boolean().optional(),
            permanentAddress: z.string().optional(),
            city: z.string().optional(),
            state: z.string().optional(),
            pincode: z.string().optional(),
        }),
    },
    {
        name: 'KYCFormFiller',
        description: 'Auto-fills Step 3 (KYC Details). Use for PAN, Aadhaar, Passport.',
        component: KYCFormFiller,
        propsSchema: z.object({
            panNumber: z.string().optional(),
            aadhaarNumber: z.string().optional(),
            passportNumber: z.string().optional(),
        }),
    },
    {
        name: 'AccountDetailsFormFiller',
        description: 'Auto-fills Step 4 (Account Details). Use for account type, branch, mode, deposit.',
        component: AccountDetailsFormFiller,
        propsSchema: z.object({
            accountType: z.enum(['savings', 'current', 'salary']).optional(),
            branchPreference: z.string().optional(),
            modeOfOperation: z.enum(['self', 'joint']).optional(),
            initialDeposit: z.string().optional(),
        }),
    },
    {
        name: 'FinancialDetailsFormFiller',
        description: 'Auto-fills Step 5 (Financial Details). Use for employment, employer name, income, source of funds.',
        component: FinancialDetailsFormFiller,
        propsSchema: z.object({
            employment: z.enum(['salaried', 'self-employed', 'student', 'retired', 'homemaker', 'unemployed']).optional(),
            employerName: z.string().optional(),
            annualIncome: z.string().optional().describe("Annual income range e.g. '< 1 Lakh', '1-5 Lakhs', etc."),
            sourceOfFunds: z.string().optional(),
        }),
    },
    {
        name: 'NomineeDetailsFormFiller',
        description: 'Auto-fills Step 6 (Nominee Details). Use for nominee name, relation, DOB, address.',
        component: NomineeDetailsFormFiller,
        propsSchema: z.object({
            nomineeName: z.string().optional(),
            nomineeRelation: z.string().optional(),
            nomineeDob: z.string().optional(),
            nomineeAddress: z.string().optional(),
        }),
    },
    {
        name: 'ServicesSelectionFormFiller',
        description: 'Auto-fills Step 7 (Services). Use for debit card, net banking, mobile banking, cheque book, SMS alerts.',
        component: ServicesSelectionFormFiller,
        propsSchema: z.object({
            debitCard: z.boolean().optional(),
            netBanking: z.boolean().optional(),
            mobileBanking: z.boolean().optional(),
            chequeBook: z.boolean().optional(),
            smsAlerts: z.boolean().optional(),
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
            'Returns context about the ACTIVE form step. Call this to know which fields to ask for.',
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
    {
        name: 'navigate-form-step',
        description:
            'Navigates between form steps. Use "next" to proceed after filling a form, "back" to review, or "goto" to jump to a specific step.',
        tool: (args: { direction: 'next' | 'back' | 'goto'; step?: number }) => {
            appContextBridge.navigate(args.direction, args.step);
            return {
                message: `Navigated ${args.direction}${args.step ? ` to step ${args.step}` : ''}`,
                success: true
            };
        },
        inputSchema: z.object({
            direction: z.enum(['next', 'back', 'goto']),
            step: z.number().optional().describe('Only required for "goto" direction'),
        }),
        outputSchema: z.object({
            message: z.string(),
            success: z.boolean(),
        }),
    }
];
