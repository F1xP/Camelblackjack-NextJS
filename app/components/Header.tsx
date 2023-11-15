export default function Header({ text }: { text: string }) {
  return <h1 className="text-5xl text-accent font-bold font-sans text-left w-full small-caps">{text}</h1>;
}
