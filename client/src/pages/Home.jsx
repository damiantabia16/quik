import Header from "../components/header/Header";
import Hero from "../components/home-sections/Hero";
import Presentation from "../components/home-sections/Presentation";
import Functionalities from "../components/home-sections/Functionalities";

function Home() {
  return (
    <>
    <Header />
    <main id="wrapper">
      <Hero />
      <Presentation />
      <Functionalities />
    </main>
    </>
  )
};

export default Home