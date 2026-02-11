import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ModelsListPage } from './pages/ModelsListPage';
import { ModelDetailPage } from './pages/ModelDetailPage';
import { NicheDetailPage } from './pages/NicheDetailPage';
import { NichesListPage } from './pages/NichesListPage';
import { ContentListPage } from './pages/ContentListPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { StudioPage } from './pages/StudioPage';
import { AppLayout } from './components/layout/AppLayout';
import { isAuthenticated } from './lib/auth';

function ProtectedRoute({ children }: { children: JSX.Element }) {
    return isAuthenticated() ? children : <Navigate to="/login" replace />;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/" element={<DashboardPage />} />
                    <Route path="/models" element={<ModelsListPage />} />
                    <Route path="/models/:modelId" element={<ModelDetailPage />} />
                    <Route path="/niches" element={<NichesListPage />} />
                    <Route path="/niches/:nicheId" element={<NicheDetailPage />} />
                    <Route path="/content" element={<ContentListPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/studio" element={<StudioPage />} />
                    <Route path="/posts/:postId" element={<PostDetailPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
