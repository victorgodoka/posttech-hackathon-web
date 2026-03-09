import { TaskCategory, TASK_CATEGORIES, getCategoryConfig, CategoryConfig } from '../TaskCategory';

describe('TaskCategory', () => {
  describe('TASK_CATEGORIES', () => {
    it('should have 12 categories', () => {
      expect(TASK_CATEGORIES).toHaveLength(12);
    });

    it('should have all required properties', () => {
      TASK_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('color');
      });
    });

    it('should have unique ids', () => {
      const ids = TASK_CATEGORIES.map(c => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(TASK_CATEGORIES.length);
    });

    it('should include personal category', () => {
      const personal = TASK_CATEGORIES.find(c => c.id === 'personal');
      expect(personal).toBeDefined();
      expect(personal?.label).toBe('Pessoal');
      expect(personal?.icon).toBe('mdi:account');
      expect(personal?.color).toBe('text-purple-400');
    });

    it('should include work category', () => {
      const work = TASK_CATEGORIES.find(c => c.id === 'work');
      expect(work).toBeDefined();
      expect(work?.label).toBe('Trabalho');
      expect(work?.icon).toBe('mdi:briefcase');
      expect(work?.color).toBe('text-amber-400');
    });

    it('should include study category', () => {
      const study = TASK_CATEGORIES.find(c => c.id === 'study');
      expect(study).toBeDefined();
      expect(study?.label).toBe('Estudos');
      expect(study?.icon).toBe('mdi:book-open-page-variant');
      expect(study?.color).toBe('text-indigo-400');
    });

    it('should have other as last category', () => {
      const lastCategory = TASK_CATEGORIES[TASK_CATEGORIES.length - 1];
      expect(lastCategory.id).toBe('other');
      expect(lastCategory.label).toBe('Outros');
    });
  });

  describe('getCategoryConfig', () => {
    it('should return config for valid category', () => {
      const config = getCategoryConfig('work');
      
      expect(config).toBeDefined();
      expect(config.id).toBe('work');
      expect(config.label).toBe('Trabalho');
      expect(config.icon).toBe('mdi:briefcase');
      expect(config.color).toBe('text-amber-400');
    });

    it('should return config for all valid categories', () => {
      const validCategories: TaskCategory[] = [
        'personal', 'health', 'home', 'shopping', 'finance',
        'study', 'school', 'research', 'work', 'meeting', 'project', 'other'
      ];

      validCategories.forEach(category => {
        const config = getCategoryConfig(category);
        expect(config).toBeDefined();
        expect(config.id).toBe(category);
      });
    });

    it('should return other category for invalid category', () => {
      const config = getCategoryConfig('invalid' as TaskCategory);
      
      expect(config).toBeDefined();
      expect(config.id).toBe('other');
      expect(config.label).toBe('Outros');
    });

    it('should return other category as fallback', () => {
      const config = getCategoryConfig('' as TaskCategory);
      
      expect(config.id).toBe('other');
    });

    it('should return category with all properties', () => {
      const config = getCategoryConfig('health');
      
      expect(config).toHaveProperty('id');
      expect(config).toHaveProperty('label');
      expect(config).toHaveProperty('icon');
      expect(config).toHaveProperty('color');
      expect(config.id).toBe('health');
      expect(config.label).toBe('Saúde');
      expect(config.icon).toBe('mdi:heart-pulse');
      expect(config.color).toBe('text-red-400');
    });
  });

  describe('CategoryConfig interface', () => {
    it('should match expected structure', () => {
      const config: CategoryConfig = {
        id: 'work',
        label: 'Test',
        icon: 'test-icon',
        color: 'test-color'
      };

      expect(config.id).toBe('work');
      expect(config.label).toBe('Test');
      expect(config.icon).toBe('test-icon');
      expect(config.color).toBe('test-color');
    });
  });
});
