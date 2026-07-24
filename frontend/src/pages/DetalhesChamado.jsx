import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { ArrowLeft, Send, CheckCircle, MessageSquare } from 'lucide-react';

export default function DetalhesChamado() {
    const { id } = useParams(); // Pega o ID da URL
    
    const [chamado, setChamado] = useState(null);
    const [comentarios, setComentarios] = useState([]);
    const [novoComentario, setNovoComentario] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        async function loadDados() {
            try {
                const response = await api.get(`/chamados/${id}`);
                setChamado(response.data);
                
                if (response.data.comentarios) {
                    setComentarios(response.data.comentarios);
                }
            } catch (err) {
                console.error("Erro ao carregar chamado", err);
                setError('Erro ao carregar os dados do chamado.');
            } finally {
                setLoading(false);
            }
        }
        loadDados();
    }, [id]);

    const handleComentar = async (e) => {
        e.preventDefault();
        if (!novoComentario.trim()) return;

        try {
            const response = await api.post(`/chamados/${id}/comentarios`, { texto: novoComentario });
            
            // add novo comentário
            setComentarios([...comentarios, response.data]);
            setNovoComentario('');
        } catch (err) {
            alert('Erro ao enviar comentário.');
        }
    };

    const handleFinalizar = async () => {
        try {
            await api.patch(`/chamados/${id}/finalizar`);
            
            setChamado({ ...chamado, status: 'Finalizado' });
            alert('Atendimento encerrado com sucesso!');
        } catch (err) {
            alert(err.response?.data?.error || 'Erro ao finalizar chamado.');
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Carregando detalhes...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!chamado) return <div className="p-8 text-center text-gray-500">Chamado não encontrado.</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <header className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Chamado #{chamado.id}</h1>
                            <p className="text-sm text-gray-500">{chamado.assunto}</p>
                        </div>
                    </div>
                    
                    {chamado.status !== 'Finalizado' && (
                        <button 
                            onClick={handleFinalizar}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <CheckCircle size={20} />
                            Finalizar Atendimento
                        </button>
                    )}
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Descrição do Problema</h2>
                            <p className="text-gray-600 whitespace-pre-wrap">{chamado.descricao}</p>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MessageSquare size={20} /> Comentários
                            </h2>
                            
                            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                                {comentarios.length === 0 ? (
                                    <p className="text-gray-400 text-sm italic">Nenhum comentário registrado ainda.</p>
                                ) : (
                                    comentarios.map(comentario => (
                                        <div key={comentario.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                            <p className="text-gray-700 text-sm">{comentario.texto}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {chamado.status !== 'Finalizado' && (
                                <form onSubmit={handleComentar} className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Adicione um comentário com a solução..."
                                        value={novoComentario}
                                        onChange={(e) => setNovoComentario(e.target.value)}
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        <Send size={18} />
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-semibold text-gray-800 mb-4">Informações</h3>
                            <ul className="space-y-4 text-sm">
                                <li>
                                    <span className="block text-gray-500 mb-1">Status</span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${chamado.status === 'Finalizado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {chamado.status}
                                    </span>
                                </li>
                                <li>
                                    <span className="block text-gray-500 mb-1">Solicitante</span>
                                    <span className="text-gray-800 font-medium">{chamado.solicitante?.name || 'Desconhecido'}</span>
                                </li>
                                <li>
                                    <span className="block text-gray-500 mb-1">Responsável</span>
                                    <span className="text-gray-800 font-medium">{chamado.responsavel?.name || 'Não atribuído'}</span>
                                </li>
                                <li>
                                    <span className="block text-gray-500 mb-1">Prioridade</span>
                                    <span className="text-gray-800 font-medium">{chamado.prioridade}</span>
                                </li>
                                <li>
                                    <span className="block text-gray-500 mb-1">Prazo</span>
                                    <span className="text-gray-800 font-medium">{chamado.prazo_atendimento}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}