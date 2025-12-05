"use client";
import React, { useEffect, useState } from "react";
// Adicionamos getApps para verificar instâncias existentes
import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  signInAnonymously, 
  onAuthStateChanged,
  signInWithCustomToken,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  addDoc, 
  deleteDoc, 
  doc, 
  serverTimestamp,
  updateDoc,
  query
} from "firebase/firestore";
import { 
  Users, 
  Trash2, 
  Search, 
  UserPlus, 
  Smartphone,
  Shield,
  Loader2,
  Ban,
  CheckCircle,
  Bell,
  Apple,
  X,
  AlertTriangle
} from "lucide-react";

// --- 1. DECLARAÇÕES GLOBAIS (Corrige os 7 Erros de Variável Não Definida) ---
// Estas variáveis são injetadas pelo ambiente Canvas, mas precisam de declaração
// explícita para o TypeScript não gerar erros de compilação/lint.
declare global {
  var __firebase_config: string | undefined;
  var __app_id: string | undefined;
  var __initial_auth_token: string | undefined;
}

// --- Configuração do Firebase ---
// Verifica se estamos no ambiente do artefato (preview) ou local
const getFirebaseConfig = () => {
  if (typeof __firebase_config !== 'undefined') {
    return JSON.parse(__firebase_config);
  }
  return {}; 
};

// --- Inicialização Segura (Singleton) ---
const app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig());
const auth = getAuth(app);
const db = getFirestore(app);

// ID do App (Ambiente AI ou Padrão)
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Coleção onde o APP MOBILE salvaria os dados
const COLLECTION_NAME = "users_registry";

// Tipos adaptados para contexto Mobile
interface UserData {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'support';
  status: 'active' | 'blocked';
  platform: 'ios' | 'android' | 'web';
  appVersion: string;
  createdAt: any;
}

// --- Componente de Modal de Confirmação Dedicado (Substitui window.confirm) ---
interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isOpen, onClose, onConfirm, title, message, confirmText
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all">
                <div className="p-6">
                    <div className="flex items-center space-x-3">
                        <AlertTriangle size={24} className="text-red-500 flex-shrink-0" />
                        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    </div>
                    <p className="mt-4 text-sm text-slate-600">{message}</p>
                </div>
                
                <div className="flex justify-end p-4 bg-slate-50 border-t border-slate-100 space-x-3">
                    <button 
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button"
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};


