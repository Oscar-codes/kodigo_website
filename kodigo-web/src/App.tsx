import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { Layout } from "@/components/layout/Layout";
import { AboutPage } from "@/pages/AboutPage";
import { BootcampDetailPage } from "@/pages/BootcampDetailPage";
import { BootcampsPage } from "@/pages/BootcampsPage";
import { HomePage } from "@/pages/HomePage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { ProfessionalPage } from "@/pages/ProfessionalPage";
import { AnalyticsTracker } from "@/services/analytics";
import { GlobalStyle } from "@/styles/GlobalStyle";
import { theme } from "@/styles/theme";

export const App = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <BrowserRouter>
      <AnalyticsTracker />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="bootcamps" element={<BootcampsPage />} />
          <Route path="bootcamps/:slug" element={<BootcampDetailPage />} />
          <Route path="nosotros" element={<AboutPage />} />
          <Route path="profesional" element={<ProfessionalPage />} />
          <Route path="profesional/:slug" element={<ProfessionalPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ThemeProvider>
);
