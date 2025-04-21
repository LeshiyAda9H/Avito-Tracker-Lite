import { toDisplayStatus, toServerStatus } from '../utils/statusMapping';

describe('statusMapping', () => {
  it('преобразует серверные статусы в отображаемые', () => {
    expect(toDisplayStatus('Backlog')).toBe('To do');
    expect(toDisplayStatus('InProgress')).toBe('In progress');
    expect(toDisplayStatus('Done')).toBe('Done');
  });

  it('преобразует отображаемые статусы в серверные', () => {
    expect(toServerStatus('To do')).toBe('Backlog');
    expect(toServerStatus('In progress')).toBe('InProgress');
    expect(toServerStatus('Done')).toBe('Done');
  });
});