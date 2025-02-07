import Footer from "../components/Footer";
import Header from "../components/Header";
import EventDashboard from "../pages/EventDashboard";

const MainLayout = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Header />
          <EventDashboard />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
