import React, { useState, useEffect, useContext } from "react";
import Layout from "../components/layout/layout";
import EditMenuItem from "../components/editMenuItem/editMenuItem";
import MenuService from "../services/menuService";
import { AuthContext } from "../App";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAdmin, user } = useContext(AuthContext);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [failedImages, setFailedImages] = useState(new Set());

  useEffect(() => {
    const initLoad = async () => {
      await loadMenuItems();
    };
    initLoad();
  }, []);

  useEffect(() => {
    loadMenuItems();
  }, [isAdmin, user]);

  const isUserAuthenticated = () => {
    try {
      const hasToken = MenuService.getToken();
      const serviceAuth = MenuService.isAuthenticated();
      return hasToken && serviceAuth;
    } catch {
      return false;
    }
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      setError(null);

      let items = [];

      const authenticated = isUserAuthenticated();
      const isAdminUser = isAdmin;

      if (authenticated && isAdminUser) {
        try {
          items = await MenuService.getAllItems();
        } catch {
          items = await MenuService.getAvailableItems();
        }
      } else {
        items = await MenuService.getAvailableItems();
      }

      if (Array.isArray(items)) {
        setMenuItems(items);
        setFailedImages(new Set());
      } else {
        setMenuItems([]);
        setError("Formato de resposta inválido do servidor");
      }
    } catch (err) {
      let errorMessage = "Erro desconhecido ao carregar o menu";

      if (
        err.message.includes("ERR_NETWORK") ||
        err.message.includes("fetch")
      ) {
        errorMessage =
          "Erro de conexão. Verifique se o servidor está rodando na porta 3001.";
      } else if (err.response?.status === 404) {
        errorMessage =
          "Endpoint do menu não encontrado. Verifique as rotas da API.";
      } else if (err.response?.status === 500) {
        errorMessage =
          "Erro interno do servidor. Verifique os logs do backend.";
      } else if (err.message.includes("timeout")) {
        errorMessage =
          "Timeout na requisição. Servidor demorou para responder.";
      } else {
        errorMessage = `Erro ao carregar o menu: ${err.message}`;
      }

      setError(errorMessage);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageError = (itemId) => {
    if (!failedImages.has(itemId)) {
      setFailedImages((prev) => new Set([...prev, itemId]));
    }
  };

  const getImageSrc = (item) => {
    const placeholder =
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzMzMzMzMyIgc3Ryb2tlPSIjNjY2NjY2IiBzdHJva2Utd2lkdGg9IjIiLz4KPHR5cGUgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U2VtPC90ZXh0Pgo8dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5OTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZW08L3RleHQ+Cjwvc3ZnPg==";

    if (
      failedImages.has(item.id) ||
      !item.imagem ||
      item.imagem.trim() === ""
    ) {
      return placeholder;
    }

    const imageSrc = item.imagem.trim();

    if (imageSrc.startsWith("http://") || imageSrc.startsWith("https://")) {
      return imageSrc;
    }

    if (imageSrc.startsWith("data:image/")) {
      return imageSrc;
    }

    if (
      imageSrc.startsWith("/") ||
      imageSrc.startsWith("./") ||
      imageSrc.startsWith("../")
    ) {
      return imageSrc.startsWith("/")
        ? `http://localhost:3001${imageSrc}`
        : imageSrc;
    }

    return `http://localhost:3001/${imageSrc.replace(/^\/+/, "")}`;
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const openAddModal = () => {
    setEditingItem(null);
    setShowEditModal(true);
  };

  const closeModal = () => {
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleItemSaved = async () => {
    await loadMenuItems();
    closeModal();
  };

  const deleteItem = async (id, itemName) => {
    if (!isUserAuthenticated()) {
      alert(
        "Erro: Você precisa estar logado para deletar itens. Faça login novamente."
      );
      return;
    }

    if (!isAdmin) {
      alert("Erro: Você não tem permissão para deletar itens.");
      return;
    }

    if (window.confirm(`Tem certeza que deseja deletar "${itemName}"?`)) {
      try {
        await MenuService.deleteItem(id);
        alert(`Item "${itemName}" deletado com sucesso!`);
        await loadMenuItems();
      } catch (err) {
        if (
          err.message.includes("autenticação") ||
          err.message.includes("login")
        ) {
          alert(`${err.message}\n\nPor favor, faça login novamente.`);
        } else {
          alert(`Erro ao deletar item: ${err.message}`);
        }
      }
    }
  };

  const toggleAvailability = async (id, currentAvailability, itemName) => {
    if (!isUserAuthenticated()) {
      alert(
        "Erro: Você precisa estar logado para alterar a disponibilidade de itens. Faça login novamente."
      );
      return;
    }

    if (!isAdmin) {
      alert("Erro: Você não tem permissão para alterar itens.");
      return;
    }

    try {
      await MenuService.toggleAvailability(id, !currentAvailability);

      const newAvailability = !currentAvailability;
      const status = newAvailability ? "disponível" : "indisponível";

      setMenuItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id ? { ...item, disponivel: newAvailability } : item
        )
      );

      alert(`Item "${itemName}" agora está ${status}!`);
    } catch (err) {
      if (
        err.message.includes("autenticação") ||
        err.message.includes("login")
      ) {
        alert(`${err.message}\n\nPor favor, faça login novamente.`);
      } else {
        alert(
          `Erro ao alterar disponibilidade de "${itemName}": ${err.message}`
        );
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Carregando menu...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-orange-700 mb-4">
                Cardápio do Dia
              </h1>

              {isAdmin && isUserAuthenticated() && (
                <button
                  onClick={openAddModal}
                  className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium"
                >
                  + Adicionar Novo Prato
                </button>
              )}

              {isAdmin && !isUserAuthenticated() && (
                <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                  <p>
                    ⚠️ Você precisa fazer login novamente para gerenciar o menu.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {error && (
            <div className="mb-6">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <div className="flex items-center justify-between">
                  <div>
                    <strong>Erro:</strong> {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          {menuItems.length === 0 && !loading && !error ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">
                {isUserAuthenticated()
                  ? "Nenhum prato encontrado no banco de dados"
                  : "Nenhum prato disponível no momento"}
              </p>
              {isAdmin && isUserAuthenticated() && (
                <button
                  onClick={openAddModal}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Adicionar Primeiro Prato
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {menuItems.map((item, index) => {
                const imageSrc = getImageSrc(item);

                return (
                  <div
                    key={item.id || index}
                    className={`group flex flex-col items-center bg-[#1e1e1e] border-4 border-orange-500 rounded-xl p-6 relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                      !item.disponivel ? "opacity-50" : ""
                    }`}
                  >
                    {isAdmin && isUserAuthenticated() && (
                      <div className="absolute -top-3 -right-3 flex flex-row gap-1 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(item);
                          }}
                          className="bg-blue-500 text-white px-3 py-2 rounded-full text-xs hover:bg-blue-600 shadow-lg border-2 border-white"
                          title="Editar prato"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAvailability(
                              item.id,
                              item.disponivel,
                              item.nome
                            );
                          }}
                          className={`px-3 py-2 rounded-full text-xs shadow-lg border-2 border-white ${
                            item.disponivel
                              ? "bg-yellow-500 hover:bg-yellow-600"
                              : "bg-green-500 hover:bg-green-600"
                          } text-white`}
                          title={
                            item.disponivel
                              ? "Tornar indisponível"
                              : "Tornar disponível"
                          }
                        >
                          {item.disponivel ? "👁️" : "🚫"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteItem(item.id, item.nome);
                          }}
                          className="bg-red-500 text-white px-3 py-2 rounded-full text-xs hover:bg-red-600 shadow-lg border-2 border-white"
                          title="Deletar prato"
                        >
                          🗑️
                        </button>
                      </div>
                    )}

                    <div className="relative">
                      <img
                        src={imageSrc}
                        alt={item.nome}
                        className="w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 object-cover rounded-lg border-2 border-gray-300"
                        onError={() => handleImageError(item.id)}
                      />
                      {isUserAuthenticated() && !item.disponivel && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-xs">
                            INDISPONÍVEL
                          </span>
                        </div>
                      )}
                    </div>

                    <h3 className="font-bold text-orange-500 text-lg mt-4 text-center">
                      {item.nome}
                    </h3>
                    <p className="text-white text-sm mt-2 text-center px-2 line-clamp-3">
                      {item.descricao}
                    </p>
                    <p className="text-white text-lg font-bold mt-2">
                      R${" "}
                      {typeof item.preco === "number"
                        ? item.preco.toFixed(2).replace(".", ",")
                        : item.preco}
                    </p>

                    {item.categoria && (
                      <span className="mt-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full">
                        {item.categoria}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {isUserAuthenticated() && (
        <EditMenuItem
          item={editingItem}
          isOpen={showEditModal}
          onClose={closeModal}
          onSave={handleItemSaved}
          userId={user?.id}
        />
      )}
    </Layout>
  );
}

export default Menu;
