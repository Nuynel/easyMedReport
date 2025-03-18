import { expect, test, assert } from 'vitest'
import {
  getOrganDescription,
  isUnchangedNormal,
  getTemplatesForNormal
} from "../methods/utils";
import {OrganDescriptions, Templates} from "#root/types";


// Test for getTemplatesForNormal
test.each<[string, Templates, Record<string, OrganDescriptions>]>([
  [
    'data contains more than one organ',
    {organ1: {healthyDescription: '123', secondDescription: '321'}, organ2: {healthyDescription: '123', secondDescription: '321'}},
    {organ1: {healthyDescription: '123'}, organ2: {healthyDescription: '123'}},
  ],
  [
    'data doesn`t contain healthy state',
    {organ: {firstDescription: '123', secondDescription: '321'}},
    {organ: {}},
  ],
  [
    'one of organs data doesn`t contain healthy state',
    {organ1: {healthyDescription: '123', secondDescription: '321'}, organ2: {firstDescription: '123', secondDescription: '321'}},
    {organ1: {healthyDescription: '123'}, organ2: {}},
  ],
  [
    'data contains only healthy template',
    {organ: {healthyDescription: '123'}},
    {organ: {healthyDescription: '123'}},
  ],
])(
  `getTemplatesForNormal => %s`, (description, data, expected) => {
    assert.deepEqual(
      getTemplatesForNormal(data, 'healthy'),
      expected,
      'Objects don`t match'
    )
  })


// Test for getOrganDescription
test('getOrganDescription return correct organ description', () => {
  expect(
    getOrganDescription(
      ['organ', {firstDescription: '123', secondDescription: '321'}]
    )
  ).toBe('ORGAN: 123\n321')
})


// Test for isUnchangedNormal
test.each<[string, OrganDescriptions, boolean]>([
  [
    'data contains MORE THAN ONE state',
    {healthyDescription: '123', secondDescription: '321'},
    false,
  ],
  [
    'data DOESN`T CONTAIN healthy state',
    {otherDescription: '321'},
    false,
  ],
  [
    'data contains CHANGED healthy state',
    {healthyDescription: '111'},
    false,
  ],
  [
    'data contains only unchanged healthy state',
    {healthyDescription: '123'},
    true,
  ],
])(
  `isUnchangedNormal => %s`, (description, pathologies, expected) => {
    expect(
      isUnchangedNormal(pathologies as OrganDescriptions, {healthyDescription: '123'}, 'healthy')
    ).toBe(expected)
})
