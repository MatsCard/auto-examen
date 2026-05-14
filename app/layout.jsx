import "./globals.css";

export const metadata = {
  title: "Juego de Reacción",
  description: "Juego rápido de reacción con rondas de símbolos X y +."
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
