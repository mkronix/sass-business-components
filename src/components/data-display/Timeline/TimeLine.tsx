import React from 'react';
import { TimelineProps } from './types';
import { sortEventsByDate } from './utils';
import ClassicTimeline from './ClassicTimeline';
import ModernTimeline from './ModernTimeline';
import HorizontalTimeline from './HorizontalTimeline';
import MinimalTimeline from './MinimalTimeline';

const Timeline: React.FC<TimelineProps> = ({
    events,
    variant = 1,
    className = '',
    onEventClick,
    onEventEdit,
    onEventDelete,
    showTime = true,
    showLocation = true,
    showAuthor = true,
    showPriority = true,
    showTags = true,
    allowInteraction = true,
    theme = 'dark'
}) => {
    // Sort events by date
    const sortedEvents = sortEventsByDate(events);

    // Common props for all variants
    const commonProps = {
        events: sortedEvents,
        onEventClick,
        onEventEdit,
        onEventDelete,
        showTime,
        showLocation,
        showAuthor,
        showPriority,
        showTags,
        allowInteraction
    };

    // Render appropriate variant
    const renderTimeline = () => {
        switch (variant) {
            case 1:
                return <ClassicTimeline {...commonProps} />;
            case 2:
                return <ModernTimeline {...commonProps} />;
            case 3:
                return <HorizontalTimeline {...commonProps} />;
            case 4:
                return <MinimalTimeline {...commonProps} />;
            default:
                return <ClassicTimeline {...commonProps} />;
        }
    };

    return (
        <div className={`timeline-container ${className} ${theme === 'light' ? 'timeline-light' : 'timeline-dark'}`}>
            {sortedEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-400 mb-2">No Events Yet</h3>
                    <p className="text-sm text-gray-500 max-w-md">
                        Your timeline is empty. Start adding events to see them displayed here in a beautiful timeline format.
                    </p>
                </div>
            ) : (
                renderTimeline()
            )}
        </div>
    );
};

export default Timeline;