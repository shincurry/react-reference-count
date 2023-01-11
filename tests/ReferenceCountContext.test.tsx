import { jest, it, expect } from '@jest/globals';
import React, { useEffect, useState } from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import { createReferenceCountContext } from '../src';

const Context = createReferenceCountContext()

it("test ReferenceCountContext functionality", async () => {
  const onCountChange = jest.fn((key: string, count: number) => {})

  function TestComponentWrapper(props: { onCountChange: (key: string, count: number) => void }) {
    return (
      <Context.Provider>
        <TestComponent onCountChange={props.onCountChange} />
      </Context.Provider>
    )
  }
  function TestComponent(props: { onCountChange: (key: string, count: number) => void }) {
    const [array] = useState<string[]>(["A", "A", "B", "B", "A", "C"])
    const [len, setLen] = useState<number>(0);

    const { getCount } = Context.useContextValue()
    Context.useCountWatch(props.onCountChange);

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
            <TestItem key={index} name={name} />
          )
        })}

        <div data-testid="count:A">{getCount("A")}</div>
        <div data-testid="count:B">{getCount("B")}</div>
        <div data-testid="count:C">{getCount("C")}</div>
      </div>
    )
  }
  function TestItem(props: { name: string }) {
    const { retain, release } = Context.useReference()

    useEffect(() => {
      retain(props.name, 2);
      return () => {
        release(props.name, 2);
      }
    }, [])

    return (
      <div>item: {props.name}</div>
    )
  }

  const renderered = render(
    <TestComponentWrapper onCountChange={onCountChange} />
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
    expect(countA.textContent).toBe('2')
    expect(countB.textContent).toBe('')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(1)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(2)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('4')
    expect(countB.textContent).toBe('')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(2)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(4)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('4')
    expect(countB.textContent).toBe('2')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(3)
    expect(onCountChange.mock.lastCall![0]).toBe("B")
    expect(onCountChange.mock.lastCall![1]).toBe(2)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('4')
    expect(countB.textContent).toBe('4')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(4)
    expect(onCountChange.mock.lastCall![0]).toBe("B")
    expect(onCountChange.mock.lastCall![1]).toBe(4)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('6')
    expect(countB.textContent).toBe('4')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(5)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(6)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('6')
    expect(countB.textContent).toBe('4')
    expect(countC.textContent).toBe('2')
    expect(onCountChange.mock.calls.length).toBe(6)
    expect(onCountChange.mock.lastCall![0]).toBe("C")
    expect(onCountChange.mock.lastCall![1]).toBe(2)
  });

  fireEvent.click(button2)
  await waitFor(() => {
    expect(countA.textContent).toBe('6')
    expect(countB.textContent).toBe('4')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(7)
    expect(onCountChange.mock.lastCall![0]).toBe("C")
    expect(onCountChange.mock.lastCall![1]).toBe(0)
  });

});

it("test ReferenceCountContext AutoReference", async () => {
  const onCountChange = jest.fn((key: string, count: number) => {})

  function TestComponentWrapper(props: { onCountChange: (key: string, count: number) => void }) {
    return (
      <Context.Provider>
        <TestComponent onCountChange={props.onCountChange} />
      </Context.Provider>
    )
  }
  function TestComponent(props: { onCountChange: (key: string, count: number) => void }) {
    const [array] = useState<string[]>(["A", "A", "B", "B", "A", "C"])
    const [len, setLen] = useState<number>(0);

    const { getCount } = Context.useContextValue()
    Context.useCountWatch(props.onCountChange);

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
            <TestItemAuto key={index} name={name} />
          )
        })}

        <div data-testid="count:A">{getCount("A")}</div>
        <div data-testid="count:B">{getCount("B")}</div>
        <div data-testid="count:C">{getCount("C")}</div>
      </div>
    )
  }
  function TestItemAuto(props: { name: string }) {
    Context.useAutoReference(props.name)
    Context.useAutoReference(props.name, 1)
    return (
      <div>item: {props.name}</div>
    )
  }

  const renderered = render(
    <TestComponentWrapper onCountChange={onCountChange} />
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
    expect(countA.textContent).toBe('2')
    expect(countB.textContent).toBe('')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(2)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(2)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('4')
    expect(countB.textContent).toBe('')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(4)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(4)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('4')
    expect(countB.textContent).toBe('2')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(6)
    expect(onCountChange.mock.lastCall![0]).toBe("B")
    expect(onCountChange.mock.lastCall![1]).toBe(2)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('4')
    expect(countB.textContent).toBe('4')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(8)
    expect(onCountChange.mock.lastCall![0]).toBe("B")
    expect(onCountChange.mock.lastCall![1]).toBe(4)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('6')
    expect(countB.textContent).toBe('4')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(10)
    expect(onCountChange.mock.lastCall![0]).toBe("A")
    expect(onCountChange.mock.lastCall![1]).toBe(6)
  });

  fireEvent.click(button1)
  await waitFor(() => {
    expect(countA.textContent).toBe('6')
    expect(countB.textContent).toBe('4')
    expect(countC.textContent).toBe('2')
    expect(onCountChange.mock.calls.length).toBe(12)
    expect(onCountChange.mock.lastCall![0]).toBe("C")
    expect(onCountChange.mock.lastCall![1]).toBe(2)
  });

  fireEvent.click(button2)
  await waitFor(() => {
    expect(countA.textContent).toBe('6')
    expect(countB.textContent).toBe('4')
    expect(countC.textContent).toBe('')
    expect(onCountChange.mock.calls.length).toBe(14)
    expect(onCountChange.mock.lastCall![0]).toBe("C")
    expect(onCountChange.mock.lastCall![1]).toBe(0)
  });

});

it("Hooks from ReferenceCountContext should used in ReferenceCountContext.Provider", async () => {
  function TestComponent() {
    Context.useCountWatch(() => {})
    return (
      <div></div>
    )
  }

  const t = () => {
    render(
      <TestComponent />
    );
  }
  toThrowSilently(t);
});

it("test ReferenceCountContext useContextValue empty errorMessage", () => {
  function TestComponentWrapper() {
    return (
      <Context.Provider>
        <TestComponent />
      </Context.Provider>
    )
  }

  function TestComponent() {

    const {} = Context.useContextValue()

    return (
      <div></div>
    )
  }

  render(
    <TestComponentWrapper />
  );
})

function toThrowSilently(fn: Function) {
  jest.spyOn(console, "error");
  jest.spyOn(console, "warn");
  (console.error as any).mockImplementation(() => {});
  (console.warn as any).mockImplementation(() => {});
  expect(fn).toThrow();
  (console.error as any).mockRestore();
  (console.warn as any).mockRestore();
}