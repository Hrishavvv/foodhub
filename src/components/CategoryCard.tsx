import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
}

export const CategoryCard = ({ id, name, icon }: CategoryCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(`/restaurants?category=${id}`)}
      className="glass-card p-6 rounded-2xl shadow-card hover:shadow-hover transition-smooth text-center group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-5xl mb-3 group-hover:scale-110 transition-smooth">{icon}</div>
      <h3 className="font-semibold text-foreground">{name}</h3>
    </motion.button>
  );
};
