import { it, expect, jest } from '@jest/globals';
import { ReferenceCount } from '../src';

it("test ReferenceCount functionality", () => {
  const rc = new ReferenceCount()

  const mockOnCountChange = jest.fn((key: string, count: number) => {});

  rc.subscribeCountChange(mockOnCountChange);
  rc.retain("A")
  expect(rc.getCount("A")).toBe(1);
  expect(mockOnCountChange.mock.calls.length).toBe(1);
  expect(mockOnCountChange.mock.lastCall?.[0]).toBe("A");
  expect(mockOnCountChange.mock.lastCall?.[1]).toBe(1);

  rc.retain("B");
  expect(rc.getCount("A")).toBe(1);
  expect(rc.getCount("B")).toBe(1);
  expect(mockOnCountChange.mock.calls.length).toBe(2);
  expect(mockOnCountChange.mock.lastCall?.[0]).toBe("B");
  expect(mockOnCountChange.mock.lastCall?.[1]).toBe(1);

  rc.retain("A", 2);
  expect(rc.getCount("A")).toBe(3);
  expect(rc.getCount("B")).toBe(1);
  expect(mockOnCountChange.mock.calls.length).toBe(3);
  expect(mockOnCountChange.mock.lastCall?.[0]).toBe("A");
  expect(mockOnCountChange.mock.lastCall?.[1]).toBe(3);

  rc.release("B");
  expect(rc.getCount("A")).toBe(3);
  expect(rc.getCount("B")).toBe(undefined);
  expect(mockOnCountChange.mock.calls.length).toBe(4);
  expect(mockOnCountChange.mock.lastCall?.[0]).toBe("B");
  expect(mockOnCountChange.mock.lastCall?.[1]).toBe(0);

  rc.unsubscribeCountChange(mockOnCountChange);
  rc.release("A", 2);
  expect(rc.getCount("A")).toBe(1);
  expect(rc.getCount("B")).toBe(undefined);
  expect(mockOnCountChange.mock.calls.length).toBe(4);

  rc.release("A");
  expect(rc.getCount("A")).toBe(undefined);
  expect(rc.getCount("B")).toBe(undefined);
  expect(rc.getCount("C")).toBe(undefined);
  expect(mockOnCountChange.mock.calls.length).toBe(4);

  rc.release("X");
  expect(rc.getCount("X")).toBe(undefined);

});