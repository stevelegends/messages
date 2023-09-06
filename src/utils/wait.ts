export default function wait(value: number) {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(null);
    }, value || 1000),
  );
}
