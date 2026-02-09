import { buildSections, getRandomUuid, ROLES, TABS } from '../../../src/utils/common';

describe('utils/common', () => {
  test('exports roles and tabs', () => {
    expect(ROLES).toEqual(['Admin', 'Manager']);
    expect(TABS).toEqual(['All', 'Admin', 'Manager']);
  });

  test('buildSections groups and sorts by first letter', () => {
    const data = [
      { _id: '1', id: '1', name: 'bob', role: 'Admin', email: 'b@a.com' },
      { _id: '2', id: '2', name: 'Alice', role: 'Manager', email: 'a@a.com' },
      { _id: '3', id: '3', name: 'alex', role: 'Admin', email: 'c@a.com' },
    ];

    const sections = buildSections(data as any);

    expect(sections.map(s => s.title)).toEqual(['A', 'B']);
    expect(sections[0].data.map(u => u.name)).toEqual(['alex', 'Alice']);
    expect(sections[1].data[0].id).toBe('1');
  });

  test('getRandomUuid returns a uuid', () => {
    expect(getRandomUuid()).toBe('uuid');
  });
});
