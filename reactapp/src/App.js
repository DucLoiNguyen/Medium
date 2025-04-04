import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { privateRoutes, publicRoutes } from '~/routes';
import { AuthProvider } from '~/pages/Authen/authcontext';
import { SocketProvider } from '~/pages/Notifi/socketcontext';
import { ProtectedRoute } from '~/pages/Authen/authcontext';
import 'flowbite';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    { publicRoutes.map((route, index) => {
                        const Layout = route.layout;
                        const Page = route.component;
                        return (
                            <Route
                                key={ index }
                                path={ route.path }
                                element={
                                    <Layout>
                                        <Page />
                                    </Layout>
                                }
                            />
                        );
                    }) }
                    { privateRoutes.map((route, index) => {
                        const Layout = route.layout;
                        const Page = route.component;
                        return (
                            <Route
                                key={ index }
                                path={ route.path }
                                element={
                                    <AuthProvider>
                                        <SocketProvider>
                                            <ProtectedRoute>
                                                <Layout>
                                                    <Page />
                                                </Layout>
                                            </ProtectedRoute>
                                        </SocketProvider>
                                    </AuthProvider>
                                }
                            />
                        );
                    }) }

                    <Route path="*" element={ <Navigate to="/" replace /> } />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
