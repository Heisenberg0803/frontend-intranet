import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import supabase from '../../service/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.updateUser({
        password: password
      });

      if (error) throw error;

      // Redirect to login page after successful password reset
      navigate('/login', {
        state: { message: 'Senha atualizada com sucesso! Por favor, faça login com sua nova senha.' }
      });
    } catch (err) {
      console.error('Password update error:', err);
      setError('Erro ao atualizar senha. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          Redefinir Senha
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        <Input
          id="password"
          type="password"
          label="Nova Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={8}
        />

        <Input
          id="confirmPassword"
          type="password"
          label="Confirmar Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          placeholder="••••••••"
          minLength={8}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={loading}
        >
          Atualizar Senha
        </Button>
      </form>
    </Card>
  );
};

export default ResetPassword;