import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { userApi } from '../../service/userApi';
import { User } from '../../types/type';

interface ResetPasswordModalProps {
  user: User;
  onClose: () => void;
  onSuccess?: () => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, onClose, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await userApi.resetPassword(user.id, newPassword);
      onSuccess?.();
      onClose();
    } catch (err) {
      console.error('Failed to reset password:', err);
      setError('Falha ao redefinir senha. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-y-auto z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black opacity-30"></div>
      <div className="relative bg-white rounded-lg max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Redefinir Senha - {user.name} {user.last_name}
        </h3>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="password"
            label="Nova Senha"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Digite a nova senha"
          />

          <Input
            type="password"
            label="Confirmar Nova Senha"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Digite a senha novamente"
          />

          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              <X size={16} className="mr-1" />
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={loading}
            >
              <Check size={16} className="mr-1" />
              Redefinir Senha
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;