import { GoPlus } from "react-icons/go";

interface ButtonNewProps {
    onClick: () => void;
}

export function ButtonNew({ onClick }: ButtonNewProps) {
    return (
        <button
            onClick={onClick}
            className="bg-green-600 hover:bg-green-500 text-white ml-4 py-2 px-4 max-h-10 text-nowrap rounded"
        >
            <GoPlus className="inline-block" size={24} />
            Novo Quadro
        </button>
    );
}
