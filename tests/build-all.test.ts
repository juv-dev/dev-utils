// tests/build-all.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { buildAllProjects } from '../src/main';

// Mock dependencies
vi.mock('fs', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    default: {
      ...actual.default,
      mkdirSync: vi.fn(),
      readdirSync: vi.fn(),
      existsSync: vi.fn(),
      cpSync: vi.fn(),
    },
    mkdirSync: vi.fn(),
    readdirSync: vi.fn(),
    existsSync: vi.fn(),
    cpSync: vi.fn(),
  };
});

vi.mock('child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('process', () => ({
  cwd: vi.fn(() => '/mock/root'),
  argv: ['node', 'build-all.ts'],
}));

vi.mock('path', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    join: vi.fn((...paths: string[]) => {
      const result = paths.join('/').replace(/\/+/g, '/');
      return result;
    }),
    dirname: vi.fn((path: string) => path.split('/').slice(0, -1).join('/')),
  };
});

const mockFs = await import('fs');
const mockExecSync = (await import('child_process')).execSync;

describe('buildAllProjects', () => {
  const mockConsole = {
    log: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Mock console
    global.console = mockConsole as any;
    
    // Default mock implementations
    (mockFs as any).default.mkdirSync.mockImplementation(() => {});
    (mockFs as any).default.cpSync.mockImplementation(() => {});
    (mockExecSync as any).mockImplementation(() => Buffer.from(''));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create output directory with default path', () => {
    (mockFs as any).default.readdirSync.mockReturnValue([]);
    
    buildAllProjects();
    
    expect(mockFs.default.mkdirSync).toHaveBeenCalledWith(
      'C:\\Developers\\Github\\dev-utils\\dist',
      { recursive: true }
    );
  });

  it('should use custom output path when provided', () => {
    (mockFs as any).default.readdirSync.mockReturnValue([]);
    
    buildAllProjects({ outputPath: 'C:\\custom\\output' });
    
    expect(mockFs.default.mkdirSync).toHaveBeenCalledWith(
      'C:\\custom\\output',
      { recursive: true }
    );
  });

  it('should skip directories in skipDirs', () => {
    const entries = [
      { isDirectory: () => true, name: 'node_modules' },
      { isDirectory: () => true, name: 'dist' },
      { isDirectory: () => true, name: 'project1' },
    ];
    
    (mockFs as any).default.readdirSync.mockReturnValue(entries);
    (mockFs as any).default.existsSync.mockReturnValue(true);
    
    buildAllProjects();
    
    expect(mockExecSync).toHaveBeenCalledTimes(1);
    expect(mockExecSync).toHaveBeenCalledWith('pnpm run build', {
      cwd: 'C:\\Developers\\Github\\dev-utils\\project1',
      stdio: 'inherit',
    });
  });

  it('should handle build errors gracefully', () => {
    const entries = [
      { isDirectory: () => true, name: 'failing-project' },
    ];
    
    (mockFs as any).default.readdirSync.mockReturnValue(entries);
    (mockFs as any).default.existsSync.mockReturnValue(true);
    (mockExecSync as any).mockImplementation(() => {
      throw new Error('Build failed');
    });
    
    buildAllProjects();
    
    expect(mockConsole.error).toHaveBeenCalledWith(
      '❌ Failed to build failing-project:',
      'Build failed'
    );
  });

  it('should copy dist directories to output path', () => {
    const entries = [
      { isDirectory: () => true, name: 'project1' },
      { isDirectory: () => true, name: 'project2' },
    ];
    
    (mockFs as any).default.readdirSync.mockReturnValue(entries);
    (mockFs as any).default.existsSync
      .mockImplementation((path: string) => 
        path.endsWith('package.json') || path.endsWith('dist')
      );
    
    buildAllProjects();
    
    expect(mockFs.default.cpSync).toHaveBeenCalledTimes(2);
    expect(mockFs.default.cpSync).toHaveBeenCalledWith(
      'C:\\Developers\\Github\\dev-utils\\project1\\dist',
      'C:\\Developers\\Github\\dev-utils\\dist\\project1\\dist',
      { recursive: true }
    );
  });

  it('should create target directory before copying', () => {
    const entries = [
      { isDirectory: () => true, name: 'project1' },
    ];
    
    (mockFs as any).default.readdirSync.mockReturnValue(entries);
    (mockFs as any).default.existsSync.mockReturnValue(true);
    
    buildAllProjects();
    
    expect(mockFs.default.mkdirSync).toHaveBeenCalledWith(
      'C:\\Developers\\Github\\dev-utils\\dist\\project1',
      { recursive: true }
    );
  });
});