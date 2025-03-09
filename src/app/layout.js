import "./globals.css"
import AuthProvider from "./components/SessionProvider";
import NavBar from "./components/NavBar"
import { SidebarProvider } from "./components/SidebarContext";

export default function RootLayout({ children, Session }) {

  return (
    <html lang="en">
      <body>
        <AuthProvider session={Session}>
          <SidebarProvider>
            <div>
              <NavBar />
              <div className="mt-16">{children}</div>
            </div>
          </SidebarProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
