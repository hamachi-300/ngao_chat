import "./globals.css"
import AuthProvider from "./components/SessionProvider";
import NavBar from "./components/NavBar"

export default function RootLayout({ children, Session }) {

  return (
    <html lang="en">
      <body>
        <AuthProvider session={Session}>
          <div>
            <NavBar />
            <div className="mt-16">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}