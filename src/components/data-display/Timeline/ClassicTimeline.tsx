import React from 'react';
import { Calendar, Clock, MapPin, User, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { TimelineVariantProps } from './types';
import { getEventIcon, getStatusColor, formatDate, formatTime } from './utils';

const ClassicTimeline: React.FC<TimelineVariantProps> = ({
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
    return (
        <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-primary/20"></div>

            {events.map((event, index) => {
                const IconComponent = getEventIcon(event.type || 'default');
                const statusColor = getStatusColor(event.status || 'upcoming');

                return (
                    <div key={event.id} className="relative flex items-start gap-4 pb-8 group">
                        {/* Icon Circle */}
                        <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${statusColor} backdrop-blur-sm transition-all duration-200 group-hover:scale-110`}>
                            <IconComponent className="w-5 h-5" />
                            {event.status === 'current' && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                            )}
                        </div>

                        {/* Content Card */}
                        <div
                            className={`flex-1 p-4 rounded-lg bg-secondary border border-primary/10 hover:border-primary/30 transition-all duration-200 transform hover:scale-[1.02] ${event.status === 'current' ? 'ring-1 ring-primary/30 shadow-lg shadow-primary/10' : ''
                                } ${allowInteraction ? 'cursor-pointer' : ''}`}
                            onClick={() => allowInteraction && onEventClick?.(event)}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                                        {showPriority && event.priority && (
                                            <span className={`px-2 py-1 text-xs rounded-full border ${getStatusColor(event.priority)}`}>
                                                {event.priority.toUpperCase()}
                                            </span>
                                        )}
                                    </div>

                                    {event.description && (
                                        <p className="text-gray-300 text-sm mb-3 leading-relaxed">{event.description}</p>
                                    )}

                                    {showTags && event.tags && event.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-3">
                                            {event.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="px-2 py-1 text-xs bg-primary/20 text-primary rounded-full">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(event.date)}
                                        </div>
                                        {showTime && event.time && (
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(event.time)}
                                            </div>
                                        )}
                                        {showLocation && event.location && (
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {event.location}
                                            </div>
                                        )}
                                        {showAuthor && event.author && (
                                            <div className="flex items-center gap-1">
                                                <User className="w-3 h-3" />
                                                {event.author}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 ml-4">
                                    {allowInteraction && (
                                        <>
                                            {onEventEdit && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEventEdit(event);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-primary opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                >
                                                    <Edit className="w-3 h-3" />
                                                </button>
                                            )}
                                            {onEventDelete && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEventDelete(event);
                                                    }}
                                                    className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all duration-200"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </button>
                                            )}
                                            <ChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ClassicTimeline;