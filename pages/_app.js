import Navbar from '../components/Navbar';
import '../style.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}