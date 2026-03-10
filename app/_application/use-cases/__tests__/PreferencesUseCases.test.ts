import { GetUserPreferences } from '../GetUserPreferences';
import { UpdateUserPreferences } from '../UpdateUserPreferences';
import { IPreferencesRepository } from '../../../_domain/repositories/IPreferencesRepository';
import { UserPreferences } from '../../../_domain/entities/UserPreferences';

describe('Preferences Use Cases', () => {
  let mockRepository: jest.Mocked<IPreferencesRepository>;

  beforeEach(() => {
    mockRepository = {
      findByUserId: jest.fn(),
      save: jest.fn(),
    };
  });

  describe('GetUserPreferences', () => {
    let getUserPreferences: GetUserPreferences;

    beforeEach(() => {
      getUserPreferences = new GetUserPreferences(mockRepository);
    });

    it('should return existing preferences', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await getUserPreferences.execute(userId);

      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBe(mockPreferences);
      expect(mockRepository.save).not.toHaveBeenCalled();
    });

    it('should create default preferences if none exist', async () => {
      const userId = 'user-123';
      mockRepository.findByUserId.mockResolvedValue(null);

      const result = await getUserPreferences.execute(userId);

      expect(mockRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toBeInstanceOf(UserPreferences);
      expect(result.userId).toBe(userId);
      expect(mockRepository.save).toHaveBeenCalledWith(expect.any(UserPreferences));
    });

    it('should save default preferences when created', async () => {
      const userId = 'user-123';
      mockRepository.findByUserId.mockResolvedValue(null);

      await getUserPreferences.execute(userId);

      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('UpdateUserPreferences', () => {
    let updateUserPreferences: UpdateUserPreferences;

    beforeEach(() => {
      updateUserPreferences = new UpdateUserPreferences(mockRepository);
    });

    it('should update layout mode', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {
        layoutMode: 'complete',
      });

      expect(result.layoutMode).toBe('complete');
      expect(mockRepository.save).toHaveBeenCalledWith(mockPreferences);
    });

    it('should update visual complexity', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {
        visualComplexity: 'minimal',
      });

      expect(result.visualComplexity).toBe('minimal');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update information density', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {
        informationDensity: 'complete',
      });

      expect(result.informationDensity).toBe('complete');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update text size', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {
        textSize: 'large',
      });

      expect(result.textSize).toBe('large');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update pomodoro settings', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {
        pomodoroSettings: {
          workDuration: 30,
          breakDuration: 10,
        },
      });

      expect(result.pomodoroSettings.workDuration).toBe(30);
      expect(result.pomodoroSettings.breakDuration).toBe(10);
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update multiple preferences at once', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {
        layoutMode: 'custom',
        visualComplexity: 'minimal',
        textSize: 'large',
        taskCreationMode: 'full',
      });

      expect(result.layoutMode).toBe('custom');
      expect(result.visualComplexity).toBe('minimal');
      expect(result.textSize).toBe('large');
      expect(result.taskCreationMode).toBe('full');
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should create default preferences if none exist', async () => {
      const userId = 'user-123';
      mockRepository.findByUserId.mockResolvedValue(null);

      const result = await updateUserPreferences.execute(userId, {
        layoutMode: 'custom',
      });

      expect(result).toBeInstanceOf(UserPreferences);
      expect(result.layoutMode).toBe('custom');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update notification timing', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {
        notificationTiming: 'focus-ends',
      });

      expect(result.notificationTiming).toBe('focus-ends');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should update task creation mode', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {
        taskCreationMode: 'simple',
      });

      expect(result.taskCreationMode).toBe('simple');
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should handle empty updates', async () => {
      const userId = 'user-123';
      const mockPreferences = UserPreferences.createDefault(userId);
      mockRepository.findByUserId.mockResolvedValue(mockPreferences);

      const result = await updateUserPreferences.execute(userId, {});

      expect(result).toBe(mockPreferences);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });
});
