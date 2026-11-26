import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./onboarding/Onboarding";
import Next from "./pages/Next";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/next" element={<Next />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
