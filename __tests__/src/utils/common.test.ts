import { ZellerCustomer } from '../../../src/shared/services/graphql/types';
import { buildSections, getRandomUuid, ROLES, TABS } from '../../../src/shared/utils/common';
const data = [
  { _id: '1', id: '1', name: 'bob', role: 'Admin', email: 'b@a.com' },
  { _id: '2', id: '2', name: 'Alice', role: 'Manager', email: 'a@a.com' },
  { _id: '3', id: '3', name: 'alex', role: 'Admin', email: 'c@a.com' },
] as ZellerCustomer[];

describe('utils/common', () => {
  test('exports roles and tabs', () => {
    expect(ROLES).toEqual(['Admin', 'Manager']);
    expect(TABS).toEqual(['All', 'Admin', 'Manager']);
  });

  test('buildSections groups and sorts by first letter', () => {
   

    const sections = buildSections(data);

    expect(sections.map(s => s.title)).toEqual(['A', 'B']);
    expect(sections[0].data.map(u => u.name)).toEqual(['alex', 'Alice']);
    expect(sections[1].data[0].id).toBe('1');
  });

  test('getRandomUuid returns a uuid', () => {
    expect(getRandomUuid()).toBe('uuid');
  });

  test('if name is not there then it should return empty', () => {
    const emptyNameData = [
      { _id: '1', id: '1', name: undefined, role: 'Admin', email: 'b@a.com' },
      { _id: '2', id: '2', name: undefined, role: 'Manager', email: 'a@a.com' },
      { _id: '3', id: '3', name: undefined, role: 'Admin', email: 'c@a.com' },
    ] as ZellerCustomer[];

    const sections = buildSections(emptyNameData);
    expect(sections).toEqual([]);


    emptyNameData[0].name = "Test1";
    emptyNameData[1].name = "Test1";
    emptyNameData[2].name = "Test1";
    delete emptyNameData[0]._id;
    delete emptyNameData[1]._id;
    delete emptyNameData[2]._id;
    const sections2 = buildSections(emptyNameData);

    expect(sections2.map((s) => s.data)).toHaveLength(1)
  })
});
