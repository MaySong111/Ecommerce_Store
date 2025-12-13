import useStore from "../store/store";

export default function ContactPage() {
  const count = useStore((state) => state.count);
  console.log("Current count from store:", count);

  const increment = useStore((state) => state.increment);

  return (
    <div>
      {count}
      <button onClick={increment}>Increase Count</button>
    </div>
  );
}
