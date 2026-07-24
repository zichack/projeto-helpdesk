import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { LogOut, PlusCircle, LayoutDashboard, Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, signOut } = useContext(AuthContext);
    const [chamados, setChamados] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [chamadosRes, statsRes] = await Promise.all([
                    api.get('/chamados'),
                    api.get('/chamados/estatisticas')
                ]);
                
                setChamados(chamadosRes.data.data);
                setStats(statsRes.data);
            } catch (error) {
                console.error("Erro ao carregar os dados do dashboard", error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
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
                    <div className="flex gap-3">
                        <Link to="/categorias" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg transition-colors font-medium">
                            Categorias
                        </Link>
                        <Link to="/novo-chamado" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <PlusCircle size={20} />
                            Novo Chamado
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Carregando painel...</div>
                ) : (
                    <>
                        {stats && (
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="bg-blue-100 p-3 rounded-lg text-blue-600"><LayoutDashboard size={24} /></div>
                                    <div><p className="text-sm text-gray-500">Total</p><p className="text-2xl font-bold text-gray-800">{stats.total}</p></div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="bg-yellow-100 p-3 rounded-lg text-yellow-600"><Ticket size={24} /></div>
                                    <div><p className="text-sm text-gray-500">Abertos</p><p className="text-2xl font-bold text-gray-800">{stats.abertos}</p></div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="bg-purple-100 p-3 rounded-lg text-purple-600"><Clock size={24} /></div>
                                    <div><p className="text-sm text-gray-500">Em Atend.</p><p className="text-2xl font-bold text-gray-800">{stats.em_atendimento}</p></div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                    <div className="bg-green-100 p-3 rounded-lg text-green-600"><CheckCircle size={24} /></div>
                                    <div><p className="text-sm text-gray-500">Finalizados</p><p className="text-2xl font-bold text-gray-800">{stats.finalizados}</p></div>
                                </div>
                                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 flex items-center gap-4">
                                    <div className="bg-red-100 p-3 rounded-lg text-red-600"><AlertCircle size={24} /></div>
                                    <div><p className="text-sm text-gray-500 font-medium">Atrasados</p><p className="text-2xl font-bold text-red-600">{stats.atrasados}</p></div>
                                </div>
                            </div>
                        )}

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
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                                            ${chamado.status === 'Finalizado' ? 'bg-green-100 text-green-700' : 
                                                              chamado.status === 'Em Atendimento' ? 'bg-purple-100 text-purple-700' : 
                                                              'bg-yellow-100 text-yellow-700'}`}>
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
                    </>
                )}
            </main>
        </div>
    );
}