import React from 'react';
import { Calendar, Clock, MapPin, User, Edit, Trash2, ExternalLink } from 'lucide-react';
import { TimelineVariantProps } from './types';
import { getEventIcon, getStatusDot, formatDate, formatTime, getRelativeTimeFromNow } from './utils';

const MinimalTimeline: React.FC<TimelineVariantProps> = ({
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
            <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent"></div>

            {events.map((event, index) => {
                const IconComponent = getEventIcon(event.type || 'default');
                const statusDot = getStatusDot(event.status || 'upcoming');

                return (
                    <div key={event.id} className="relative flex items-start gap-4 pb-6 group">
                        {/* Dot */}
                        <div className={`relative z-10 w-4 h-4 rounded-full ${statusDot} transition-all duration-200 group-hover:scale-125 flex-shrink-0 mt-1`}>
                            {event.status === 'current' && (
                                <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping"></div>
                            )}
                        </div>

                        {/* Content */}
                        <div
                            className={`flex-1 min-w-0 ${allowInteraction ? 'cursor-pointer' : ''}`}
                            onClick={() => allowInteraction && onEventClick?.(event)}
                        >
                            <div className="flex items-start justify-between group-hover:bg-primary/5 rounded-lg p-3 -m-3 transition-colors duration-200">
                                <div className="flex-1 min-w-0">
                                    {/* Header */}
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-base font-semibold text-white truncate">{event.title}</h3>
                                        {showPriority && event.priority && (
                                            <span className={`px-2 py-0.5 text-xs rounded border ${event.priority === 'high' ? 'text-red-400 border-red-400/50 bg-red-400/10' :
                                                event.priority === 'medium' ? 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10' :
                                                    'text-green-400 border-green-400/50 bg-green-400/10'
                                                }`}>
                                                {event.priority}
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500 font-medium">
                                            {getRelativeTimeFromNow(event.date)}
                                        </span>
                                    </div>

                                    {event.description && (
                                        <p className="text-gray-400 text-sm mb-2 leading-relaxed">{event.description}</p>
                                    )}

                                    {showTags && event.tags && event.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mb-2">
                                            {event.tags.map((tag, tagIndex) => (
                                                <span key={tagIndex} className="px-2 py-0.5 text-xs bg-gray-700/50 text-gray-300 rounded">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Compact Metadata */}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(event.date)}
                                        </span>
                                        {showTime && event.time && (
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {formatTime(event.time)}
                                            </span>
                                        )}
                                        {showLocation && event.location && (
                                            <span className="flex items-center gap-1 truncate">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{event.location}</span>
                                            </span>
                                        )}
                                        {showAuthor && event.author && (
                                            <span className="flex items-center gap-1 truncate">
                                                <User className="w-3 h-3 flex-shrink-0" />
                                                <span className="truncate">{event.author}</span>
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Minimal Actions */}
                                {allowInteraction && (
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                                        {onEventEdit && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventEdit(event);
                                                }}
                                                className="p-1.5 text-gray-500 hover:text-primary hover:bg-primary/10 rounded transition-colors"
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
                                                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        )}
                                        <ExternalLink className="w-3 h-3 text-gray-500 opacity-50" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default MinimalTimeline