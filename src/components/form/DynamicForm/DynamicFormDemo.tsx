import { FormConfig } from '@/contexts/FormContext';
import { useToast } from '@/hooks/use-toast';
import React, { useState } from 'react'
import { WizardForm } from './form/WizardForm';
import { DynamicFieldArray } from './form/DynamicFieldArray';
import { LayoutTemplate } from './form/LayoutTemplates';
import { DynamicForm } from './form/DynamicForm';

const DynamicFormDemo = () => {
    const { toast } = useToast();

    const contactForm: FormConfig = {
        fields: [
            {
                id: 'firstName',
                type: 'text',
                label: 'First Name',
                placeholder: 'Enter your first name',
                required: true,
                gridColumnSpan: 1,
                floatingLabel: true,
                ariaLabel: 'First name input field',
                helpText: 'Enter your legal first name as it appears on official documents'
            },
            {
                id: 'lastName',
                type: 'text',
                label: 'Last Name',
                placeholder: 'Enter your last name',
                required: true,
                gridColumnSpan: 1,
                floatingLabel: true,
                ariaLabel: 'Last name input field'
            },
            {
                id: 'email',
                type: 'email',
                label: 'Email Address',
                placeholder: 'Enter your email',
                required: true,
                gridColumnSpan: 2,
                validation: {
                    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
                },
                ariaLabel: 'Email address input field',
                ariaDescription: 'We will use this email to contact you'
            },
            {
                id: 'phone',
                type: 'text',
                label: 'Phone Number',
                placeholder: 'Enter your phone number',
                gridColumnSpan: 1,
                conditional: {
                    field: 'contactMethod',
                    operator: 'equals',
                    value: 'phone'
                }
            },
            {
                id: 'contactMethod',
                type: 'select',
                label: 'Preferred Contact Method',
                required: true,
                gridColumnSpan: 1,
                options: [
                    { value: 'email', label: 'Email' },
                    { value: 'phone', label: 'Phone' },
                    { value: 'both', label: 'Both' }
                ]
            },
            {
                id: 'message',
                type: 'textarea',
                label: 'Message',
                placeholder: 'Tell us how we can help you...',
                required: true,
                gridColumnSpan: 2,
                validation: {
                    minLength: 10,
                    maxLength: 500
                },
                ariaLabel: 'Message textarea',
                ariaDescription: 'Please provide details about your inquiry (10-500 characters)'
            }
        ],
        gridColumns: 2,
        spacing: 'lg',
        variant: 'default',
        keyboardShortcuts: {
            'ctrl+enter': () => toast({ title: 'Form submitted!', description: 'Keyboard shortcut worked!' })
        },
        onSubmit: (data) => {
            toast({
                title: 'Contact Form Submitted!',
                description: `Thank you ${data.firstName}! We'll contact you via ${data.contactMethod}.`
            });
        }
    };

    const surveyForm: FormConfig = {
        fields: [
            {
                id: 'satisfaction',
                type: 'radio',
                label: 'How satisfied are you with our service?',
                required: true,
                gridColumnSpan: 2,
                options: [
                    { value: 'very-satisfied', label: 'Very Satisfied' },
                    { value: 'satisfied', label: 'Satisfied' },
                    { value: 'neutral', label: 'Neutral' },
                    { value: 'dissatisfied', label: 'Dissatisfied' },
                    { value: 'very-dissatisfied', label: 'Very Dissatisfied' }
                ],
                ariaLabel: 'Service satisfaction rating'
            },
            {
                id: 'recommend',
                type: 'checkbox',
                gridColumnSpan: 2,
                label: 'Would you recommend us to others?',
                ariaLabel: 'Recommendation checkbox'
            },
            {
                id: 'improvements',
                type: 'textarea',
                label: 'What could we improve?',
                placeholder: 'Share your suggestions...',
                gridColumnSpan: 2,
                conditional: {
                    field: 'satisfaction',
                    operator: 'not_equals',
                    value: 'very-satisfied'
                },
                ariaLabel: 'Improvement suggestions textarea'
            },
            {
                id: 'followUp',
                type: 'select',
                label: 'Follow-up preference',
                options: [
                    { value: 'none', label: 'No follow-up needed' },
                    { value: 'email', label: 'Email follow-up' },
                    { value: 'call', label: 'Phone call' }
                ],
                ariaLabel: 'Follow-up preference selection'
            }
        ],
        gridColumns: 1,
        spacing: 'lg',
        variant: 'default',
        onSubmit: (data) => {
            toast({
                title: 'Survey Submitted!',
                description: 'Thank you for your valuable feedback!'
            });
        }
    };

    // New Advanced Forms
    const wizardSteps = [
        {
            id: 'personal',
            title: 'Personal Information',
            description: 'Tell us about yourself',
            fields: [
                {
                    id: 'fullName',
                    type: 'text' as const,
                    label: 'Full Name',
                    required: true,
                    floatingLabel: true,
                    ariaLabel: 'Full name input',
                    placeholder: 'Enter your Full name',

                },
                {
                    id: 'dateOfBirth',
                    type: 'text' as const,
                    label: 'Date of Birth',
                    placeholder: 'MM/DD/YYYY',
                    required: true,
                    ariaLabel: 'Date of birth input'
                },
                {
                    id: 'gender',
                    type: 'select' as const,
                    label: 'Gender',
                    options: [
                        { value: 'male', label: 'Male' },
                        { value: 'female', label: 'Female' },
                        { value: 'other', label: 'Other' },
                        { value: 'prefer-not-to-say', label: 'Prefer not to say' }
                    ],
                    ariaLabel: 'Gender selection'
                }
            ]
        },
        {
            id: 'address',
            title: 'Address Information',
            description: 'Where can we reach you?',
            fields: [
                {
                    id: 'street',
                    type: 'text' as const,
                    label: 'Street Address',
                    required: true,
                    floatingLabel: true,
                    ariaLabel: 'Street address input'
                },
                {
                    id: 'city',
                    type: 'text' as const,
                    label: 'City',
                    required: true,
                    floatingLabel: true,
                    ariaLabel: 'City input'
                },
                {
                    id: 'state',
                    type: 'text' as const,
                    label: 'State/Province',
                    required: true,
                    ariaLabel: 'State or province input'
                },
                {
                    id: 'zipCode',
                    type: 'text' as const,
                    label: 'ZIP/Postal Code',
                    required: true,
                    ariaLabel: 'ZIP or postal code input'
                }
            ]
        },
        {
            id: 'preferences',
            title: 'Preferences',
            description: 'Customize your experience',
            canSkip: true,
            fields: [
                {
                    id: 'newsletter',
                    type: 'checkbox' as const,
                    label: 'Subscribe to our newsletter',
                    ariaLabel: 'Newsletter subscription checkbox'
                },
                {
                    id: 'notifications',
                    type: 'radio' as const,
                    label: 'Notification preferences',
                    options: [
                        { value: 'all', label: 'All notifications' },
                        { value: 'important', label: 'Important only' },
                        { value: 'none', label: 'No notifications' }
                    ],
                    ariaLabel: 'Notification preferences selection'
                }
            ]
        }
    ];

    const fieldArrayConfig = {
        id: 'emergencyContacts',
        label: 'Emergency Contacts',
        minItems: 1,
        maxItems: 3,
        addButtonText: 'Add Contact',
        fields: [
            {
                id: 'name',
                type: 'text' as const,
                label: 'Contact Name',
                required: true,
                // floatingLabel: true,
                ariaLabel: 'Emergency contact name',
                placeholder: 'Enter contact name',

            },
            {
                id: 'relationship',
                type: 'select' as const,
                label: 'Relationship',
                required: true,
                options: [
                    { value: 'spouse', label: 'Spouse' },
                    { value: 'parent', label: 'Parent' },
                    { value: 'sibling', label: 'Sibling' },
                    { value: 'friend', label: 'Friend' },
                    { value: 'other', label: 'Other' }
                ],
                ariaLabel: 'Relationship to emergency contact'
            },
            {
                id: 'phone',
                type: 'text' as const,
                label: 'Phone Number',
                required: true,
                floatingLabel: true,
                ariaLabel: 'Emergency contact phone number',
                placeholder: 'Enter phone number'
            }
        ]
    };

    const layoutGroups = [
        {
            id: 'basic',
            title: 'Basic Information',
            description: 'Essential details about you',
            fields: [
                {
                    id: 'name',
                    type: 'text' as const,
                    label: 'Full Name',
                    required: true,
                    floatingLabel: true,
                    ariaLabel: 'Full name input',
                    placeholder: 'Enter your Full name',

                },
                {
                    id: 'email',
                    type: 'email' as const,
                    label: 'Email',
                    required: true,
                    floatingLabel: true,
                    ariaLabel: 'Email input',
                    placeholder: 'Enter your Email',
                }
            ]
        },
        {
            id: 'advanced',
            title: 'Advanced Settings',
            description: 'Optional configuration',
            fields: [
                {
                    id: 'theme',
                    type: 'select' as const,
                    label: 'Preferred Theme',
                    options: [
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' },
                        { value: 'auto', label: 'Auto' }
                    ]
                },
                {
                    id: 'language',
                    type: 'select' as const,
                    label: 'Language',
                    options: [
                        { value: 'en', label: 'English' },
                        { value: 'es', label: 'Spanish' },
                        { value: 'fr', label: 'French' }
                    ]
                }
            ]
        }
    ];

    const [layoutTemplate, setLayoutTemplate] = useState<'card' | 'accordion' | 'tabs'>('card');

    return (
        <div className="space-y-12">
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className=" space-y-2">
                        <h2 className="text-2xl font-semibold text-foreground">Multi-Step Wizard</h2>
                        <p className="text-muted-foreground">
                            Complete form with progress tracking, breadcrumbs, and conditional navigation
                        </p>
                    </div>
                    <WizardForm
                        steps={wizardSteps}
                        showBreadcrumbs={true}
                        showProgress={true}
                        progressType="step-based"
                        onComplete={(data) => {
                            toast({
                                title: 'Wizard Completed!',
                                description: `Welcome ${data.fullName}! Your registration is complete.`
                            });
                        }}
                    />
                </div>

                <div className='flex flex-col gap-2'>
                    <div className=" space-y-2">
                        <h2 className="text-2xl font-semibold text-foreground">Dynamic Field Arrays</h2>
                        <p className="text-muted-foreground">
                            Add and remove repeatable field groups dynamically
                        </p>
                    </div>
                    <div className="">
                        <DynamicFieldArray config={fieldArrayConfig} />
                    </div>
                </div>
            </div>

            <div className='flex flex-col gap-2'>
                <div className=" space-y-4">
                    <h2 className="text-2xl font-semibold text-foreground">Layout Templates</h2>
                    <p className="text-muted-foreground">
                        Different layout options for organizing form fields
                    </p>
                    <div className="flex justify-center gap-2">
                        {(['card', 'accordion', 'tabs'] as const).map((template) => (
                            <button
                                key={template}
                                onClick={() => setLayoutTemplate(template)}
                                className={`px-3 py-1 rounded text-sm transition-colors ${layoutTemplate === template
                                    ? 'bg-secondary text-secondary-foreground'
                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                    }`}
                            >
                                {template.charAt(0).toUpperCase() + template.slice(1).replace('-', ' ')}
                            </button>
                        ))}
                    </div>
                </div>
                <LayoutTemplate
                    groups={layoutGroups}
                    template={layoutTemplate}
                />
            </div>


            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='flex flex-col gap-2'>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold text-foreground">Enhanced Contact Form</h2>
                        <p className="text-muted-foreground">
                            Contact form with floating labels, conditional fields, and accessibility features
                        </p>
                    </div>
                    <div className="">
                        <DynamicForm config={contactForm} />
                    </div>
                </div>

                <div className='flex flex-col gap-2'>
                    <div className=" space-y-2">
                        <h2 className="text-2xl font-semibold text-foreground">Interactive Survey</h2>
                        <p className="text-muted-foreground">
                            Survey form with conditional logic and improved styling
                        </p>
                    </div>
                    <div className="">
                        <DynamicForm config={surveyForm} />
                    </div>
                </div>
            </div>
        </div>

    )
}

export default DynamicFormDemo