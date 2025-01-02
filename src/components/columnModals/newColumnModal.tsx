import { useState } from 'react';
import { Column } from '../../@types/Column';
import { GoCircle } from 'react-icons/go';

interface NewColumnModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (column: Omit<Column, 'id'>) => void;
}

const colors = ['gray', 'blue', 'green', 'yellow', 'orange', 'red', 'purple'];

const columnColor: Record<string, string> = {
    "gray": "bg-gray-500/50 text-gray-500",
    "blue": "bg-blue-500/50 text-blue-500",
    "green": "bg-green-500/50 text-green-500",
    "yellow": "bg-yellow-500/50 text-yellow-500",
    "orange": "bg-orange-500/50 text-orange-500",
    "red": "bg-red-500/50 text-red-500",
    "purple": "bg-purple-500/50 text-purple-500",
}

export function NewColumnModal({ isOpen, onClose, onSave }: NewColumnModalProps) {
    const [title, setTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState('gray');
    const [description, setDescription] = useState('');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, color: selectedColor, description });
        setTitle('');
        setSelectedColor('gray');
        setDescription('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 border border-slate-600 p-8 rounded-md w-96">
                <h2 className="text-xl font-bold text-white text-center mb-4">Nova Coluna</h2>

                <form onSubmit={handleSave}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block text-gray-400 mb-1">Título *</label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-white mb-1">Color</label>
                        <div className="flex gap-2">
                            {colors.map((color) => (
                                <div
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                >
                                    <GoCircle className={`rounded-full cursor-pointer ${columnColor[color]} ${selectedColor === color ? 'ring-2 ring-white' : ''}`} size={32} />
                                </div>

                            ))}
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-gray-400 mb-1">Descrição</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-24 px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type='submit'
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
