import React from 'react';
import { Calendar, Clock, MapPin, User, Edit, Trash2, MoreVertical } from 'lucide-react';
import { TimelineVariantProps } from './types';
import { getEventIcon, getStatusColor, getStatusDot, formatDate, formatTime } from './utils';

const ModernTimeline: React.FC<TimelineVariantProps> = ({
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
        <div className="space-y-6">
            {events.map((event, index) => {
                const IconComponent = getEventIcon(event.type || 'default');
                const statusColor = getStatusColor(event.status || 'upcoming');
                const statusDot = getStatusDot(event.status || 'upcoming');

                return (
                    <div key={event.id} className="group">
                        <div
                            className={`relative p-6 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 border border-primary/10 hover:border-primary/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/10 ${event.status === 'current' ? 'ring-2 ring-primary/40 shadow-lg shadow-primary/20' : ''
                                } ${allowInteraction ? 'cursor-pointer' : ''}`}
                            onClick={() => allowInteraction && onEventClick?.(event)}
                        >
                            {/* Status Indicator */}
                            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${statusDot}`}></div>

                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4 flex-1">
                                    {/* Icon */}
                                    <div className={`flex items-center justify-center w-14 h-14 rounded-xl border-2 ${statusColor} backdrop-blur-sm`}>
                                        <IconComponent className="w-6 h-6" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-xl font-bold text-white truncate">{event.title}</h3>
                                            {showPriority && event.priority && (
                                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(event.priority)}`}>
                                                    {event.priority.toUpperCase()}
                                                </span>
                                            )}
                                        </div>

                                        {event.description && (
                                            <p className="text-gray-300 text-sm mb-4 leading-relaxed">{event.description}</p>
                                        )}

                                        {showTags && event.tags && event.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {event.tags.map((tag, tagIndex) => (
                                                    <span key={tagIndex} className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-lg font-medium">
                                                        #{tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        {/* Metadata Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Calendar className="w-4 h-4" />
                                                <span className="font-medium">{formatDate(event.date)}</span>
                                            </div>
                                            {showTime && event.time && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="font-medium">{formatTime(event.time)}</span>
                                                </div>
                                            )}
                                            {showLocation && event.location && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <MapPin className="w-4 h-4" />
                                                    <span className="font-medium truncate">{event.location}</span>
                                                </div>
                                            )}
                                            {showAuthor && event.author && (
                                                <div className="flex items-center gap-2 text-gray-400">
                                                    <User className="w-4 h-4" />
                                                    <span className="font-medium truncate">{event.author}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Menu */}
                                {allowInteraction && (onEventEdit || onEventDelete) && (
                                    <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        {onEventEdit && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventEdit(event);
                                                }}
                                                className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                        )}
                                        {onEventDelete && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    onEventDelete(event);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button className="p-2 text-gray-400 hover:text-gray-300 hover:bg-gray-700/30 rounded-lg transition-colors">
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Hover Effect Gradient */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ModernTimeline;