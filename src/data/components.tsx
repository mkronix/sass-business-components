import CardLayout from '@/components/data-display/CardLayout/CardLayout';
import { DataTableDemo } from '@/components/data-display/DataTable/DataTableDemo';
import DataGridDemo from '@/components/data-display/DatGrid/DataGridDemo';
import ListViewDemo from '@/components/data-display/ListView/ListViewDemo';
import TimeLine from '@/components/data-display/Timeline/TimeLine';
import TreeView from '@/components/data-display/TreeView/TreeView';

// Form Components
import DynamicForm from '@/components/form/DynamicForm/DynamicForm';
import FormField from '@/components/form/FormField/FormField';
import SearchBar from '@/components/form/SearchBar/SearchBar';
import DatePicker from '@/components/form/DatePicker/DatePicker';
import FileUpload from '@/components/form/FileUpload/FileUpload';
import RichTextEditor from '@/components/form/RichTextEditor/RichTextEditor';
import SignaturePad from '@/components/form/SignaturePad/SignaturePad';
import LocationPicker from '@/components/form/LocationPicker/LocationPicker';

// Navigation Components
import ModularNavigation from '@/components/navigation/ModularNavigation/ModularNavigation';
import Breadcrumb from '@/components/navigation/Breadcrumb/Breadcrumb';
import TabNavigation from '@/components/navigation/TabNavigation/TabNavigation';
import Sidebar from '@/components/navigation/Sidebar/Sidebar';
import MegaMenu from '@/components/navigation/MegaMenu/MegaMenu';
import Pagination from '@/components/navigation/Pagination/Pagination';

// Feedback Components
import NotificationCenter from '@/components/feedback/NotificationCenter/NotificationCenter';
import Modal from '@/components/feedback/Modal/Modal';
import StatusIndicator from '@/components/feedback/StatusIndicator/StatusIndicator';
import Toast from '@/components/feedback/Toast/Toast';
import AlertDialog from '@/components/feedback/AlertDialog/AlertDialog';
import ProgressTracker from '@/components/feedback/ProgressTracker/ProgressTracker';

// Chart Components
import ChartWrapper from '@/components/charts/ChartWrapper/ChartWrapper';
import KPICard from '@/components/charts/KPICard/KPICard';
import Dashboard from '@/components/charts/Dashboard/Dashboard';
import MetricDisplay from '@/components/charts/MetricDisplay/MetricDisplay';
import ComparisonChart from '@/components/charts/ComparisonChart/ComparisonChart';
import RealtimeChart from '@/components/charts/RealtimeChart/RealtimeChart';

// Media Components
import ImageGallery from '@/components/media/ImageGallery/ImageGallery';
import DocumentViewer from '@/components/media/DocumentViewer/DocumentViewer';
import MediaPlayer from '@/components/media/MediaPlayer/MediaPlayer';
import PDFViewer from '@/components/media/PDFViewer/PDFViewer';
import ImageEditor from '@/components/media/ImageEditor/ImageEditor';

