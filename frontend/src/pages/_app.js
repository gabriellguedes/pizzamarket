// src/pages/_app.js
import "../styles/styles.css"; // Importando o CSS que acabamos de criar

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
