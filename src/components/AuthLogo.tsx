// src/components/AuthLogo.tsx
interface Props {
  subtitle?: string;
}

export const AuthLogo: React.FC<Props> = ({ subtitle }) => {
  return (
    <div className="text-center mb-6">
      <div className="text-2xl font-semibold">Enterra</div>
      {subtitle && (
        <div className="text-sm text-gray-400">{subtitle}</div>
      )}
    </div>
  );
};
