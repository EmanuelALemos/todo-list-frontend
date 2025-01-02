import { FaSearch } from 'react-icons/fa';

interface InputSearchProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputSearch({ value, onChange }: InputSearchProps) {
    return (
        <div className="relative w-10/12">
            <input
                type="text"
                value={value}
                onChange={onChange}
                className="bg-transparent border border-slate-600 text-white placeholder-gray-400 rounded-lg w-full pl-10 pr-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Pesquisar"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
    );
}