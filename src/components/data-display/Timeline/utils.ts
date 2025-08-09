import {
    Award,
    Calendar,
    CheckCircle,
    Circle,
    Star,
    Users
} from 'lucide-react';

import { TimelineEvent } from './types';

const DEFAULT_ICONS = {
    milestone: Award,
    event: Calendar,
    achievement: Star,
    meeting: Users,
    task: CheckCircle,
    default: Circle
};

const PRIORITY_COLORS = {
    low: 'text-green-400 border-green-400 bg-green-400/10',
    medium: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
    high: 'text-orange-400 border-orange-400 bg-orange-400/10',
    urgent: 'text-red-400 border-red-400 bg-red-400/10'
};

const STATUS_COLORS = {
    completed: 'text-green-400 border-green-400 bg-green-400/20',
    current: 'text-blue-400 border-blue-400 bg-blue-400/20',
    upcoming: 'text-gray-400 border-gray-400 bg-gray-400/20',
    cancelled: 'text-red-400 border-red-400 bg-red-400/20'
};

const STATUS_DOTS = {
    completed: 'bg-green-400',
    current: 'bg-blue-400',
    upcoming: 'bg-gray-400',
    cancelled: 'bg-red-400'
};

const getEventIcon = (type: string) => {
    return DEFAULT_ICONS[type as keyof typeof DEFAULT_ICONS] || DEFAULT_ICONS.default;
};

const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || STATUS_COLORS.upcoming;
};

const getPriorityColor = (priority: string) => {
    return PRIORITY_COLORS[priority as keyof typeof PRIORITY_COLORS] || PRIORITY_COLORS.medium;
};

const getStatusDot = (status: string) => {
    return STATUS_DOTS[status as keyof typeof STATUS_DOTS] || STATUS_DOTS.upcoming;
};

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const formatTime = (timeString: string): string => {
    return timeString;
};

const sortEventsByDate = (events: TimelineEvent[]): TimelineEvent[] => {
    return [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const groupEventsByDate = (events: TimelineEvent[]): Record<string, TimelineEvent[]> => {
    return events.reduce((groups, event) => {
        const date = formatDate(event.date);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(event);
        return groups;
    }, {} as Record<string, TimelineEvent[]>);
};

const getRelativeTimeFromNow = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays > 1) return `In ${diffInDays} days`;
    if (diffInDays < -1) return `${Math.abs(diffInDays)} days ago`;

    return formatDate(dateString);
};

export {
    DEFAULT_ICONS, formatDate,
    formatTime, getEventIcon, getPriorityColor, getRelativeTimeFromNow, getStatusColor, getStatusDot, groupEventsByDate, PRIORITY_COLORS, sortEventsByDate, STATUS_COLORS,
    STATUS_DOTS
};
