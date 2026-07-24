import { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import api from '../services/api';
import { 
    LogOut, PlusCircle, LayoutDashboard, Ticket, Clock, CheckCircle, 
    AlertCircle, Tags, Search, Filter, ChevronUp, ChevronDown, 
    ChevronLeft, ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user, signOut } = useContext(AuthContext);
    
    const [stats, setStats] = useState(null);
    const [categorias, setCategorias] = useState([]);
    const [chamados, setChamados] = useState([]);
    
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [loadingList, setLoadingList] = useState(false);

    const [filters, setFilters] = useState({ assunto: '', solicitante: '', categoria_id: '', prioridade: '', status: '' });
    const [activeFilters, setActiveFilters] = useState({ ...filters });
    const [sort, setSort] = useState({ orderBy: 'created_at', orderDir: 'desc' });
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1, total: 0 });

    useEffect(() => {
        async function loadInitialData() {
            try {
                const [statsRes, catRes] = await Promise.all([
                    api.get('/chamados/estatisticas'),
                    api.get('/categorias')
                ]);
                setStats(statsRes.data);
                setCategorias(catRes.data);
            } catch (error) {
                console.error("Erro ao carregar dados iniciais", error);
            } finally {
                setLoadingInitial(false);
            }
        }
        loadInitialData();
    }, []);

    const fetchChamados = useCallback(async () => {
        setLoadingList(true);
        try {
            const response = await api.get('/chamados', {
                params: {
                    ...activeFilters,
                    page,
                    order_by: sort.orderBy,
                    order_dir: sort.orderDir
                }
            });
            
            setChamados(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
                total: response.data.total
            });
        } catch (error) {
            console.error("Erro ao carregar chamados", error);
        } finally {
            setLoadingList(false);
        }
    }, [activeFilters, page, sort]);

    useEffect(() => {
        fetchChamados();
    }, [fetchChamados]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setActiveFilters(filters);
    };

    const handleSort = (column) => {
        setSort(prev => ({
            orderBy: column,
            orderDir: prev.orderBy === column && prev.orderDir === 'asc' ? 'desc' : 'asc'
        }));
        setPage(1);
    };

    const clearFilters = () => {
        const emptyFilters = { assunto: '', solicitante: '', categoria_id: '', prioridade: '', status: '' };
        setFilters(emptyFilters);
        setActiveFilters(emptyFilters);
        setPage(1);
    };

    const SortIcon = ({ column }) => {
        if (sort.orderBy !== column) return null;
        return sort.orderDir === 'asc' ? <ChevronUp size={16} className="inline ml-1" /> : <ChevronDown size={16} className="inline ml-1" />;
    };

    const formatData = (dataStr) => new Date(dataStr).toLocaleDateString('pt-BR');

    if (loadingInitial) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Carregando painel...</div>;
    }

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
                    <LogOut size={20} /> Sair
                </button>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800">Visão Geral</h2>
                    <div className="flex gap-3">
                        <Link to="/categorias" className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg transition-colors font-medium flex items-center gap-2">
                            <Tags size={20} /> Categorias
                        </Link>
                        <Link to="/novo-chamado" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                            <PlusCircle size={20} /> Novo Chamado
                        </Link>
                    </div>
                </div>

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

                <form onSubmit={handleSearch} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex items-center gap-2 mb-4 text-gray-700 font-medium">
                        <Filter size={18} /> Filtros de Pesquisa
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                        <input 
                            type="text" 
                            placeholder="Pesquisar assunto..." 
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm w-full"
                            value={filters.assunto} 
                            onChange={e => setFilters({...filters, assunto: e.target.value})} 
                        />
                        
                        <input 
                            type="text" 
                            placeholder="Pesquisar solicitante..." 
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm w-full"
                            value={filters.solicitante} 
                            onChange={e => setFilters({...filters, solicitante: e.target.value})} 
                        />
                        
                        <select 
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white w-full"
                            value={filters.categoria_id} 
                            onChange={e => setFilters({...filters, categoria_id: e.target.value})}
                        >
                            <option value="">Todas Categorias</option>
                            {categorias.map(cat => <option key={cat.id} value={cat.id}>{cat.nome}</option>)}
                        </select>
                        
                        <select 
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white w-full"
                            value={filters.status} 
                            onChange={e => setFilters({...filters, status: e.target.value})}
                        >
                            <option value="">Todos Status</option>
                            <option value="Crítico">Crítico</option>
                            <option value="Aberto">Aberto</option>
                            <option value="Em Atendimento">Em Atendimento</option>
                            <option value="Aguardando Usuário">Aguardando Usuário</option>
                            <option value="Finalizado">Finalizado</option>
                        </select>
                        
                        <select 
                            className="px-3 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 text-sm bg-white w-full"
                            value={filters.prioridade} 
                            onChange={e => setFilters({...filters, prioridade: e.target.value})}
                        >
                            <option value="">Qualquer Prioridade</option>
                            <option value="Baixa">Baixa</option>
                            <option value="Média">Média</option>
                            <option value="Alta">Alta</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                        <button 
                            type="button" 
                            onClick={clearFilters} 
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors text-sm font-medium"
                        >
                            Limpar Filtros
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2 shadow-sm"
                        >
                            <Search size={16} /> Pesquisar
                        </button>
                    </div>
                </form>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 relative">
                    {loadingList && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10">
                            <span className="text-blue-600 font-medium">Atualizando lista...</span>
                        </div>
                    )}
                    
                    {chamados.length === 0 && !loadingList ? (
                        <div className="p-10 text-center text-gray-500">Nenhum chamado encontrado para estes filtros.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 text-gray-600 text-sm border-b select-none">
                                        <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('id')}>
                                            ID <SortIcon column="id" />
                                        </th>
                                        <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('assunto')}>
                                            Assunto <SortIcon column="assunto" />
                                        </th>
                                        <th className="p-4 font-medium">Solicitante</th>
                                        <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('status')}>
                                            Status <SortIcon column="status" />
                                        </th>
                                        <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('prioridade')}>
                                            Prioridade <SortIcon column="prioridade" />
                                        </th>
                                        <th className="p-4 font-medium cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => handleSort('created_at')}>
                                            Abertura <SortIcon column="created_at" />
                                        </th>
                                        <th className="p-4 font-medium text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chamados.map(chamado => (
                                        <tr key={chamado.id} className="border-b hover:bg-gray-50 transition-colors">
                                            <td className="p-4 text-gray-500">#{chamado.id}</td>
                                            <td className="p-4 font-medium text-gray-800">{chamado.assunto}</td>
                                            <td className="p-4 text-sm text-gray-600">{chamado.solicitante?.name || '-'}</td>
                                            <td className="p-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                                                    ${chamado.status === 'Finalizado' ? 'bg-green-100 text-green-700' : 
                                                      chamado.status === 'Em Atendimento' ? 'bg-purple-100 text-purple-700' : 
                                                      chamado.status === 'Crítico' ? 'bg-red-100 text-red-700' : 
                                                      'bg-yellow-100 text-yellow-700'}`}>
                                                    {chamado.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600 text-sm">{chamado.prioridade}</td>
                                            <td className="p-4 text-gray-500 text-sm">{formatData(chamado.created_at)}</td>
                                            <td className="p-4 text-right">
                                                <Link to={`/chamados/${chamado.id}`} className="text-blue-600 font-medium hover:underline text-sm">
                                                    Abrir
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            
                            <div className="flex justify-between items-center p-4 bg-gray-50 border-t border-gray-100">
                                <span className="text-sm text-gray-600">Total: {pagination.total} registros</span>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-600">Página {pagination.current_page} de {pagination.last_page}</span>
                                    <div className="flex gap-2">
                                        <button 
                                            disabled={page === 1} 
                                            onClick={() => setPage(page - 1)}
                                            className="p-1 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <button 
                                            disabled={page === pagination.last_page || pagination.last_page === 0} 
                                            onClick={() => setPage(page + 1)}
                                            className="p-1 rounded-md bg-white border border-gray-300 disabled:opacity-50 hover:bg-gray-100 transition-colors"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}