const COMPONENTS = [
    {
        "id": "data-display",
        "title": "Data Display",
        "url": "/category/data-display",
        "items": [
            {
                "url": "/category/data-display/data-table",
                "name": 'DataTable',
                "description": 'A comprehensive table with sorting, filtering, pagination, and export functionality. Fully responsive with mobile card view.',
                "status": 'ready',
                "component": <DataTableDemo />
            },
            {
                "title": "DataGrid",
                "url": "/category/data-display/data-grid",
                "name": 'DataGrid',
                "description": 'A data grid component with sorting, filtering, pagination, and export functionality. Fully responsive with mobile card view.',
                "status": 'ready',
                "component": <DataGridDemo />

            },
            {
                "title": "ListView",
                "url": "/category/data-display/list-view",
                "name": 'ListView',
                "description": 'A list view component with sorting, filtering, pagination, and export functionality. Fully responsive with mobile card view.',
                "status": 'ready',
                "component": <ListViewDemo />
            },
            {
                "title": "TreeView",
                "url": "/category/data-display/tree-view",
                "name": 'TreeView',
                "description": 'A tree view component with sorting, filtering, pagination, and export functionality. Fully responsive with mobile card view.',
                "status": 'ready',
                "component": <TreeView />

            },
            {
                "title": "Timeline",
                "url": "/category/data-display/timeline",
                "name": 'Timeline',
                "description": 'A timeline component with sorting, filtering, pagination, and export functionality. Fully responsive with mobile card view.',
                "status": 'ready',
                "component": <TimeLine />
            },
            {
                "title": "CardLayout",
                "url": "/category/data-display/card-layout",
                "name": 'CardLayout',
                "description": 'A card layout component with sorting, filtering, pagination, and export functionality. Fully responsive with mobile card view.',
                "status": 'ready',
                "component": <CardLayout />
            }
        ]
    },
    {
        "id": "form",
        "title": "Form Components",
        "url": "/category/form",
        "items": [
            {
                "title": "DynamicForm",
                "url": "/category/form/dynamic-form",
                "name": "DynamicForm",
                "description": "A dynamic form component that can generate forms from configuration objects.",
                "status": "ready",
                "component": <DynamicForm />
            },
            {
                "title": "FormField",
                "url": "/category/form/form-field",
                "name": "FormField",
                "description": "A flexible form field component with validation and various input types.",
                "status": "ready",
                "component": <FormField />
            },
            {
                "title": "SearchBar",
                "url": "/category/form/search-bar",
                "name": "SearchBar",
                "description": "An advanced search bar with autocomplete and filtering capabilities.",
                "status": "ready",
                "component": <SearchBar />
            },
            {
                "title": "DatePicker",
                "url": "/category/form/date-picker",
                "name": "DatePicker",
                "description": "A comprehensive date picker with range selection and calendar view.",
                "status": "ready",
                "component": <DatePicker />
            },
            {
                "title": "FileUpload",
                "url": "/category/form/file-upload",
                "name": "FileUpload",
                "description": "A drag-and-drop file upload component with progress tracking.",
                "status": "ready",
                "component": <FileUpload />
            },
            {
                "title": "RichTextEditor",
                "url": "/category/form/rich-text-editor",
                "name": "RichTextEditor",
                "description": "A WYSIWYG rich text editor with formatting tools and media support.",
                "status": "ready",
                "component": <RichTextEditor />
            },
            {
                "title": "SignaturePad",
                "url": "/category/form/signature-pad",
                "name": "SignaturePad",
                "description": "A digital signature pad component for capturing handwritten signatures.",
                "status": "ready",
                "component": <SignaturePad />
            },
            {
                "title": "LocationPicker",
                "url": "/category/form/location-picker",
                "name": "LocationPicker",
                "description": "A location picker component with map integration and address search.",
                "status": "ready",
                "component": <LocationPicker />
            }
        ]
    },
    {
        "id": "navigation",
        "title": "Navigation",
        "url": "/category/navigation",
        "items": [
            {
                "title": "ModularNavigation",
                "url": "/category/navigation/modular-navigation",
                "name": "ModularNavigation",
                "description": "A modular navigation system with customizable menu structures.",
                "status": "ready",
                "component": <ModularNavigation />
            },
            {
                "title": "Breadcrumb",
                "url": "/category/navigation/breadcrumb",
                "name": "Breadcrumb",
                "description": "A breadcrumb navigation component for hierarchical navigation.",
                "status": "ready",
                "component": <Breadcrumb />
            },
            {
                "title": "TabNavigation",
                "url": "/category/navigation/tab-navigation",
                "name": "TabNavigation",
                "description": "A tab navigation component with dynamic tab management.",
                "status": "ready",
                "component": <TabNavigation />
            },
            {
                "title": "Sidebar",
                "url": "/category/navigation/sidebar",
                "name": "Sidebar",
                "description": "A collapsible sidebar navigation with nested menu support.",
                "status": "ready",
                "component": <Sidebar />
            },
            {
                "title": "MegaMenu",
                "url": "/category/navigation/mega-menu",
                "name": "MegaMenu",
                "description": "A mega menu component with multi-column layouts and rich content.",
                "status": "ready",
                "component": <MegaMenu />
            },
            {
                "title": "Pagination",
                "url": "/category/navigation/pagination",
                "name": "Pagination",
                "description": "A pagination component with page size controls and navigation.",
                "status": "ready",
                "component": <Pagination />
            }
        ]
    },
    {
        "id": "feedback",
        "title": "Feedback & Communication",
        "url": "/category/feedback",
        "items": [
            {
                "title": "NotificationCenter",
                "url": "/category/feedback/notification-center",
                "name": "NotificationCenter",
                "description": "A centralized notification center with filtering and management.",
                "status": "ready",
                "component": <NotificationCenter />
            },
            {
                "title": "Modal",
                "url": "/category/feedback/modal",
                "name": "Modal",
                "description": "A versatile modal dialog component with customizable content.",
                "status": "ready",
                "component": <Modal />
            },
            {
                "title": "StatusIndicator",
                "url": "/category/feedback/status-indicator",
                "name": "StatusIndicator",
                "description": "A status indicator component with various states and animations.",
                "status": "ready",
                "component": <StatusIndicator />
            },
            {
                "title": "Toast",
                "url": "/category/feedback/toast",
                "name": "Toast",
                "description": "A toast notification system with positioning and stacking.",
                "status": "ready",
                "component": <Toast />
            },
            {
                "title": "AlertDialog",
                "url": "/category/feedback/alert-dialog",
                "name": "AlertDialog",
                "description": "An alert dialog component for confirmations and warnings.",
                "status": "ready",
                "component": <AlertDialog />
            },
            {
                "title": "ProgressTracker",
                "url": "/category/feedback/progress-tracker",
                "name": "ProgressTracker",
                "description": "A progress tracking component with step-by-step visualization.",
                "status": "ready",
                "component": <ProgressTracker />
            }
        ]
    },
    {
        "id": "charts",
        "title": "Chart & Analytics",
        "url": "/category/charts",
        "items": [
            {
                "title": "ChartWrapper",
                "url": "/category/charts/chart-wrapper",
                "name": "ChartWrapper",
                "description": "A wrapper component for various chart types with unified API.",
                "status": "ready",
                "component": <ChartWrapper />
            },
            {
                "title": "KPICard",
                "url": "/category/charts/kpi-card",
                "name": "KPICard",
                "description": "A KPI card component for displaying key performance indicators.",
                "status": "ready",
                "component": <KPICard />
            },
            {
                "title": "Dashboard",
                "url": "/category/charts/dashboard",
                "name": "Dashboard",
                "description": "A dashboard component with customizable widgets and layouts.",
                "status": "ready",
                "component": <Dashboard />
            },
            {
                "title": "MetricDisplay",
                "url": "/category/charts/metric-display",
                "name": "MetricDisplay",
                "description": "A metric display component with trend indicators and comparisons.",
                "status": "ready",
                "component": <MetricDisplay />
            },
            {
                "title": "ComparisonChart",
                "url": "/category/charts/comparison-chart",
                "name": "ComparisonChart",
                "description": "A comparison chart component for side-by-side data analysis.",
                "status": "ready",
                "component": <ComparisonChart />
            },
            {
                "title": "RealtimeChart",
                "url": "/category/charts/realtime-chart",
                "name": "RealtimeChart",
                "description": "A real-time chart component with live data streaming.",
                "status": "ready",
                "component": <RealtimeChart />
            }
        ]
    },
    {
        "id": "media",
        "title": "Media & Document",
        "url": "/category/media",
        "items": [
            {
                "title": "ImageGallery",
                "url": "/category/media/image-gallery",
                "name": "ImageGallery",
                "description": "An image gallery component with lightbox and thumbnail views.",
                "status": "ready",
                "component": <ImageGallery />
            },
            {
                "title": "DocumentViewer",
                "url": "/category/media/document-viewer",
                "name": "DocumentViewer",
                "description": "A document viewer component supporting multiple file formats.",
                "status": "ready",
                "component": <DocumentViewer />
            },
            {
                "title": "FileUpload",
                "url": "/category/media/file-upload",
                "name": "FileUpload",
                "description": "A file upload component with drag-and-drop and progress tracking.",
                "status": "ready",
                "component": <FileUpload />
            },
            {
                "title": "MediaPlayer",
                "url": "/category/media/media-player",
                "name": "MediaPlayer",
                "description": "A media player component with playback controls and streaming support.",
                "status": "ready",
                "component": <MediaPlayer />
            },
            {
                "title": "PDFViewer",
                "url": "/category/media/pdf-viewer",
                "name": "PDFViewer",
                "description": "A PDF viewer component with zoom, navigation, and annotation features.",
                "status": "ready",
                "component": <PDFViewer />
            },
            {
                "title": "ImageEditor",
                "url": "/category/media/image-editor",
                "name": "ImageEditor",
                "description": "An image editor component with cropping, filters, and basic editing tools.",
                "status": "ready",
                "component": <ImageEditor />
            }
        ]
    },
    {
        "id": "business-logic",
        "title": "Business Logic",
        "url": "/category/business-logic",
        "items": [
            {
                "title": "WorkflowBuilder",
                "url": "/category/business-logic/workflow-builder"
            },
            {
                "title": "CalendarScheduler",
                "url": "/category/business-logic/calendar-scheduler"
            },
            {
                "title": "InvoiceGenerator",
                "url": "/category/business-logic/invoice-generator"
            },
            {
                "title": "OrderManagement",
                "url": "/category/business-logic/order-management"
            },
            {
                "title": "CustomerPortal",
                "url": "/category/business-logic/customer-portal"
            },
            {
                "title": "InventoryTracker",
                "url": "/category/business-logic/inventory-tracker"
            }
        ]
    },
    {
        "id": "utility",
        "title": "Utility",
        "url": "/category/utility",
        "items": [
            {
                "title": "LoadingStates",
                "url": "/category/utility/loading-states"
            },
            {
                "title": "ConfirmationDialog",
                "url": "/category/utility/confirmation-dialog"
            },
            {
                "title": "HelpTooltip",
                "url": "/category/utility/help-tooltip"
            },
            {
                "title": "ErrorBoundary",
                "url": "/category/utility/error-boundary"
            },
            {
                "title": "DataFormatter",
                "url": "/category/utility/data-formatter"
            },
            {
                "title": "ValidationEngine",
                "url": "/category/utility/validation-engine"
            }
        ]
    },
    {
        "id": "pwa",
        "title": "PWA-Specific",
        "url": "/category/pwa",
        "items": [
            {
                "title": "OfflineIndicator",
                "url": "/category/pwa/offline-indicator"
            },
            {
                "title": "InstallPrompt",
                "url": "/category/pwa/install-prompt"
            },
            {
                "title": "CameraCapture",
                "url": "/category/pwa/camera-capture"
            },
            {
                "title": "PushNotifications",
                "url": "/category/pwa/push-notifications"
            },
            {
                "title": "BackgroundSync",
                "url": "/category/pwa/background-sync"
            },
            {
                "title": "ServiceWorker",
                "url": "/category/pwa/service-worker"
            }
        ]
    },
    {
        "id": "industry",
        "title": "Industry-Specific",
        "url": "/category/industry",
        "items": [
            {
                "title": "POSInterface",
                "url": "/category/industry/pos-interface"
            },
            {
                "title": "AppointmentBooking",
                "url": "/category/industry/appointment-booking"
            },
            {
                "title": "InventoryTracker",
                "url": "/category/industry/inventory-tracker"
            },
            {
                "title": "RestaurantMenu",
                "url": "/category/industry/restaurant-menu"
            },
            {
                "title": "HotelBooking",
                "url": "/category/industry/hotel-booking"
            },
            {
                "title": "MedicalRecords",
                "url": "/category/industry/medical-records"
            }
        ]
    },
    {
        "id": "messaging",
        "title": "Communication & Messaging",
        "url": "/category/messaging",
        "items": [
            {
                "title": "WhatsAppIntegration",
                "url": "/category/messaging/whatsapp-integration"
            },
            {
                "title": "SMSManager",
                "url": "/category/messaging/sms-manager"
            },
            {
                "title": "EmailComposer",
                "url": "/category/messaging/email-composer"
            },
            {
                "title": "ChatInterface",
                "url": "/category/messaging/chat-interface"
            },
            {
                "title": "VideoCall",
                "url": "/category/messaging/video-call"
            },
            {
                "title": "NotificationHub",
                "url": "/category/messaging/notification-hub"
            }
        ]
    },
    {
        "id": "integration",
        "title": "Integration & API",
        "url": "/category/integration",
        "items": [
            {
                "title": "PaymentGateway",
                "url": "/category/integration/payment-gateway"
            },
            {
                "title": "APIConnector",
                "url": "/category/integration/api-connector"
            },
            {
                "title": "LogisticsIntegration",
                "url": "/category/integration/logistics-integration"
            },
            {
                "title": "SocialLogin",
                "url": "/category/integration/social-login"
            },
            {
                "title": "WebhookManager",
                "url": "/category/integration/webhook-manager"
            },
            {
                "title": "DataSync",
                "url": "/category/integration/data-sync"
            }
        ]
    },
    {
        "id": "security",
        "title": "Security & Compliance",
        "url": "/category/security",
        "items": [
            {
                "title": "TwoFactorAuth",
                "url": "/category/security/two-factor-auth"
            },
            {
                "title": "AuditLogger",
                "url": "/category/security/audit-logger"
            },
            {
                "title": "DataEncryption",
                "url": "/category/security/data-encryption"
            },
            {
                "title": "PermissionManager",
                "url": "/category/security/permission-manager"
            },
            {
                "title": "SessionManager",
                "url": "/category/security/session-manager"
            },
            {
                "title": "ComplianceChecker",
                "url": "/category/security/compliance-checker"
            }
        ]
    },
    {
        "id": "reporting",
        "title": "Reporting & Analytics",
        "url": "/category/reporting",
        "items": [
            {
                "title": "ReportBuilder",
                "url": "/category/reporting/report-builder"
            },
            {
                "title": "AdvancedAnalytics",
                "url": "/category/reporting/advanced-analytics"
            },
            {
                "title": "ExportManager",
                "url": "/category/reporting/export-manager"
            },
            {
                "title": "DataVisualization",
                "url": "/category/reporting/data-visualization"
            },
            {
                "title": "ScheduledReports",
                "url": "/category/reporting/scheduled-reports"
            },
            {
                "title": "BusinessIntelligence",
                "url": "/category/reporting/business-intelligence"
            }
        ]
    },
    {
        "id": "user-experience",
        "title": "User Experience",
        "url": "/category/user-experience",
        "items": [
            {
                "title": "OnboardingWizard",
                "url": "/category/user-experience/onboarding-wizard"
            },
            {
                "title": "FeedbackCollector",
                "url": "/category/user-experience/feedback-collector"
            },
            {
                "title": "ThemeCustomizer",
                "url": "/category/user-experience/theme-customizer"
            },
            {
                "title": "UserProfile",
                "url": "/category/user-experience/user-profile"
            },
            {
                "title": "PreferenceManager",
                "url": "/category/user-experience/preference-manager"
            },
            {
                "title": "TourGuide",
                "url": "/category/user-experience/tour-guide"
            }
        ]
    },
    {
        "id": "mobile",
        "title": "Mobile-Specific",
        "url": "/category/mobile",
        "items": [
            {
                "title": "PullToRefresh",
                "url": "/category/mobile/pull-to-refresh"
            },
            {
                "title": "SwipeActions",
                "url": "/category/mobile/swipe-actions"
            },
            {
                "title": "VoiceInput",
                "url": "/category/mobile/voice-input"
            },
            {
                "title": "TouchGestures",
                "url": "/category/mobile/touch-gestures"
            },
            {
                "title": "NativeIntegration",
                "url": "/category/mobile/native-integration"
            },
            {
                "title": "MobileNavigation",
                "url": "/category/mobile/mobile-navigation"
            }
        ]
    },
    {
        "id": "advanced-business",
        "title": "Advanced Business",
        "url": "/category/advanced-business",
        "items": [
            {
                "title": "SubscriptionManager",
                "url": "/category/advanced-business/subscription-manager"
            },
            {
                "title": "LeadManagement",
                "url": "/category/advanced-business/lead-management"
            },
            {
                "title": "ContractManager",
                "url": "/category/advanced-business/contract-manager"
            },
            {
                "title": "CRMIntegration",
                "url": "/category/advanced-business/crm-integration"
            },
            {
                "title": "ERPConnector",
                "url": "/category/advanced-business/erp-connector"
            },
            {
                "title": "BusinessRules",
                "url": "/category/advanced-business/business-rules"
            }
        ]
    },
    {
        "id": "automation",
        "title": "Automation & AI",
        "url": "/category/automation",
        "items": [
            {
                "title": "ChatbotBuilder",
                "url": "/category/automation/chatbot-builder"
            },
            {
                "title": "SmartRecommendations",
                "url": "/category/automation/smart-recommendations"
            },
            {
                "title": "DocumentAI",
                "url": "/category/automation/document-ai"
            },
            {
                "title": "WorkflowAutomation",
                "url": "/category/automation/workflow-automation"
            },
            {
                "title": "MLIntegration",
                "url": "/category/automation/ml-integration"
            },
            {
                "title": "PredictiveAnalytics",
                "url": "/category/automation/predictive-analytics"
            }
        ]
    },
    {
        "id": "collaboration",
        "title": "Collaboration",
        "url": "/category/collaboration",
        "items": [
            {
                "title": "TeamCollaboration",
                "url": "/category/collaboration/team-collaboration"
            },
            {
                "title": "TaskAssignment",
                "url": "/category/collaboration/task-assignment"
            },
            {
                "title": "AnnouncementCenter",
                "url": "/category/collaboration/announcement-center"
            },
            {
                "title": "SharedWorkspace",
                "url": "/category/collaboration/shared-workspace"
            },
            {
                "title": "DocumentSharing",
                "url": "/category/collaboration/document-sharing"
            },
            {
                "title": "TeamCalendar",
                "url": "/category/collaboration/team-calendar"
            }
        ]
    },
    {
        "id": "quality",
        "title": "Quality & Testing",
        "url": "/category/quality",
        "items": [
            {
                "title": "SurveyBuilder",
                "url": "/category/quality/survey-builder"
            },
            {
                "title": "A/BTesting",
                "url": "/category/quality/ab-testing"
            },
            {
                "title": "QualityAssurance",
                "url": "/category/quality/quality-assurance"
            },
            {
                "title": "TestingFramework",
                "url": "/category/quality/testing-framework"
            },
            {
                "title": "FeedbackSystem",
                "url": "/category/quality/feedback-system"
            },
            {
                "title": "QualityMetrics",
                "url": "/category/quality/quality-metrics"
            }
        ]
    },
    {
        "id": "location",
        "title": "Location & Mapping",
        "url": "/category/location",
        "items": [
            {
                "title": "MapIntegration",
                "url": "/category/location/map-integration"
            },
            {
                "title": "LocationPicker",
                "url": "/category/location/location-picker"
            },
            {
                "title": "GeofenceManager",
                "url": "/category/location/geofence-manager"
            },
            {
                "title": "RouteOptimization",
                "url": "/category/location/route-optimization"
            },
            {
                "title": "LocationTracking",
                "url": "/category/location/location-tracking"
            },
            {
                "title": "StoreLocator",
                "url": "/category/location/store-locator"
            }
        ]
    },
    {
        "id": "accessibility",
        "title": "Accessibility & Localization",
        "url": "/category/accessibility",
        "items": [
            {
                "title": "AccessibilityHelper",
                "url": "/category/accessibility/accessibility-helper"
            },
            {
                "title": "MultiLanguage",
                "url": "/category/accessibility/multi-language"
            },
            {
                "title": "RegionalCompliance",
                "url": "/category/accessibility/regional-compliance"
            },
            {
                "title": "CulturalAdaptation",
                "url": "/category/accessibility/cultural-adaptation"
            },
            {
                "title": "ScreenReader",
                "url": "/category/accessibility/screen-reader"
            },
            {
                "title": "KeyboardNavigation",
                "url": "/category/accessibility/keyboard-navigation"
            }
        ]
    },
    {
        "id": "performance",
        "title": "Performance & Monitoring",
        "url": "/category/performance",
        "items": [
            {
                "title": "PerformanceMonitor",
                "url": "/category/performance/performance-monitor"
            },
            {
                "title": "UsageAnalytics",
                "url": "/category/performance/usage-analytics"
            },
            {
                "title": "SystemHealth",
                "url": "/category/performance/system-health"
            },
            {
                "title": "ErrorTracking",
                "url": "/category/performance/error-tracking"
            },
            {
                "title": "LoadTesting",
                "url": "/category/performance/load-testing"
            },
            {
                "title": "OptimizationTools",
                "url": "/category/performance/optimization-tools"
            }
        ]
    }
]

export default COMPONENTS
