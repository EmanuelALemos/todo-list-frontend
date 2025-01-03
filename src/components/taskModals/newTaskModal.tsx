import { useState } from 'react';
import { Task } from '../../@types/Task';

interface NewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (task: Omit<Task, 'id' | 'column_id'>) => void;
}


const priorityStyles: Record<number, string> = {
    1: "bg-red-700/15 border-red-700 text-red-700",
    2: "bg-yellow-700/15 border-yellow-700 text-yellow-700",
    3: "bg-green-700/15 border-green-700 text-green-700",
};

const priorityText: Record<number, string> = {
    1: "Alta",
    2: "Média",
    3: "Baixa",
};

export function NewTaskModal({ isOpen, onClose, onSave }: NewTaskModalProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState(3);
    const [endDate, setEndDate] = useState('');

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();

        const newTask = {
            title,
            description,
            priority,
            due_date: new Date(endDate),
        };

        onSave(newTask);
        resetFields();
        onClose();
    };

    const resetFields = () => {
        setTitle('');
        setDescription('');
        setPriority(3);
        setEndDate('');
    };


    const today = new Date().toISOString().split('T')[0];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 border border-slate-600 p-8 rounded-md w-96">
                <h2 className="text-xl font-bold text-white text-center mb-4">Nova Tarefa</h2>
                <form onSubmit={handleSave}>
                
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Título *</label>
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
                        <label className="block text-gray-400 mb-1">Descrição</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full h-24 px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Prioridade</label>
                        <div className="flex gap-4">
                            {Object.keys(priorityText).map((key) => {
                                const priorityValue = Number(key);
                                return (
                                    <div
                                        key={priorityValue}
                                        onClick={() => setPriority(priorityValue)}
                                        className={`cursor-pointer rounded-full text-base px-2 py-1 text-center border ${priorityStyles[priorityValue]} ${priority === priorityValue ? 'ring-2 ring-white' : ''}`}
                                    >
                                        {priorityText[priorityValue]}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    
                    <div className="mb-4">
                        <label className="block text-gray-400 mb-1">Data de Término *</label>
                        <input
                            id="endDate"
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-md bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                            min={today}
                        />
                    </div>

                    <div className="flex justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
