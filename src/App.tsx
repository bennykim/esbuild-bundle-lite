import useHMR from "./hooks/useHMR";

const App = () => {
  useHMR();
  return <h1>Hello, React with esbuild</h1>;
};

export default App;
