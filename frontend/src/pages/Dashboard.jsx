import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { LogOut, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, signOut } = useContext(AuthContext);
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChamados() {
            try {
                // busca os chamados na API
                const response = await api.get('/chamados');
                setChamados(response.data.data);
            } catch (error) {
                console.error("Erro ao buscar chamados", error);
            } finally {
                setLoading(false);
            }
        }
        loadChamados();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">HelpDesk</h1>
                    <p className="text-sm text-gray-500">Bem-vindo(a), {user?.name}</p>
                </div>
                <button 
                    onClick={signOut} 
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                    <LogOut size={20} />
                    Sair
                </button>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Meus Chamados</h2>
                    <Link to="/novo-chamado" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                        <PlusCircle size={20} />
                        Novo Chamado
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Carregando chamados...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        {chamados.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Nenhum chamado encontrado. Clique em "Novo Chamado" para começar.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                                            <th className="p-4 font-medium">ID</th>
                                            <th className="p-4 font-medium">Assunto</th>
                                            <th className="p-4 font-medium">Status</th>
                                            <th className="p-4 font-medium">Prioridade</th>
                                            <th className="p-4 font-medium text-right">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {chamados.map(chamado => (
                                            <tr key={chamado.id} className="border-b hover:bg-gray-50 transition-colors">
                                                <td className="p-4 text-gray-500">#{chamado.id}</td>
                                                <td className="p-4 font-medium text-gray-800">{chamado.assunto}</td>
                                                <td className="p-4">
                                                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                                                        {chamado.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-gray-600">{chamado.prioridade}</td>
                                                <td className="p-4 text-right">
                                                    <Link to={`/chamados/${chamado.id}`} className="text-blue-600 font-medium hover:underline">
                                                        Abrir
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}