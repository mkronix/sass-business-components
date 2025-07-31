import {
    Table,
    FormInput,
    Navigation,
    MessageSquare,
    BarChart3,
    FileImage,
    Briefcase,
    Wrench,
    Smartphone,
    Building,
    MessageCircle,
    Plug,
    Shield,
    FileText,
    User,
    Monitor,
    Zap,
    Bot,
    Users,
    TestTube,
    MapPin,
    Globe,
    Activity,
    ChevronRight,
    Grid3X3,
    List,
    Calendar,
    Workflow,
    Receipt,
    Bell,
    AlertTriangle,
    PieChart,
    Camera,
    Upload,
    Eye,
    LoaderIcon,
    HelpCircle,
    Wifi,
    Download,
    ShoppingCart,
    Clock,
    Package,
    Mail,
    CreditCard,
    Link,
    Truck,
    Key,
    FileCheck,
    Lock,
    BarChart,
    TrendingUp,
    Share2,
    Star,
    Palette,
    RefreshCw,
    Mic,
    UserPlus,
    Megaphone,
    ClipboardList,
    Target,
    CheckCircle,
    Map,
    MapPinIcon,
    Languages,
    Gauge,
    TrendingDown,
    MoveRightIcon
} from 'lucide-react';



export const categories = [
    {
        id: 'data-display',
        title: 'Data Display',
        icon: Table,
        items: [
            { title: 'DataTable', path: '/categories/data-display/data-table', icon: Table },
            { title: 'DataGrid', path: '/categories/data-display/data-grid', icon: Grid3X3 },
            { title: 'ListView', path: '/categories/data-display/list-view', icon: List },
            { title: 'TreeView', path: '/categories/data-display/tree-view', icon: Navigation },
            { title: 'Timeline', path: '/categories/data-display/timeline', icon: Clock },
            { title: 'CardLayout', path: '/categories/data-display/card-layout', icon: Grid3X3 }
        ]
    },
    {
        id: 'form',
        title: 'Form Components',
        icon: FormInput,
        items: [
            { title: 'DynamicForm', path: '/categories/form/dynamic-form', icon: FormInput },
            { title: 'FormField', path: '/categories/form/form-field', icon: FormInput },
            { title: 'SearchBar', path: '/categories/form/search-bar', icon: FormInput },
            { title: 'DatePicker', path: '/categories/form/date-picker', icon: Calendar },
            { title: 'FileUpload', path: '/categories/form/file-upload', icon: Upload },
            { title: 'RichTextEditor', path: '/categories/form/rich-text-editor', icon: FileText },
            { title: 'SignaturePad', path: '/categories/form/signature-pad', icon: FormInput },
            { title: 'LocationPicker', path: '/categories/form/location-picker', icon: MapPin }
        ]
    },
    {
        id: 'navigation',
        title: 'Navigation',
        icon: Navigation,
        items: [
            { title: 'ModularNavigation', path: '/categories/navigation/modular-navigation', icon: Navigation },
            { title: 'Breadcrumb', path: '/categories/navigation/breadcrumb', icon: ChevronRight },
            { title: 'TabNavigation', path: '/categories/navigation/tab-navigation', icon: Navigation },
            { title: 'Sidebar', path: '/categories/navigation/sidebar', icon: Navigation },
            { title: 'MegaMenu', path: '/categories/navigation/mega-menu', icon: Navigation },
            { title: 'Pagination', path: '/categories/navigation/pagination', icon: Navigation }
        ]
    },
    {
        id: 'feedback',
        title: 'Feedback & Communication',
        icon: MessageSquare,
        items: [
            { title: 'NotificationCenter', path: '/categories/feedback/notification-center', icon: Bell },
            { title: 'Modal', path: '/categories/feedback/modal', icon: MessageSquare },
            { title: 'StatusIndicator', path: '/categories/feedback/status-indicator', icon: AlertTriangle },
            { title: 'Toast', path: '/categories/feedback/toast', icon: Bell },
            { title: 'AlertDialog', path: '/categories/feedback/alert-dialog', icon: AlertTriangle },
            { title: 'ProgressTracker', path: '/categories/feedback/progress-tracker', icon: TrendingUp }
        ]
    },
    {
        id: 'charts',
        title: 'Chart & Analytics',
        icon: BarChart3,
        items: [
            { title: 'ChartWrapper', path: '/categories/charts/chart-wrapper', icon: BarChart3 },
            { title: 'KPICard', path: '/categories/charts/kpi-card', icon: PieChart },
            { title: 'Dashboard', path: '/categories/charts/dashboard', icon: BarChart },
            { title: 'MetricDisplay', path: '/categories/charts/metric-display', icon: TrendingUp },
            { title: 'ComparisonChart', path: '/categories/charts/comparison-chart', icon: BarChart3 },
            { title: 'RealtimeChart', path: '/categories/charts/realtime-chart', icon: Activity }
        ]
    },
    {
        id: 'media',
        title: 'Media & Document',
        icon: FileImage,
        items: [
            { title: 'ImageGallery', path: '/categories/media/image-gallery', icon: FileImage },
            { title: 'DocumentViewer', path: '/categories/media/document-viewer', icon: Eye },
            { title: 'FileUpload', path: '/categories/media/file-upload', icon: Upload },
            { title: 'MediaPlayer', path: '/categories/media/media-player', icon: FileImage },
            { title: 'PDFViewer', path: '/categories/media/pdf-viewer', icon: FileText },
            { title: 'ImageEditor', path: '/categories/media/image-editor', icon: FileImage }
        ]
    },
    {
        id: 'business-logic',
        title: 'Business Logic',
        icon: Briefcase,
        items: [
            { title: 'WorkflowBuilder', path: '/categories/business-logic/workflow-builder', icon: Workflow },
            { title: 'CalendarScheduler', path: '/categories/business-logic/calendar-scheduler', icon: Calendar },
            { title: 'InvoiceGenerator', path: '/categories/business-logic/invoice-generator', icon: Receipt },
            { title: 'OrderManagement', path: '/categories/business-logic/order-management', icon: Package },
            { title: 'CustomerPortal', path: '/categories/business-logic/customer-portal', icon: User },
            { title: 'InventoryTracker', path: '/categories/business-logic/inventory-tracker', icon: Package }
        ]
    },
    {
        id: 'utility',
        title: 'Utility',
        icon: Wrench,
        items: [
            { title: 'LoadingStates', path: '/categories/utility/loading-states', icon: LoaderIcon },
            { title: 'ConfirmationDialog', path: '/categories/utility/confirmation-dialog', icon: AlertTriangle },
            { title: 'HelpTooltip', path: '/categories/utility/help-tooltip', icon: HelpCircle },
            { title: 'ErrorBoundary', path: '/categories/utility/error-boundary', icon: AlertTriangle },
            { title: 'DataFormatter', path: '/categories/utility/data-formatter', icon: Wrench },
            { title: 'ValidationEngine', path: '/categories/utility/validation-engine', icon: CheckCircle }
        ]
    },
    {
        id: 'pwa',
        title: 'PWA-Specific',
        icon: Smartphone,
        items: [
            { title: 'OfflineIndicator', path: '/categories/pwa/offline-indicator', icon: Wifi },
            { title: 'InstallPrompt', path: '/categories/pwa/install-prompt', icon: Download },
            { title: 'CameraCapture', path: '/categories/pwa/camera-capture', icon: Camera },
            { title: 'PushNotifications', path: '/categories/pwa/push-notifications', icon: Bell },
            { title: 'BackgroundSync', path: '/categories/pwa/background-sync', icon: RefreshCw },
            { title: 'ServiceWorker', path: '/categories/pwa/service-worker', icon: Wrench }
        ]
    },
    {
        id: 'industry',
        title: 'Industry-Specific',
        icon: Building,
        items: [
            { title: 'POSInterface', path: '/categories/industry/pos-interface', icon: ShoppingCart },
            { title: 'AppointmentBooking', path: '/categories/industry/appointment-booking', icon: Clock },
            { title: 'InventoryTracker', path: '/categories/industry/inventory-tracker', icon: Package },
            { title: 'RestaurantMenu', path: '/categories/industry/restaurant-menu', icon: List },
            { title: 'HotelBooking', path: '/categories/industry/hotel-booking', icon: Building },
            { title: 'MedicalRecords', path: '/categories/industry/medical-records', icon: FileText }
        ]
    },
    {
        id: 'messaging',
        title: 'Communication & Messaging',
        icon: MessageCircle,
        items: [
            { title: 'WhatsAppIntegration', path: '/categories/messaging/whatsapp-integration', icon: MessageCircle },
            { title: 'SMSManager', path: '/categories/messaging/sms-manager', icon: MessageCircle },
            { title: 'EmailComposer', path: '/categories/messaging/email-composer', icon: Mail },
            { title: 'ChatInterface', path: '/categories/messaging/chat-interface', icon: MessageSquare },
            { title: 'VideoCall', path: '/categories/messaging/video-call', icon: Monitor },
            { title: 'NotificationHub', path: '/categories/messaging/notification-hub', icon: Bell }
        ]
    },
    {
        id: 'integration',
        title: 'Integration & API',
        icon: Plug,
        items: [
            { title: 'PaymentGateway', path: '/categories/integration/payment-gateway', icon: CreditCard },
            { title: 'APIConnector', path: '/categories/integration/api-connector', icon: Link },
            { title: 'LogisticsIntegration', path: '/categories/integration/logistics-integration', icon: Truck },
            { title: 'SocialLogin', path: '/categories/integration/social-login', icon: Users },
            { title: 'WebhookManager', path: '/categories/integration/webhook-manager', icon: Plug },
            { title: 'DataSync', path: '/categories/integration/data-sync', icon: RefreshCw }
        ]
    },
    {
        id: 'security',
        title: 'Security & Compliance',
        icon: Shield,
        items: [
            { title: 'TwoFactorAuth', path: '/categories/security/two-factor-auth', icon: Key },
            { title: 'AuditLogger', path: '/categories/security/audit-logger', icon: FileCheck },
            { title: 'DataEncryption', path: '/categories/security/data-encryption', icon: Lock },
            { title: 'PermissionManager', path: '/categories/security/permission-manager', icon: Shield },
            { title: 'SessionManager', path: '/categories/security/session-manager', icon: Clock },
            { title: 'ComplianceChecker', path: '/categories/security/compliance-checker', icon: CheckCircle }
        ]
    },
    {
        id: 'reporting',
        title: 'Reporting & Analytics',
        icon: FileText,
        items: [
            { title: 'ReportBuilder', path: '/categories/reporting/report-builder', icon: BarChart },
            { title: 'AdvancedAnalytics', path: '/categories/reporting/advanced-analytics', icon: TrendingUp },
            { title: 'ExportManager', path: '/categories/reporting/export-manager', icon: Download },
            { title: 'DataVisualization', path: '/categories/reporting/data-visualization', icon: BarChart3 },
            { title: 'ScheduledReports', path: '/categories/reporting/scheduled-reports', icon: Clock },
            { title: 'BusinessIntelligence', path: '/categories/reporting/business-intelligence', icon: TrendingUp }
        ]
    },
    {
        id: 'user-experience',
        title: 'User Experience',
        icon: User,
        items: [
            { title: 'OnboardingWizard', path: '/categories/user-experience/onboarding-wizard', icon: UserPlus },
            { title: 'FeedbackCollector', path: '/categories/user-experience/feedback-collector', icon: Star },
            { title: 'ThemeCustomizer', path: '/categories/user-experience/theme-customizer', icon: Palette },
            { title: 'UserProfile', path: '/categories/user-experience/user-profile', icon: User },
            { title: 'PreferenceManager', path: '/categories/user-experience/preference-manager', icon: Wrench },
            { title: 'TourGuide', path: '/categories/user-experience/tour-guide', icon: HelpCircle }
        ]
    },
    {
        id: 'mobile',
        title: 'Mobile-Specific',
        icon: Monitor,
        items: [
            { title: 'PullToRefresh', path: '/categories/mobile/pull-to-refresh', icon: RefreshCw },
            { title: 'SwipeActions', path: '/categories/mobile/swipe-actions', icon: MoveRightIcon },
            { title: 'VoiceInput', path: '/categories/mobile/voice-input', icon: Mic },
            { title: 'TouchGestures', path: '/categories/mobile/touch-gestures', icon: Smartphone },
            { title: 'NativeIntegration', path: '/categories/mobile/native-integration', icon: Smartphone },
            { title: 'MobileNavigation', path: '/categories/mobile/mobile-navigation', icon: Navigation }
        ]
    },
    {
        id: 'advanced-business',
        title: 'Advanced Business',
        icon: Zap,
        items: [
            { title: 'SubscriptionManager', path: '/categories/advanced-business/subscription-manager', icon: CreditCard },
            { title: 'LeadManagement', path: '/categories/advanced-business/lead-management', icon: Users },
            { title: 'ContractManager', path: '/categories/advanced-business/contract-manager', icon: FileText },
            { title: 'CRMIntegration', path: '/categories/advanced-business/crm-integration', icon: Users },
            { title: 'ERPConnector', path: '/categories/advanced-business/erp-connector', icon: Building },
            { title: 'BusinessRules', path: '/categories/advanced-business/business-rules', icon: Wrench }
        ]
    },
    {
        id: 'automation',
        title: 'Automation & AI',
        icon: Bot,
        items: [
            { title: 'ChatbotBuilder', path: '/categories/automation/chatbot-builder', icon: Bot },
            { title: 'SmartRecommendations', path: '/categories/automation/smart-recommendations', icon: TrendingUp },
            { title: 'DocumentAI', path: '/categories/automation/document-ai', icon: FileText },
            { title: 'WorkflowAutomation', path: '/categories/automation/workflow-automation', icon: Workflow },
            { title: 'MLIntegration', path: '/categories/automation/ml-integration', icon: Bot },
            { title: 'PredictiveAnalytics', path: '/categories/automation/predictive-analytics', icon: TrendingUp }
        ]
    },
    {
        id: 'collaboration',
        title: 'Collaboration',
        icon: Users,
        items: [
            { title: 'TeamCollaboration', path: '/categories/collaboration/team-collaboration', icon: Users },
            { title: 'TaskAssignment', path: '/categories/collaboration/task-assignment', icon: ClipboardList },
            { title: 'AnnouncementCenter', path: '/categories/collaboration/announcement-center', icon: Megaphone },
            { title: 'SharedWorkspace', path: '/categories/collaboration/shared-workspace', icon: Share2 },
            { title: 'DocumentSharing', path: '/categories/collaboration/document-sharing', icon: FileText },
            { title: 'TeamCalendar', path: '/categories/collaboration/team-calendar', icon: Calendar }
        ]
    },
    {
        id: 'quality',
        title: 'Quality & Testing',
        icon: TestTube,
        items: [
            { title: 'SurveyBuilder', path: '/categories/quality/survey-builder', icon: ClipboardList },
            { title: 'A/BTesting', path: '/categories/quality/ab-testing', icon: Target },
            { title: 'QualityAssurance', path: '/categories/quality/quality-assurance', icon: CheckCircle },
            { title: 'TestingFramework', path: '/categories/quality/testing-framework', icon: TestTube },
            { title: 'FeedbackSystem', path: '/categories/quality/feedback-system', icon: Star },
            { title: 'QualityMetrics', path: '/categories/quality/quality-metrics', icon: BarChart }
        ]
    },
    {
        id: 'location',
        title: 'Location & Mapping',
        icon: MapPin,
        items: [
            { title: 'MapIntegration', path: '/categories/location/map-integration', icon: Map },
            { title: 'LocationPicker', path: '/categories/location/location-picker', icon: MapPinIcon },
            { title: 'GeofenceManager', path: '/categories/location/geofence-manager', icon: MapPin },
            { title: 'RouteOptimization', path: '/categories/location/route-optimization', icon: Navigation },
            { title: 'LocationTracking', path: '/categories/location/location-tracking', icon: MapPin },
            { title: 'StoreLocator', path: '/categories/location/store-locator', icon: Building }
        ]
    },
    {
        id: 'accessibility',
        title: 'Accessibility & Localization',
        icon: Globe,
        items: [
            { title: 'AccessibilityHelper', path: '/categories/accessibility/accessibility-helper', icon: HelpCircle },
            { title: 'MultiLanguage', path: '/categories/accessibility/multi-language', icon: Languages },
            { title: 'RegionalCompliance', path: '/categories/accessibility/regional-compliance', icon: Globe },
            { title: 'CulturalAdaptation', path: '/categories/accessibility/cultural-adaptation', icon: Globe },
            { title: 'ScreenReader', path: '/categories/accessibility/screen-reader', icon: User },
            { title: 'KeyboardNavigation', path: '/categories/accessibility/keyboard-navigation', icon: Navigation }
        ]
    },
    {
        id: 'performance',
        title: 'Performance & Monitoring',
        icon: Activity,
        items: [
            { title: 'PerformanceMonitor', path: '/categories/performance/performance-monitor', icon: Gauge },
            { title: 'UsageAnalytics', path: '/categories/performance/usage-analytics', icon: BarChart },
            { title: 'SystemHealth', path: '/categories/performance/system-health', icon: Activity },
            { title: 'ErrorTracking', path: '/categories/performance/error-tracking', icon: AlertTriangle },
            { title: 'LoadTesting', path: '/categories/performance/load-testing', icon: TrendingDown },
            { title: 'OptimizationTools', path: '/categories/performance/optimization-tools', icon: Zap }
        ]
    }
];