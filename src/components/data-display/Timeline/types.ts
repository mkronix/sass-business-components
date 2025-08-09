interface TimelineEvent {
    id: string;
    title: string;
    description?: string;
    date: string;
    time?: string;
    type?: 'milestone' | 'event' | 'achievement' | 'meeting' | 'task' | 'default';
    status?: 'completed' | 'current' | 'upcoming' | 'cancelled';
    location?: string;
    author?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    tags?: string[];
    metadata?: Record<string, any>;
}

interface TimelineProps {
    events: TimelineEvent[];
    variant?: 1 | 2 | 3 | 4;
    className?: string;
    onEventClick?: (event: TimelineEvent) => void;
    onEventEdit?: (event: TimelineEvent) => void;
    onEventDelete?: (event: TimelineEvent) => void;
    showTime?: boolean;
    showLocation?: boolean;
    showAuthor?: boolean;
    showPriority?: boolean;
    showTags?: boolean;
    allowInteraction?: boolean;
    theme?: 'dark' | 'light';
}

interface TimelineVariantProps {
    events: TimelineEvent[];
    onEventClick?: (event: TimelineEvent) => void;
    onEventEdit?: (event: TimelineEvent) => void;
    onEventDelete?: (event: TimelineEvent) => void;
    showTime?: boolean;
    showLocation?: boolean;
    showAuthor?: boolean;
    showPriority?: boolean;
    showTags?: boolean;
    allowInteraction?: boolean;
}

export type { TimelineEvent, TimelineProps, TimelineVariantProps };