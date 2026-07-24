import { useState, useEffect } from 'react';
import api from '../services/api';
import { PlusCircle, Edit, Trash2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Categorias() {
    const [categorias, setCategorias] = useState([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadCategorias();
    }, []);

    async function loadCategorias() {
        try {
            const response = await api.get('/categorias');
            setCategorias(response.data);
        } catch (error) {
            console.error("Erro ao buscar categorias", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            if (editId) {
                await api.put(`/categorias/${editId}`, { nome, descricao });
                alert('Categoria atualizada com sucesso!');
            } else {
                await api.post('/categorias', { nome, descricao });
                alert('Categoria criada com sucesso!');
            }
            
            setNome('');
            setDescricao('');
            setEditId(null);
            loadCategorias();
        } catch (error) {
            alert('Erro ao salvar a categoria. Verifique os dados.');
        }
    }

    function handleEdit(categoria) {
        setNome(categoria.nome);
        setDescricao(categoria.descricao || '');
        setEditId(categoria.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function cancelEdit() {
        setNome('');
        setDescricao('');
        setEditId(null);
    }

    async function handleDelete(id) {
        const confirmar = window.confirm('Tem certeza que deseja excluir esta categoria?');
        if (!confirmar) return;

        try {
            await api.delete(`/categorias/${id}`);
            loadCategorias();
        } catch (err) {
            alert(err.response?.data?.error || 'Erro ao excluir a categoria.');
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600">HelpDesk</h1>
                </div>
                <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium">
                    Voltar ao Dashboard
                </Link>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">Gestão de Categorias</h2>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-4">
                        {editId ? 'Editar Categoria' : 'Nova Categoria'}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Nome *</label>
                            <input 
                                type="text" 
                                required
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Descrição</label>
                            <input 
                                type="text" 
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button 
                            type="submit" 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            {editId ? <Edit size={18} /> : <PlusCircle size={18} />}
                            {editId ? 'Salvar Alterações' : 'Cadastrar'}
                        </button>
                        
                        {editId && (
                            <button 
                                type="button" 
                                onClick={cancelEdit}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                            >
                                <X size={18} />
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>

                {loading ? (
                    <div className="text-center py-10 text-gray-500">Carregando categorias...</div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-600 text-sm border-b">
                                    <th className="p-4 font-medium">ID</th>
                                    <th className="p-4 font-medium">Nome</th>
                                    <th className="p-4 font-medium">Descrição</th>
                                    <th className="p-4 font-medium text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorias.map(categoria => (
                                    <tr key={categoria.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-500">#{categoria.id}</td>
                                        <td className="p-4 font-medium text-gray-800">{categoria.nome}</td>
                                        <td className="p-4 text-gray-600">{categoria.descricao || '-'}</td>
                                        <td className="p-4 flex justify-end gap-3">
                                            <button 
                                                onClick={() => handleEdit(categoria)}
                                                className="text-blue-500 hover:text-blue-700 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(categoria.id)}
                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
}