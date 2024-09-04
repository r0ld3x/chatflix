type Awaited<T> = T extends Promise<infer U> ? U : never;

interface AwaitProps<T extends Promise<any>[]> {
  promises: [...T];
  // eslint-disable-next-line no-unused-vars
  children: (...values: { [K in keyof T]: Awaited<T[K]> }) => JSX.Element;
}

export default async function Await<T extends Promise<any>[]>({
  promises,
  children,
}: AwaitProps<T>) {
  const data = await Promise.all(promises);

  return children(...(data as any));
}
