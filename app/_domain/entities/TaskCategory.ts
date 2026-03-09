export type TaskCategory = 
  | 'personal'
  | 'health'
  | 'home'
  | 'shopping'
  | 'finance'
  | 'study'
  | 'school'
  | 'research'
  | 'work'
  | 'meeting'
  | 'project'
  | 'other';

export interface CategoryConfig {
  id: TaskCategory;
  label: string;
  icon: string;
  color: string;
}

export const TASK_CATEGORIES: CategoryConfig[] = [
  // Vida e Dia a Dia
  { id: 'personal', label: 'Pessoal', icon: 'mdi:account', color: 'text-purple-400' },
  { id: 'health', label: 'Saúde', icon: 'mdi:heart-pulse', color: 'text-red-400' },
  { id: 'home', label: 'Casa', icon: 'mdi:home', color: 'text-blue-400' },
  { id: 'shopping', label: 'Compras', icon: 'mdi:cart', color: 'text-green-400' },
  { id: 'finance', label: 'Finanças', icon: 'mdi:currency-usd', color: 'text-emerald-400' },
  
  // Escola/Faculdade/Estudo
  { id: 'study', label: 'Estudos', icon: 'mdi:book-open-page-variant', color: 'text-indigo-400' },
  { id: 'school', label: 'Escola/Faculdade', icon: 'mdi:school', color: 'text-cyan-400' },
  { id: 'research', label: 'Pesquisa', icon: 'mdi:flask', color: 'text-violet-400' },
  
  // Trabalho
  { id: 'work', label: 'Trabalho', icon: 'mdi:briefcase', color: 'text-amber-400' },
  { id: 'meeting', label: 'Reunião', icon: 'mdi:account-group', color: 'text-orange-400' },
  { id: 'project', label: 'Projeto', icon: 'mdi:folder-multiple', color: 'text-teal-400' },
  
  // Outros
  { id: 'other', label: 'Outros', icon: 'mdi:dots-horizontal', color: 'text-slate-400' },
];

export function getCategoryConfig(category: TaskCategory): CategoryConfig {
  return TASK_CATEGORIES.find(c => c.id === category) || TASK_CATEGORIES[TASK_CATEGORIES.length - 1];
}
