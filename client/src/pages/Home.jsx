import Header from "../components/header/Header";
import Hero from "../components/home-sections/Hero";
import Presentation from "../components/home-sections/Presentation";
import Functionalities from "../components/home-sections/Functionalities";
import Footer from "../components/home-sections/Footer";
import '../components/home-sections/home.css'

function Home() {
  return (
    <>
    <Header />
    <main id="wrapper">
      <Hero />
      <Presentation />
      <Functionalities />
    </main>
    <Footer />
    </>
  )
};

export default Home