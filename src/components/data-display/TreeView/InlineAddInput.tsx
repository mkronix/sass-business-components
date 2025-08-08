import { Input } from "@/components/ui/input";
import { File, Folder } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface InlineAddInputProps {
    type: 'file' | 'folder';
    level: number;
    onSave: (name: string) => void;
    onCancel: () => void;
}

const InlineAddInput: React.FC<InlineAddInputProps> = ({
    type,
    level,
    onSave,
    onCancel
}) => {
    const [value, setValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = () => {
        const trimmedValue = value.trim();
        if (trimmedValue) {
            onSave(trimmedValue);
        } else {
            onCancel();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            onCancel();
        }
    };

    const IconComponent = type === 'folder' ? Folder : File;

    return (
        <div
            className="flex items-center py-2 px-3 rounded-md transition-colors duration-150 ease-in-out"
            style={{ paddingLeft: `${level * 20 + 12}px` }}
        >

            {/* Icon */}
            <IconComponent className="w-4 h-4 mr-3 text-primary flex-shrink-0" />

            {/* Input */}
            <Input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSubmit}
                placeholder={`Enter ${type} name...`}
                className="text-sm bg-primary/10"
            />
        </div>
    );
};

export default InlineAddInput;