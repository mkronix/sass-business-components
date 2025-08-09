import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Calendar, Clock, Edit, MapPin, Trash2, User } from 'lucide-react';
import { TimelineEvent } from './types';
import Timeline from './TimeLine';

const TimelineDemo: React.FC = () => {
    const [variant, setVariant] = useState<1 | 2 | 3 | 4>(1);
    const [searchTerm, setSearchTerm] = useState('');

    // Dialog states
    const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);

    // Edit form state
    const [formData, setFormData] = useState<Partial<TimelineEvent>>({});

    const [timelineData, setTimelineData] = useState<TimelineEvent[]>([
        {
            id: '1',
            title: 'Project Kickoff Meeting',
            description: 'Initial planning session with stakeholders to define project scope and timeline.',
            date: '2024-01-15',
            time: '09:00 AM',
            type: 'meeting',
            status: 'completed',
            location: 'Conference Room A',
            author: 'John Smith',
            priority: 'high',
            tags: ['planning', 'kickoff', 'stakeholders']
        },
        {
            id: '2',
            title: 'Requirements Analysis Complete',
            description: 'Finished gathering and documenting all project requirements from various departments.',
            date: '2024-01-22',
            time: '05:00 PM',
            type: 'milestone',
            status: 'completed',
            author: 'Sarah Johnson',
            priority: 'medium',
            tags: ['requirements', 'analysis', 'documentation']
        },
        {
            id: '3',
            title: 'Design System Workshop',
            description: 'Team workshop to establish design principles and component library structure.',
            date: '2024-02-05',
            time: '02:00 PM',
            type: 'event',
            status: 'current',
            location: 'Design Studio',
            author: 'Mike Chen',
            priority: 'high',
            tags: ['design', 'workshop', 'components']
        },
        {
            id: '4',
            title: 'MVP Development Phase',
            description: 'Begin development of minimum viable product based on finalized requirements.',
            date: '2024-02-12',
            time: '09:00 AM',
            type: 'task',
            status: 'upcoming',
            author: 'Development Team',
            priority: 'urgent',
            tags: ['development', 'mvp', 'coding']
        },
        {
            id: '5',
            title: 'First User Testing Session',
            description: 'Initial user testing with beta group to gather feedback on core functionality.',
            date: '2024-03-01',
            time: '10:00 AM',
            type: 'achievement',
            status: 'upcoming',
            location: 'User Lab',
            author: 'UX Team',
            priority: 'medium',
            tags: ['testing', 'users', 'feedback']
        },
        {
            id: '6',
            title: 'Launch Preparation',
            description: 'Final preparations for product launch including marketing materials and deployment.',
            date: '2024-03-15',
            time: '12:00 PM',
            type: 'milestone',
            status: 'upcoming',
            author: 'Launch Team',
            priority: 'high',
            tags: ['launch', 'marketing', 'deployment']
        }
    ]);

    const filteredEvents = timelineData.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEventClick = (event: TimelineEvent) => {
        setSelectedEvent(event);
        setShowDetailsDialog(true);
    };

    const handleEventEdit = (event: TimelineEvent) => {
        setSelectedEvent(event);
        setFormData(event);
        setShowEditDialog(true);
        setShowDetailsDialog(false);
    };

    const handleEventDelete = (event: TimelineEvent) => {
        setSelectedEvent(event);
        setShowDeleteDialog(true);
        setShowDetailsDialog(false);
    };

    const confirmDelete = () => {
        if (selectedEvent) {
            setTimelineData(prev => prev.filter(e => e.id !== selectedEvent.id));
        }
        setShowDeleteDialog(false);
        setSelectedEvent(null);
    };

    const handleEventSave = () => {
        if (formData.title && formData.date && selectedEvent) {
            const updatedEvent = { ...formData } as TimelineEvent;
            setTimelineData(prev =>
                prev.map(e => e.id === selectedEvent.id ? updatedEvent : e)
            );
            setShowEditDialog(false);
            setSelectedEvent(null);
            setFormData({});
        }
    };

    const addSampleEvent = () => {
        const newEvent: TimelineEvent = {
            id: `new-${Date.now()}`,
            title: 'New Sample Event',
            description: 'This is a dynamically added event to demonstrate the timeline functionality.',
            date: new Date().toISOString().split('T')[0],
            time: '02:30 PM',
            type: 'event',
            status: 'upcoming',
            author: 'Demo User',
            priority: 'medium',
            tags: ['demo', 'sample']
        };
        setTimelineData(prev => [...prev, newEvent]);
    };

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case 'completed': return 'default';
            case 'current': return 'secondary';
            case 'upcoming': return 'outline';
            case 'cancelled': return 'destructive';
            default: return 'outline';
        }
    };

    const getPriorityBadgeVariant = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'destructive';
            case 'high': return 'secondary';
            case 'medium': return 'outline';
            case 'low': return 'outline';
            default: return 'outline';
        }
    };

    const variantNames = {
        1: 'Classic Vertical',
        2: 'Modern Cards',
        3: 'Horizontal Steps',
        4: 'Minimal Dots'
    };

    return (
        <div className="min-h-screen p-6 space-y-6 bg-background">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Dynamic Timeline Component</h1>
                <p className="text-gray-400">4 unique modern designs with full customization</p>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 items-center justify-between p-4 rounded-lg bg-secondary border border-primary/10">
                <div className="flex flex-wrap gap-2">
                    {([1, 2, 3, 4] as const).map((v) => (
                        <Button
                            key={v}
                            variant={variant === v ? "default" : "outline"}
                            size="sm"
                            onClick={() => setVariant(v)}
                        >
                            {v}. {variantNames[v]}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Timeline Container */}
            <div className="p-6 rounded-lg bg-secondary border border-primary/10">
                <div className="mb-4">
                    <h2 className="text-xl font-semibold text-white mb-1">
                        {variantNames[variant]} Timeline
                    </h2>
                    <p className="text-sm text-gray-400">
                        Showing {filteredEvents.length} of {timelineData.length} events
                    </p>
                </div>

                <Timeline
                    events={filteredEvents}
                    variant={variant}
                    onEventClick={handleEventClick}
                    onEventEdit={handleEventEdit}
                    onEventDelete={handleEventDelete}
                    showTime={true}
                    showLocation={true}
                    showAuthor={true}
                    showPriority={true}
                    showTags={true}
                    allowInteraction={true}
                    className="timeline-demo"
                />
            </div>

            {/* Event Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="sm:max-w-md bg-secondary">
                    <DialogHeader className='flex flex-col gap-2'>
                        <DialogTitle className="flex text-2xl items-center gap-2">
                            {selectedEvent?.title}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            {selectedEvent?.status && (
                                <Badge variant={getStatusBadgeVariant(selectedEvent.status)}>
                                    {selectedEvent.status.toUpperCase()}
                                </Badge>
                            )}
                            {selectedEvent?.priority && (
                                <Badge variant={getPriorityBadgeVariant(selectedEvent.priority)}>
                                    {selectedEvent.priority.toUpperCase()}
                                </Badge>
                            )}
                        </div>
                    </DialogHeader>

                    <div className="space-y-4">
                        {selectedEvent?.description && (
                            <DialogDescription className="text-base leading-relaxed">
                                {selectedEvent.description}
                            </DialogDescription>
                        )}

                        <Separator />

                        {/* Metadata */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>{selectedEvent?.date}</span>
                                {selectedEvent?.time && (
                                    <>
                                        <Clock className="w-4 h-4 text-muted-foreground ml-4" />
                                        <span>{selectedEvent.time}</span>
                                    </>
                                )}
                            </div>
                            {selectedEvent?.location && (
                                <div className="flex items-center gap-2 text-sm">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span>{selectedEvent.location}</span>
                                </div>
                            )}
                            {selectedEvent?.author && (
                                <div className="flex items-center gap-2 text-sm">
                                    <User className="w-4 h-4 text-muted-foreground" />
                                    <span>{selectedEvent.author}</span>
                                </div>
                            )}
                        </div>

                        {/* Tags */}
                        {selectedEvent?.tags && selectedEvent.tags.length > 0 && (
                            <>
                                <Separator />
                                <div className="flex flex-wrap gap-1">
                                    {selectedEvent.tags.map((tag, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <DialogFooter className="gap-1 my-2">
                        <Button
                            onClick={() => selectedEvent && handleEventEdit(selectedEvent)}
                            className="gap-2"
                        >
                            <Edit className="w-3 h-3" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => selectedEvent && handleEventDelete(selectedEvent)}
                            className="gap-2"
                        >
                            <Trash2 className="w-3 h-3" />
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Event Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent className="max-h-[85vh] overflow-scroll bg-secondary">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Make changes to your event details here.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={formData.title || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                placeholder="Event title"
                                className='bg-primary/10'
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Event description"
                                className='bg-primary/10'
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date || ''}
                                    className='bg-primary/10'
                                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input
                                    id="time"
                                    value={formData.time || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                                    placeholder="09:00 AM"
                                    className='bg-primary/10'
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input
                                id="location"
                                value={formData.location || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                placeholder="Event location"
                                className='bg-primary/10'
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="author">Author</Label>
                            <Input
                                id="author"
                                value={formData.author || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                placeholder="Event author"
                                className='bg-primary/10'
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={formData.status || ''}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                                >
                                    <SelectTrigger className='bg-primary/10'>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="upcoming">Upcoming</SelectItem>
                                        <SelectItem value="current">Current</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                        <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="priority">Priority</Label>
                                <Select
                                    value={formData.priority || ''}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as any }))}
                                >
                                    <SelectTrigger className='bg-primary/10'>
                                        <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="urgent">Urgent</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select

                                value={formData.type || ''}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                            >
                                <SelectTrigger className='bg-primary/10'>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem value="milestone">Milestone</SelectItem>
                                    <SelectItem value="event">Event</SelectItem>
                                    <SelectItem value="achievement">Achievement</SelectItem>
                                    <SelectItem value="meeting">Meeting</SelectItem>
                                    <SelectItem value="task">Task</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleEventSave}>
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10">
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                            </div>
                            Delete Event
                        </DialogTitle>
                        <DialogDescription>
                            This action cannot be undone. This will permanently delete the event.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="p-4 rounded-lg bg-muted border">
                            <p className="font-medium">{selectedEvent?.title}</p>
                            <p className="text-sm text-muted-foreground">{selectedEvent?.date}</p>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete Event
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default TimelineDemo;