import React, { useState, useEffect } from "react";
import { X, Upload, Save, AlertCircle } from "lucide-react";
import MenuService from "../../services/menuService";

const EditMenuItem = ({ item, isOpen, onClose, onSave, userId }) => {
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    preco: "",
    categoria: "",
    imagem: "",
    disponivel: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadedUrl, setImageUploadedUrl] = useState("");
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          nome: item.nome || "",
          descricao: item.descricao || "",
          preco: item.preco || "",
          categoria: item.categoria || "",
          imagem: item.imagem || "",
          disponivel: item.disponivel !== false,
        });
        setImagePreview(item.imagem || "");
        setImageUploadedUrl(item.imagem || "");
        setIsUsingFallback(false);
      } else {
        setFormData({
          nome: "",
          descricao: "",
          preco: "",
          categoria: "",
          imagem: "",
          disponivel: true,
        });
        setImagePreview("");
        setImageUploadedUrl("");
      }
      setErrors({});
      setImageFile(null);
      setUploadingImage(false);
    }
  }, [item, isOpen, userId]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.descricao.trim()) {
      newErrors.descricao = "Descrição é obrigatória";
    }

    if (
      !formData.preco ||
      isNaN(formData.preco) ||
      parseFloat(formData.preco) <= 0
    ) {
      newErrors.preco = "Preço deve ser um número maior que zero";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const uploadImage = async (file) => {
    if (!file) return null;

    try {
      setUploadingImage(true);
      setIsUsingFallback(false);

      const result = await MenuService.uploadImage(file);

      if (!result.imageUrl) {
        throw new Error("URL da imagem não foi retornada pelo servidor");
      }

      return result.imageUrl;
    } catch (error) {
      console.error("❌ Erro ao enviar imagem:", error);
      setIsUsingFallback(true);

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        imagem: "Por favor, selecione uma imagem válida",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        imagem: "Imagem deve ter menos de 5MB",
      }));
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.onerror = () => {
      setErrors((prev) => ({
        ...prev,
        imagem: "Erro ao ler o arquivo de imagem",
      }));
    };
    reader.readAsDataURL(file);

    if (errors.imagem) {
      setErrors((prev) => ({
        ...prev,
        imagem: "",
      }));
    }

    try {
      const uploadedImageUrl = await uploadImage(file);
      setImageUploadedUrl(uploadedImageUrl);
      setFormData((prev) => ({
        ...prev,
        imagem: uploadedImageUrl,
      }));
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        imagem: error.message,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!MenuService.isAuthenticated() || !MenuService.getToken()) {
      setErrors({
        general: "Erro: Sessão expirada. Faça login novamente.",
      });
      console.error("❌ Não autenticado - Token inválido ou ausente");
      return;
    }

    if (!userId) {
      setErrors({
        general: "Erro: ID do usuário não encontrado. Faça login novamente.",
      });
      console.error("❌ userId não fornecido");
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const dataToSend = {
        nome: formData.nome.trim(),
        descricao: formData.descricao.trim(),
        preco: parseFloat(formData.preco),
        categoria: formData.categoria.trim(),
        disponivel: formData.disponivel,
      };

      let finalImageUrl = imageUploadedUrl;

      if (imageFile && !imageUploadedUrl) {
        try {
          finalImageUrl = await uploadImage(imageFile);
          setImageUploadedUrl(finalImageUrl);
        } catch (uploadError) {
          setErrors({
            general: "Erro no upload da imagem: " + uploadError.message,
          });
          return;
        }
      }

      dataToSend.imagem = finalImageUrl || formData.imagem || "";

      let savedItem;
      if (item) {
        savedItem = await MenuService.updateItem(item.id, dataToSend, userId);
      } else {
        savedItem = await MenuService.createItem(dataToSend, userId);
      }

      onSave(savedItem);
      onClose();
    } catch (error) {
      console.error("❌ Erro ao salvar:", error);

      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (
        error.message.includes("401") ||
        error.message.includes("autenticação")
      ) {
        setErrors({
          general:
            "Sessão expirada. Faça login novamente e tente salvar o item.",
        });
      } else {
        setErrors({
          general: `Erro ao ${item ? "atualizar" : "criar"} item: ${
            error.message
          }`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
    setImageUploadedUrl("");
    setIsUsingFallback(false);
    setFormData((prev) => ({
      ...prev,
      imagem: "",
    }));
  };

  if (!isOpen) return null;

  const isProcessing = loading || uploadingImage;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {item ? "Editar Prato" : "Adicionar Novo Prato"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={isProcessing}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          {imageUploadedUrl && !isUsingFallback && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-green-700 text-sm">
                ✅ Imagem carregada no servidor com sucesso!
              </p>
            </div>
          )}

          {imageUploadedUrl && isUsingFallback && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-yellow-700 text-sm">
                ⚠️ Imagem armazenada temporariamente. Será enviada ao salvar.
              </p>
            </div>
          )}

          <div>
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nome do Prato *
            </label>
            <input
              id="nome"
              name="nome"
              type="text"
              value={formData.nome}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.nome ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Ex: Carne com legumes"
              disabled={isProcessing}
            />
            {errors.nome && (
              <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Descrição *
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none ${
                errors.descricao ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Descreva o prato..."
              disabled={isProcessing}
            />
            {errors.descricao && (
              <p className="mt-1 text-sm text-red-600">{errors.descricao}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="preco"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Preço (R$) *
            </label>
            <input
              id="preco"
              name="preco"
              type="number"
              step="0.01"
              min="0"
              value={formData.preco}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                errors.preco ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="0,00"
              disabled={isProcessing}
            />
            {errors.preco && (
              <p className="mt-1 text-sm text-red-600">{errors.preco}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="categoria"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Categoria
            </label>
            <input
              id="categoria"
              name="categoria"
              type="text"
              value={formData.categoria}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Ex: Prato Principal, Sobremesa, etc."
              disabled={isProcessing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Imagem do Prato
            </label>

            {imagePreview && (
              <div className="mb-4 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                  disabled={isProcessing}
                >
                  <X size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <label
                className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                  uploadingImage
                    ? "bg-gray-200 border-gray-400 cursor-not-allowed"
                    : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                }`}
              >
                {uploadingImage ? (
                  <>
                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Upload size={20} className="mr-2" />
                    {imagePreview ? "Alterar Imagem" : "Selecionar Imagem"}
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  disabled={isProcessing}
                />
              </label>
            </div>
            {errors.imagem && (
              <p className="mt-1 text-sm text-red-600">{errors.imagem}</p>
            )}
          </div>

          <div className="flex items-center">
            <input
              id="disponivel"
              name="disponivel"
              type="checkbox"
              checked={formData.disponivel}
              onChange={handleChange}
              className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              disabled={isProcessing}
            />
            <label htmlFor="disponivel" className="ml-2 text-sm text-gray-700">
              Prato disponível
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isProcessing}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors flex items-center justify-center ${
                isProcessing
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Salvando...</span>
                </div>
              ) : uploadingImage ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Enviando imagem...</span>
                </div>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {item ? "Atualizar" : "Criar"} Prato
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMenuItem;
