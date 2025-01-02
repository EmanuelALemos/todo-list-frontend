import { GoKebabHorizontal, GoTable } from "react-icons/go";

import { Link } from "react-router-dom";
import { Board } from "../@types/Board";
import { useRef, useState } from "react";
import { ToggleMenu } from "./toggleMenu";
import React from "react";

interface TableBoardProps {
    boards: Board[];
    onEdit: (board: Board) => void;
    onDelete: (id: number) => void;
}

export function TableBoards({ boards, onEdit, onDelete }: TableBoardProps) {
    const [isMenuOpen, setIsMenuOpen] = useState<number | null>(null);
    const menuButtonRefs = useRef<(React.RefObject<HTMLButtonElement>)[]>([]);

    const toggleMenu = (id: number) => {
        setIsMenuOpen(isMenuOpen === id ? null : id);
    };


    return (
        <div className="w-full">
            <header className="flex items-center bg-gray-800 h-16 rounded-t-md p-3 border border-slate-600">
                <GoTable className="inline-block mr-1" size={24} />
                <h2>{boards.length} Quadros</h2>
            </header>

            <div className="bg-transparent rounded-b-md divide-y divide-gray-700 border border-slate-600 border-t-0">
                {boards.length > 0 ? (
                    boards.map((board, index) => {
                        if (!menuButtonRefs.current[index]) {
                            menuButtonRefs.current[index] = React.createRef<HTMLButtonElement>();
                        }


                        return (
                            <div
                                key={board.id}
                                className="flex justify-between items-center py-3 px-4"
                            >
                                <div>
                                    <div className="flex items-center">
                                        <GoTable className="inline-block mr-2" size={24} />
                                        <Link to={`/board/${board.id}`} className="text-lg font-medium text-white hover:text-blue-700 hover:underline">
                                            {board.title}
                                        </Link>
                                    </div>

                                    <p className="text-gray-400 text-sm">#{board.id} • {board.description}</p>
                                </div>

                                <button
                                    ref={menuButtonRefs.current[index]}
                                    onClick={() => board.id !== undefined && toggleMenu(board.id)}
                                    className="text-gray-400 hover:bg-gray-700 rounded-md px-2 py-1"
                                >
                                    <GoKebabHorizontal className="inline-block" size={24} />
                                </button>

                                {isMenuOpen === board.id && (
                                    <ToggleMenu
                                        data={board}
                                        onEdit={(editedBoard) => onEdit(editedBoard)}
                                        onDelete={(deletedBoard) => deletedBoard.id !== undefined && onDelete(deletedBoard.id)}
                                        setIsMenuOpen={setIsMenuOpen}
                                        anchorRef={menuButtonRefs.current[index]}
                                    />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col justify-center items-center h-32">
                        <GoTable color="#475569" size={32} />
                        <p className=" ml-2">Nenhum quadro encontrado</p>
                    </div>
                )}
            </div>

        </div>
    );
}