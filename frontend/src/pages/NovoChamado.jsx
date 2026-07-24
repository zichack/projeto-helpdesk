import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Save } from 'lucide-react';

export default function NovoChamado() {
    const navigate = useNavigate();
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        assunto: '',
        categoria_id: '',
        prioridade: 'Baixa',
        descricao: '',
        prazo_atendimento: ''
    });

    const hoje = new Date().toISOString().split('T')[0];

    // busca categorias na API
    useEffect(() => {
        async function loadCategorias() {
            try {
                const response = await api.get('/categorias');
                setCategorias(response.data);
                // seleciona primeira categoria por padrão
                if(response.data.length > 0) {
                    setFormData(prev => ({ ...prev, categoria_id: response.data[0].id }));
                }
            } catch (err) {
                console.error("Erro ao carregar categorias", err);
            }
        }
        loadCategorias();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/chamados', formData);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Erro ao criar chamado. Verifique os dados.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-3xl mx-auto">
                <header className="flex items-center gap-4 mb-8">
                    <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Abrir Novo Chamado</h1>
                        <p className="text-sm text-gray-500">Preencha os dados abaixo para solicitar atendimento</p>
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
                                    placeholder="Ex: Computador não liga"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prazo de Atendimento (Não pode ser retroativo) *
                                </label>
                                <input
                                    type="date"
                                    name="prazo_atendimento"
                                    required
                                    min={hoje}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.prazo_atendimento}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada *</label>
                                <textarea
                                    name="descricao"
                                    required
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                    value={formData.descricao}
                                    onChange={handleChange}
                                    placeholder="Descreva o problema com o máximo de detalhes possível..."
                                ></textarea>
                            </div>
                        </div>

                        <div className="flex justify-end pt-4 border-t">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={20} />
                                {loading ? 'Salvando...' : 'Salvar Chamado'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}