import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditarChamado() {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [categorias, setCategorias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        assunto: '',
        categoria_id: '',
        responsavel_id: '',
        prioridade: '',
        status: '',
        descricao: '',
        prazo_atendimento: ''
    });

    useEffect(() => {
        async function loadData() {
            try {
                const [catRes, usrRes, chamadoRes] = await Promise.all([
                    api.get('/categorias'),
                    api.get('/usuarios'),
                    api.get(`/chamados/${id}`)
                ]);
                
                setCategorias(catRes.data);
                setUsuarios(usrRes.data);
                
                const chamado = chamadoRes.data;
                setFormData({
                    assunto: chamado.assunto,
                    categoria_id: chamado.categoria_id,
                    responsavel_id: chamado.responsavel_id || '',
                    prioridade: chamado.prioridade,
                    status: chamado.status,
                    descricao: chamado.descricao,
                    prazo_atendimento: chamado.prazo_atendimento
                });
            } catch (err) {
                console.error("Erro ao carregar dados", err);
                setError('Erro ao carregar os dados do chamado.');
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            await api.put(`/chamados/${id}`, formData);
            navigate(`/chamados/${id}`);
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data?.error || 'Erro ao atualizar chamado.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando formulário...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <Link to={`/chamados/${id}`} className="text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Editar Chamado #{id}</h1>
                        <p className="text-sm text-gray-500">Atualize as informações necessárias</p>
                    </div>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Assunto *</label>
                                <input
                                    type="text"
                                    name="assunto"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.assunto}
                                    onChange={handleChange}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                                <select
                                    name="categoria_id"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.categoria_id}
                                    onChange={handleChange}
                                >
                                    {categorias.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.nome}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Responsável</label>
                                <select
                                    name="responsavel_id"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.responsavel_id}
                                    onChange={handleChange}
                                >
                                    <option value="">Não atribuído</option>
                                    {usuarios.map(usr => (
                                        <option key={usr.id} value={usr.id}>{usr.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status *</label>
                                <select
                                    name="status"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value="Crítico">Crítico</option>
                                    <option value="Aberto">Aberto</option>
                                    <option value="Em Atendimento">Em Atendimento</option>
                                    <option value="Aguardando Usuário">Aguardando Usuário</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade *</label>
                                <select
                                    name="prioridade"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    value={formData.prioridade}
                                    onChange={handleChange}
                                >
                                    <option value="Baixa">Baixa</option>
                                    <option value="Média">Média</option>
                                    <option value="Alta">Alta</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Prazo de Atendimento *</label>
                                <input
                                    type="date"
                                    name="prazo_atendimento"
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.prazo_atendimento}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                                <textarea
                                    name="descricao"
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button
                                type="submit"
                                disabled={saving}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {saving ? 'Salvando...' : 'Atualizar Chamado'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}