export default function MobileUsersAdmin() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados para o Modal de Confirmação de Exclusão
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Estado para feedback de ações
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error' | 'info'} | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
    platform: "android",
    appVersion: "1.0.0"
  });

  // Mostra mensagem temporária
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // 1. Autenticação
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
           await signInWithCustomToken(auth, __initial_auth_token);
        } else {
           await signInAnonymously(auth);
        }
      } catch (err) {
        console.error("Erro auth:", err);
      }
    };
    
    initAuth();
    return onAuthStateChanged(auth, setCurrentUser);
  }, []);

  // 2. Listener (Simulando leitura dos dados vindos do Mobile)
  useEffect(() => {
    if (!currentUser) return;

    const usersRef = collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME);
    
    // Removendo 'orderBy' para cumprir a regra do ambiente e evitar erros de índice.
    const q = query(usersRef); 

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as UserData[];
        
        // Ordenação feita em memória (client-side)
        usersList.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

        setUsers(usersList);
        setLoading(false);
      },
      (err) => {
        console.error("Erro Firestore:", err);
        setError("Não foi possível carregar a lista de usuários.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Ações de Gestão
  const handleToggleStatus = async (user: UserData) => {
    if (!currentUser) {
      showToast("Autenticação pendente.", "error");
      return;
    }
    try {
      const newStatus = user.status === 'active' ? 'blocked' : 'active';
      const docRef = doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, user.id);
      
      await updateDoc(docRef, { status: newStatus });
      showToast(`Usuário ${newStatus === 'blocked' ? 'bloqueado' : 'ativado'} com sucesso!`, 'success');
    } catch (err) {
      showToast("Erro ao atualizar status.", "error");
    }
  };
  
  // Função para abrir o modal de confirmação
  const handleRequestDelete = (id: string) => {
    setUserToDelete(id);
    setIsConfirmModalOpen(true);
  };
  
  // Confirmação da exclusão (executa a deleção)
  const handleConfirmDelete = async () => {
    setIsConfirmModalOpen(false);
    if (!currentUser || !userToDelete) {
        showToast("Erro: Usuário ou registro não identificado.", "error");
        return;
    }
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME, userToDelete));
      showToast("Registro removido.", "success");
    } catch (err) {
      showToast("Erro ao remover.", "error");
    } finally {
      setUserToDelete(null);
    }
  };

  const handleSimulateAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
        showToast("Autenticação pendente.", "error");
        return;
    }
    try {
      const usersRef = collection(db, 'artifacts', appId, 'public', 'data', COLLECTION_NAME);
      await addDoc(usersRef, {
        ...formData,
        createdAt: serverTimestamp()
      });
      setIsModalOpen(false);
      showToast("Usuário adicionado manualmente.", "success");
      setFormData({ 
        name: "", email: "", role: "user", status: "active", 
        platform: "android", appVersion: "1.0.0" 
      });
    } catch (err) {
      showToast("Erro ao criar.", "error");
    }
  };

  const handleSendPush = (userName: string) => {
    // Substituindo 'alert' por um Toast mais informativo
    showToast(`Push Simulado: Notificação enviada para o dispositivo de ${userName}.`, 'info');
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "--/--";
    try {
        // Verifica se é um Timestamp do Firestore antes de converter
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp.seconds * 1000);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute:'2-digit'
        });
    } catch {
        return "Data Inválida";
    }
  };

  // Ícones de plataforma
  const PlatformIcon = ({ type }: { type: string }) => {
    if (type === 'ios') return <Apple size={16} className="text-gray-600" />;
    if (type === 'android') return <Smartphone size={16} className="text-green-600" />;
    return <Smartphone size={16} className="text-blue-400" />;
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  const currentUserId = currentUser?.uid || "N/A";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-in fade-in slide-in-from-top-2 ${
            toast.type === 'success' ? 'bg-emerald-600' : 
            toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        } flex items-center gap-2`}>
          {toast.msg}
          <button onClick={() => setToast(null)}><X size={16} /></button>
        </div>
      )}

      <main className="max-w-7xl mx-auto p-6">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Total de Usuários</p>
                    <p className="text-3xl font-bold text-slate-900 mt-1">{users.length}</p>
                </div>
                <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                    <Users size={20} />
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Android vs iOS</p>
                    <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center gap-1 text-sm font-semibold text-green-600">
                            <Smartphone size={14} /> {users.filter(u => u.platform === 'android').length}
                        </div>
                        <div className="h-4 w-px bg-slate-200"></div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-slate-600">
                            <Apple size={14} /> {users.filter(u => u.platform === 'ios').length}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500 font-medium">Bloqueados</p>
                    <p className="text-3xl font-bold text-red-600 mt-1">{users.filter(u => u.status === 'blocked').length}</p>
                </div>
                <div className="h-10 w-10 bg-red-50 rounded-full flex items-center justify-center text-red-600">
                    <Ban size={20} />
                </div>
            </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder="Buscar por email, nome..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm transition-all shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm"
            >
                <UserPlus size={16} />
                Simular Novo Cadastro
            </button>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Usuário / Email</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Dispositivo</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Versão App</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {filteredUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                                    Nenhum usuário encontrado na base de dados.
                                </td>
                            </tr>
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <div className="text-sm font-medium text-slate-900">{user.name}</div>
                                                <div className="text-xs text-slate-500">{user.email}</div>
                                                <div className="text-[10px] text-slate-400 mt-0.5">Cadastrado em: {formatDate(user.createdAt)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="bg-slate-100 p-1.5 rounded-md">
                                                <PlatformIcon type={user.platform} />
                                            </div>
                                            <span className="text-sm text-slate-600 capitalize">{user.platform}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                         <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-mono">
                                            v{user.appVersion || '1.0.0'}
                                         </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button 
                                            onClick={() => handleToggleStatus(user)}
                                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                                                user.status === 'active' 
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                                                : 'bg-red-100 text-red-700 hover:bg-red-200'
                                            }`}
                                        >
                                            {user.status === 'active' ? (
                                                <><CheckCircle size={12} /> Ativo</>
                                            ) : (
                                                <><Ban size={12} /> Bloqueado</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => handleSendPush(user.name)}
                                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                title="Enviar Push Notification (Simulado)"
                                            >
                                                <Bell size={18} />
                                            </button>
                                            <button 
                                                onClick={() => handleRequestDelete(user.id)} // Alterado para abrir o modal
                                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir Registro"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </main>

      {/* Modal Add (Simulation) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">Simular Cadastro Mobile</h3>
                    <p className="text-xs text-slate-500">Isso cria um registro como se viesse do App</p>
                </div>
                
                <form onSubmit={handleSimulateAdd} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dados do Usuário</label>
                        <input 
                            required
                            placeholder="Nome Completo"
                            className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                        <input 
                            required
                            type="email"
                            placeholder="Email"
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Dados do Dispositivo</label>
                        <div className="grid grid-cols-2 gap-3">
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm bg-white"
                                value={formData.platform}
                                onChange={e => setFormData({...formData, platform: e.target.value as any})}
                            >
                                <option value="android">Android</option>
                                <option value="ios">iOS (iPhone)</option>
                            </select>
                            <input 
                                placeholder="Versão App (ex: 1.2.0)"
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                value={formData.appVersion}
                                onChange={e => setFormData({...formData, appVersion: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button 
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit"
                            className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium shadow-lg shadow-indigo-200"
                        >
                            Simular Cadastro
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
      
      {/* 2. Modal de Confirmação de Exclusão */}
      <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmação de Exclusão"
          message="Essa ação removerá o registro do usuário permanentemente. O App mobile pode quebrar se ele tentar logar novamente. Deseja realmente continuar?"
          confirmText="Excluir Usuário"
      />

    </div>
  );
}