import { useTaskStore } from '../store/taskStore';
import { storage } from '../utils/storage';
import { getTodayString } from '../utils/date';

jest.mock('../utils/storage', () => ({
  storage: {
    getTasks: jest.fn(),
    saveTasks: jest.fn(),
  },
}));

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

const mockedStorage = storage as jest.Mocked<typeof storage>;

describe('taskStore', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTaskStore.setState({ tasks: [], isLoading: false });
  });

  describe('addTask', () => {
    it('creates a task with basic fields', async () => {
      mockedStorage.saveTasks.mockResolvedValue(undefined);

      const task = await useTaskStore.getState().addTask(
        '테스트 할 일',
        15,
        [1, 2, 3],
      );

      expect(task.title).toBe('테스트 할 일');
      expect(task.estimatedMinutes).toBe(15);
      expect(task.repeatDays).toEqual([1, 2, 3]);
      expect(task.isActive).toBe(true);
      expect(task.id).toBe('test-uuid');
    });

    it('creates a task with difficulty', async () => {
      mockedStorage.saveTasks.mockResolvedValue(undefined);

      const task = await useTaskStore.getState().addTask(
        '어려운 할 일',
        30,
        [0, 1, 2, 3, 4, 5, 6],
        'hard',
      );

      expect(task.difficulty).toBe('hard');
    });

    it('creates a task with scheduledDate', async () => {
      mockedStorage.saveTasks.mockResolvedValue(undefined);

      const task = await useTaskStore.getState().addTask(
        '예약된 할 일',
        10,
        [0, 1, 2, 3, 4, 5, 6],
        'normal',
        '2026-03-01',
      );

      expect(task.scheduledDate).toBe('2026-03-01');
    });

    it('does not include difficulty when undefined', async () => {
      mockedStorage.saveTasks.mockResolvedValue(undefined);

      const task = await useTaskStore.getState().addTask(
        '할 일',
        15,
        [1],
        undefined,
        undefined,
      );

      expect(task).not.toHaveProperty('difficulty');
      expect(task).not.toHaveProperty('scheduledDate');
    });

    it('persists before updating in-memory state', async () => {
      let stateAtSaveTime: { tasks: unknown[] } | null = null;
      mockedStorage.saveTasks.mockImplementation(async () => {
        stateAtSaveTime = { tasks: [...useTaskStore.getState().tasks] };
      });

      await useTaskStore.getState().addTask('할 일', 10, [1]);

      // At the time saveTasks was called, old state should still be empty
      expect(stateAtSaveTime!.tasks).toHaveLength(0);
      // After completion, state is updated
      expect(useTaskStore.getState().tasks).toHaveLength(1);
    });

    it('does not update state if storage fails', async () => {
      mockedStorage.saveTasks.mockRejectedValue(new Error('Storage error'));

      await expect(
        useTaskStore.getState().addTask('할 일', 10, [1])
      ).rejects.toThrow('Storage error');

      expect(useTaskStore.getState().tasks).toHaveLength(0);
    });
  });

  describe('updateTask', () => {
    it('updates task fields immutably', async () => {
      const existingTask = {
        id: 'task-1',
        title: '원래 제목',
        estimatedMinutes: 10,
        repeatDays: [1, 2, 3],
        createdAt: '2026-01-01T00:00:00.000Z',
        isActive: true,
      };
      useTaskStore.setState({ tasks: [existingTask] });
      mockedStorage.saveTasks.mockResolvedValue(undefined);

      await useTaskStore.getState().updateTask('task-1', { title: '새 제목' });

      const updated = useTaskStore.getState().tasks[0];
      expect(updated.title).toBe('새 제목');
      expect(updated.estimatedMinutes).toBe(10); // unchanged
      // Original should not be mutated
      expect(existingTask.title).toBe('원래 제목');
    });
  });

  describe('deleteTask', () => {
    it('removes task from list', async () => {
      useTaskStore.setState({
        tasks: [
          { id: 'task-1', title: 'A', estimatedMinutes: 5, repeatDays: [1], createdAt: '', isActive: true },
          { id: 'task-2', title: 'B', estimatedMinutes: 5, repeatDays: [1], createdAt: '', isActive: true },
        ],
      });
      mockedStorage.saveTasks.mockResolvedValue(undefined);

      await useTaskStore.getState().deleteTask('task-1');

      expect(useTaskStore.getState().tasks).toHaveLength(1);
      expect(useTaskStore.getState().tasks[0].id).toBe('task-2');
    });
  });

  describe('getTask', () => {
    it('returns task by id', () => {
      useTaskStore.setState({
        tasks: [
          { id: 'task-1', title: 'A', estimatedMinutes: 5, repeatDays: [1], createdAt: '', isActive: true },
        ],
      });

      expect(useTaskStore.getState().getTask('task-1')?.title).toBe('A');
    });

    it('returns undefined for non-existent id', () => {
      expect(useTaskStore.getState().getTask('nope')).toBeUndefined();
    });
  });

  describe('getTodayTasks', () => {
    const today = getTodayString();
    const todayDayIndex = new Date().getDay();

    it('returns tasks scheduled for today via repeatDays', () => {
      useTaskStore.setState({
        tasks: [
          { id: '1', title: 'A', estimatedMinutes: 5, repeatDays: [todayDayIndex], createdAt: '', isActive: true },
          { id: '2', title: 'B', estimatedMinutes: 5, repeatDays: [(todayDayIndex + 1) % 7], createdAt: '', isActive: true },
        ],
      });

      const result = useTaskStore.getState().getTodayTasks();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('returns tasks with matching scheduledDate', () => {
      useTaskStore.setState({
        tasks: [
          { id: '1', title: 'A', estimatedMinutes: 5, repeatDays: [], createdAt: '', isActive: true, scheduledDate: today },
          { id: '2', title: 'B', estimatedMinutes: 5, repeatDays: [], createdAt: '', isActive: true, scheduledDate: '2099-12-31' },
        ],
      });

      const result = useTaskStore.getState().getTodayTasks();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('scheduledDate takes priority over repeatDays', () => {
      useTaskStore.setState({
        tasks: [
          {
            id: '1',
            title: 'A',
            estimatedMinutes: 5,
            repeatDays: [todayDayIndex], // would match today
            createdAt: '',
            isActive: true,
            scheduledDate: '2099-12-31', // but scheduled for future
          },
        ],
      });

      const result = useTaskStore.getState().getTodayTasks();
      expect(result).toHaveLength(0);
    });

    it('excludes inactive tasks', () => {
      useTaskStore.setState({
        tasks: [
          { id: '1', title: 'A', estimatedMinutes: 5, repeatDays: [todayDayIndex], createdAt: '', isActive: false },
        ],
      });

      expect(useTaskStore.getState().getTodayTasks()).toHaveLength(0);
    });
  });

  describe('loadTasks', () => {
    it('loads tasks from storage', async () => {
      const storedTasks = [
        { id: '1', title: 'Stored', estimatedMinutes: 10, repeatDays: [1], createdAt: '', isActive: true },
      ];
      mockedStorage.getTasks.mockResolvedValue(storedTasks);

      await useTaskStore.getState().loadTasks();

      expect(useTaskStore.getState().tasks).toEqual(storedTasks);
      expect(useTaskStore.getState().isLoading).toBe(false);
    });

    it('creates sample tasks when storage is empty', async () => {
      mockedStorage.getTasks.mockResolvedValue(null);
      mockedStorage.saveTasks.mockResolvedValue(undefined);

      await useTaskStore.getState().loadTasks();

      expect(useTaskStore.getState().tasks).toHaveLength(3);
      expect(mockedStorage.saveTasks).toHaveBeenCalled();
    });

    it('sample tasks include difficulty field', async () => {
      mockedStorage.getTasks.mockResolvedValue(null);
      mockedStorage.saveTasks.mockResolvedValue(undefined);

      await useTaskStore.getState().loadTasks();

      const tasks = useTaskStore.getState().tasks;
      tasks.forEach((task) => {
        expect(task.difficulty).toBeDefined();
      });
    });

    it('resets isLoading on error', async () => {
      mockedStorage.getTasks.mockRejectedValue(new Error('fail'));

      await expect(useTaskStore.getState().loadTasks()).rejects.toThrow('fail');
      expect(useTaskStore.getState().isLoading).toBe(false);
    });
  });
});
