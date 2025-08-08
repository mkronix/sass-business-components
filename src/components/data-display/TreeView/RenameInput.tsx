import { useEffect, useRef, useState } from "react";


const RenameInput: React.FC<{
    initialValue: string;
    onSave: (value: string) => void;
    onCancel: () => void;
}> = ({ initialValue, onSave, onCancel }) => {
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
    }, []);

    const handleSubmit = () => {
        if (value.trim() && value !== initialValue) {
            onSave(value.trim());
        } else {
            onCancel();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        } else if (e.key === 'Escape') {
            onCancel();
        }
    };

    return (
        <div className="flex items-center gap-1">
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSubmit}
                className="flex-1 px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded text-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400"
            />
        </div>
    );
};


export default RenameInput