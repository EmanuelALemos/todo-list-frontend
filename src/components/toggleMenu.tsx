import { GoPencil, GoTrash } from 'react-icons/go';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

interface ToggleMenuProps<T> {
    data: T;
    onEdit: (data: T) => void;
    onDelete: (data: T) => void;
    setIsMenuOpen: Dispatch<SetStateAction<number | null>>;
    anchorRef: React.RefObject<HTMLButtonElement>;
}

export function ToggleMenu<T>({ data, onEdit, onDelete, setIsMenuOpen, anchorRef }: ToggleMenuProps<T>) {
    const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (anchorRef.current) {
            const rect = anchorRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY + 4, 
                left: rect.left + window.scrollX, 
            });

            setIsVisible(true);
        }
    }, [anchorRef]);

    if (!isVisible) {
        return null;
    }

    return (
        <div
            className="absolute w-40 bg-gray-800 rounded-md border border-slate-600 divide-y divide-gray-700"
            style={{ top: position.top, left: position.left }}
        >
            <button
                onClick={() => {
                    onEdit(data);
                    setIsMenuOpen(null);
                }}
                className="w-full text-left px-4 py-2 text-white hover:bg-gray-700"
            >
                <GoPencil className="inline-block mr-2" size={16} />
                Editar
            </button>
            <button
                onClick={() => {
                    onDelete(data)
                    setIsMenuOpen(null);
                }}
                className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-700/20"
            >
                <GoTrash className="inline-block mr-2" size={16} />
                Deletar
            </button>
        </div>
    );
}