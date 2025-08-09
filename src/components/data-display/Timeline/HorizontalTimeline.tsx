import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, Edit, Trash2, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { TimelineVariantProps } from './types';
import { getEventIcon, getStatusColor, getStatusDot, formatDate, formatTime } from './utils';

const HorizontalTimeline: React.FC<TimelineVariantProps> = ({
    events,
    onEventClick,
    onEventEdit,
    onEventDelete,
    showTime,
    showLocation,
    showAuthor,
    showPriority,
    showTags,
    allowInteraction = true
}) => {
    const [isMobile, setIsMobile] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const nextEvent = () => {
        setCurrentIndex((prev) => (prev + 1) % events.length);
    };

    const prevEvent = () => {
        setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
    };

    // Mobile Vertical Layout
    if (isMobile) {
        return (
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Timeline Events</h3>
                    <span className="text-sm text-gray-400">{currentIndex + 1} of {events.length}</span>
                </div>

                <div className="relative">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevEvent}
                            className="p-2 rounded-lg bg-secondary border border-primary/20 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                            disabled={events.length <= 1}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        <div className="flex-1">
                            {events.length > 0 && (
                                <EventCard
                                    event={events[currentIndex]}
                                    index={currentIndex}
                                    onEventClick={onEventClick}
                                    onEventEdit={onEventEdit}
                                    onEventDelete={onEventDelete}
                                    showTime={showTime}
                                    showLocation={showLocation}
                                    showAuthor={showAuthor}
                                    showPriority={showPriority}
                                    showTags={showTags}
                                    allowInteraction={allowInteraction}
                                    isMobile={true}
                                />
                            )}
                        </div>

                        <button
                            onClick={nextEvent}
                            className="p-2 rounded-lg bg-secondary border border-primary/20 text-gray-400 hover:text-white disabled:opacity-50 transition-colors"
                            disabled={events.length <= 1}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mt-4">
                        {events.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary' : 'bg-gray-600'
                                    }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Desktop Horizontal Layout with Perfect Alignment
    return (
        <div className="w-full">
            {/* Combined Steps and Cards with Perfect Alignment */}
            <div className="overflow-x-auto scrollbar-hide">
                <div className="relative flex min-w-max px-4 pb-4">
                    {/* Background Line */}
                    <div className="absolute top-8 left-0 right-0 h-0.5 bg-primary/20 z-0"></div>

                    {events.map((event, index) => {
                        const IconComponent = getEventIcon(event.type || 'default');
                        const statusColor = getStatusColor(event.status || 'upcoming');

                        return (
                            <div
                                key={event.id}
                                className="relative flex flex-col items-center group"
                                style={{
                                    width: '320px',
                                    marginRight: index < events.length - 1 ? '24px' : '0'
                                }}
                            >
                                {/* Step Section */}
                                <div className="relative flex flex-col items-center mb-8">
                                    {/* Step Number */}
                                    <div className="absolute -top-12 bg-secondary border border-primary/20 rounded-lg px-2 py-1 z-10">
                                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                                    </div>

                                    {/* Step Circle */}
                                    <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${statusColor} backdrop-blur-sm transition-all duration-200`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>

                                    {/* Progress Line Segment - Perfectly aligned */}
                                    {index < events.length - 1 && (
                                        <div
                                            className={`absolute top-8 h-0.5 z-5 transition-colors duration-300 ${event.status === 'completed' ? 'bg-green-400' : 'bg-primary/40'
                                                }`}
                                            style={{
                                                left: '32px', // Half of circle width (16px) = 32px from center
                                                width: '312px' // 320px card width - 8px padding = 312px
                                            }}
                                        ></div>
                                    )}

                                    {/* Dropdown Arrow */}
                                    <ChevronDown className="w-4 h-4 text-primary/60 mt-2 animate-bounce" />

                                    {/* Event Title (visible on hover) */}
                                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                                        <div className="bg-secondary text-white text-xs px-2 py-1 rounded whitespace-nowrap border border-primary/20 max-w-xs truncate">
                                            {event.title}
                                        </div>
                                    </div>
                                </div>

                                {/* Event Card - Perfectly aligned below step */}
                                <EventCard
                                    event={event}
                                    index={index}
                                    onEventClick={onEventClick}
                                    onEventEdit={onEventEdit}
                                    onEventDelete={onEventDelete}
                                    showTime={showTime}
                                    showLocation={showLocation}
                                    showAuthor={showAuthor}
                                    showPriority={showPriority}
                                    showTags={showTags}
                                    allowInteraction={allowInteraction}
                                    isMobile={false}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Enhanced Event Card Component
const EventCard: React.FC<{
    event: any;
    index: number;
    onEventClick?: (event: any) => void;
    onEventEdit?: (event: any) => void;
    onEventDelete?: (event: any) => void;
    showTime?: boolean;
    showLocation?: boolean;
    showAuthor?: boolean;
    showPriority?: boolean;
    showTags?: boolean;
    allowInteraction?: boolean;
    isMobile?: boolean;
}> = ({
    event,
    index,
    onEventClick,
    onEventEdit,
    onEventDelete,
    showTime,
    showLocation,
    showAuthor,
    showPriority,
    showTags,
    allowInteraction,
    isMobile = false
}) => {
        const statusColor = getStatusColor(event.status || 'upcoming');

        return (
            <div className={`group ${isMobile ? 'w-full' : 'w-full'}`}>
                <div
                    className={`p-5 rounded-xl bg-secondary border border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-primary/10 h-full ${event.status === 'current' ? 'ring-1 ring-primary/30 shadow-primary/20' : ''
                        } ${allowInteraction ? 'cursor-pointer' : ''}`}
                    onClick={() => allowInteraction && onEventClick?.(event)}
                >
                    {/* Status Indicator */}
                    <div className={`w-full h-1 rounded-t-lg mb-4 ${getStatusDot(event.status || 'upcoming')}`}></div>

                    <div className="text-center mb-4">
                        <h3 className={`font-bold text-white mb-2 leading-tight ${isMobile ? 'text-xl' : 'text-lg'
                            }`}>
                            {event.title}
                        </h3>
                        {showPriority && event.priority && (
                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.priority)}`}>
                                {event.priority.toUpperCase()}
                            </span>
                        )}
                    </div>

                    {event.description && (
                        <p className={`text-gray-300 mb-4 text-center leading-relaxed ${isMobile ? 'text-base' : 'text-sm'
                            }`}>
                            {event.description}
                        </p>
                    )}

                    {showTags && event.tags && event.tags.length > 0 && (
                        <div className="flex flex-wrap justify-center gap-1 mb-4">
                            {event.tags.slice(0, isMobile ? 4 : 3).map((tag: string, tagIndex: number) => (
                                <span key={tagIndex} className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                                    #{tag}
                                </span>
                            ))}
                            {event.tags.length > (isMobile ? 4 : 3) && (
                                <span className="px-2 py-1 text-xs bg-gray-600 text-gray-300 rounded-full">
                                    +{event.tags.length - (isMobile ? 4 : 3)}
                                </span>
                            )}
                        </div>
                    )}

                    <div className={`space-y-2 text-gray-400 mb-4 ${isMobile ? 'text-sm' : 'text-xs'}`}>
                        <div className="flex items-center justify-center gap-1">
                            <Calendar className={`flex-shrink-0 ${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                            <span className="font-medium">{formatDate(event.date)}</span>
                        </div>
                        {showTime && event.time && (
                            <div className="flex items-center justify-center gap-1">
                                <Clock className={`flex-shrink-0 ${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                                <span className="font-medium">{formatTime(event.time)}</span>
                            </div>
                        )}
                        {showLocation && event.location && (
                            <div className="flex items-center justify-center gap-1">
                                <MapPin className={`flex-shrink-0 ${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                                <span className="truncate font-medium">{event.location}</span>
                            </div>
                        )}
                        {showAuthor && event.author && (
                            <div className="flex items-center justify-center gap-1">
                                <User className={`flex-shrink-0 ${isMobile ? 'w-4 h-4' : 'w-3 h-3'}`} />
                                <span className="truncate font-medium">{event.author}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {allowInteraction && (onEventEdit || onEventDelete) && (
                        <div className={`flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${isMobile ? 'opacity-100' : ''
                            }`}>
                            {onEventEdit && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEventEdit(event);
                                    }}
                                    className={`text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors ${isMobile ? 'p-3' : 'p-2'
                                        }`}
                                >
                                    <Edit className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                                </button>
                            )}
                            {onEventDelete && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEventDelete(event);
                                    }}
                                    className={`text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ${isMobile ? 'p-3' : 'p-2'
                                        }`}
                                >
                                    <Trash2 className={isMobile ? 'w-5 h-5' : 'w-4 h-4'} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    };

export default HorizontalTimeline;