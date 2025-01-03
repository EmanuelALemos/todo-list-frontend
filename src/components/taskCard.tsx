import { GoKebabHorizontal } from "react-icons/go";
import { LabelPriority } from "./labelPriority";
import { format } from 'date-fns';
import { useRef, useState } from "react";
import { ToggleMenu } from "./toggleMenu";
import { Task } from "../@types/Task";

import { useDrag } from "react-dnd";
import { ViewTaskModal } from "./taskModals/viewTaskModal";

const ITEM_TYPE = 'TASK';

interface TaskCardProps {
    id: number;
    title: string;
    description: string;
    priority: number;
    due_date: Date;
    column_id?: number;
    onEdit: (task: Task) => void;
    onDelete: (task: Task) => void;
    onRefresh?: (state: boolean) => void;
}

export function TaskCard({ id, title, description, priority, due_date, column_id, onEdit, onDelete, onRefresh }: TaskCardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState<number | null>(null);
    const [isViewModalOpen, setViewModalOpen] = useState<boolean>(false);

    const formattedDate = new Date(due_date);

    formattedDate.setHours(formattedDate.getHours() + formattedDate.getTimezoneOffset() / 60);

    const menuButtonRef = useRef<HTMLButtonElement | null>(null);

    const handleMenuToggle = (taskId: number) => {
        setIsMenuOpen(isMenuOpen === taskId ? null : taskId);
    };

    const handleTitleClick = () => {
        setViewModalOpen(true); // Abre o modal de visualização
    };

    const [{ isDragging }, drag] = useDrag({
        type: ITEM_TYPE,
        item: { taskId: id, columnId: column_id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
            if(!monitor.didDrop()) {
                if (onRefresh) {
                    onRefresh(!monitor.didDrop());
                }
            }
            console.log("Task end drop", monitor.didDrop())
        }
    });

    return (
        <>
            <div
                ref={drag}
                className={` cursor-grab bg-gray-800 border border-slate-600 rounded-md p-4 w-full ${isDragging ? 'border border-blue-600 opacity-50' : ''}`}
            >
                <div className="space-y-2">

                    <div className="flex flex-row justify-between">
                        <button onClick={handleTitleClick}>
                            <h3 className="text-white font-semibold hover:text-blue-700 hover:underline">{title}</h3>
                        </button>
                        <button
                            ref={menuButtonRef}
                            onClick={() => handleMenuToggle(id)}
                            className="flex justify-center items-center text-slate-600 hover:bg-slate-700 rounded-md p-1"
                        >
                            <GoKebabHorizontal className="inline-block" size={16} />
                        </button>
                    </div>

                    <p className="truncate text-gray-400">
                        {description}
                    </p>

                    <div className="flex flex-row justify-between">
                        <LabelPriority priority={priority} />
                        <p className="text-gray-400 text-sm">
                            Prazo: {format(formattedDate, 'dd/MM/yyyy')}
                        </p>
                    </div>
                </div>
            </div>

            {isMenuOpen === id && (
                <ToggleMenu
                    data={{ id, title, description, priority, due_date, column_id }}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    setIsMenuOpen={setIsMenuOpen}
                    anchorRef={menuButtonRef}
                />
            )}

            <ViewTaskModal
                isOpen={isViewModalOpen}
                onClose={() => setViewModalOpen(false)}
                task={{
                    id,
                    title,
                    description,
                    priority,
                    due_date,
                    column_id,
                }}
            />
        </>
    );
}
