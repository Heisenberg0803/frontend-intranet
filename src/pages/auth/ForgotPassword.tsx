import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import supabase from '../../service/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Erro ao enviar email de recuperação. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-8">
      <div className="mb-6">
        <Link to="/login" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft size={16} className="mr-2" />
          Voltar para login
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
          Recuperar Senha
        </h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <p>Email de recuperação enviado! Por favor, verifique sua caixa de entrada.</p>
            <p className="mt-2 text-sm">
              Se você não receber o email em alguns minutos, verifique sua pasta de spam.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-600 text-sm">
              Digite seu email corporativo e enviaremos instruções para redefinir sua senha.
            </p>

            <Input
              id="email"
              type="email"
              label="Email Corporativo"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu.email@falavinhanext.com"
              autoComplete="email"
            />

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
            >
              Enviar Instruções
            </Button>
          </>
        )}
      </form>
    </Card>
  );
};

export default ForgotPassword;