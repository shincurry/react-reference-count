import { jest, it, expect } from '@jest/globals';
import React, { useEffect, useState } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { useReferenceCount } from '../src';


it("test useReferenceCount functionality", async () => {
  const onCountChange = jest.fn((key: string, count: number) => {})

  function TestComponent(props: { onCountChange: (key: string, count: number) => void }) {
    const [array] = useState<string[]>(["A", "A", "B", "B", "A", "C"])
    const [len, setLen] = useState<number>(0);

    const { getCount, retain, release } = useReferenceCount(props.onCountChange)

    return (
      <div>
        <button
          data-testid="len+1"
          onClick={() => {
            setLen((oldValue) => {
              return oldValue + 1;
            })
          }}></button>
        <button
          data-testid="len-1"
          onClick={() => {
            setLen((oldValue) => {
              return Math.max(oldValue - 1, 0);
            })
          }}></button>

        {array.slice(0, len).map((name, index) => {
          return (
            <TestItem key={index} name={name} retain={retain} release={release} />
          )
        })}

        <div data-testid="count:A">{getCount("A")}</div>
        <div data-testid="count:B">{getCount("B")}</div>
        <div data-testid="count:C">{getCount("C")}</div>
      </div>
    )
  }
  function TestItem(props: { name: string; retain: (key: string, n?: number) => void; release: (key: string, n?: number) => void; }) {
    useEffect(() => {
      props.retain(props.name);
      return () => {
        props.release(props.name);
      }
    }, [])

    return (
      <div>item: {props.name}</div>
    )
  }

  const renderered = render(
    <TestComponent onCountChange={onCountChange} />
  );

  const button1 = renderered.getByTestId("len+1")
  const button2 = renderered.getByTestId("len-1")

  const countA = renderered.getByTestId("count:A")
  const countB = renderered.getByTestId("count:B")
  const countC = renderered.getByTestId("count:C")

  expect(countA.textContent).toBe('')
  expect(countB.textContent).toBe('')
  expect(countC.textContent).toBe('')
  expect(onCountChange.mock.calls.length).toBe(0)

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('1')
    expect(countB.textContent).toBe('')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(1)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(1)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('2')
    expect(countB.textContent).toBe('')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(2)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(2)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('2')
    expect(countB.textContent).toBe('1')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(3)
    expect(onCountChange.mock.lastCall![0]).toBe("B")
    expect(onCountChange.mock.lastCall![1]).toBe(1)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('2')
    expect(countB.textContent).toBe('2')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(4)
    expect(onCountChange.mock.lastCall![0]).toBe("B")
    expect(onCountChange.mock.lastCall![1]).toBe(2)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('3')
    expect(countB.textContent).toBe('2')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(5)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(3)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('3')
    expect(countB.textContent).toBe('2')
    expect(countC.textContent).toBe('1')
    expect(onCountChange.mock.calls.length).toBe(6)
    expect(onCountChange.mock.lastCall![0]).toBe("C")
    expect(onCountChange.mock.lastCall![1]).toBe(1)
  });

  fireEvent.click(button2)
  await waitFor(() => {
    expect(countA.textContent).toBe('3')
    expect(countB.textContent).toBe('2')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(7)
    expect(onCountChange.mock.lastCall![0]).toBe("C")
    expect(onCountChange.mock.lastCall![1]).toBe(0)
  });

});

it("test useReferenceCount empty props onCountChange", async () => {
  function TestComponent() {

    useReferenceCount()

    return (
      <div></div>
    )
  }

  render(
    <TestComponent />
  );

});