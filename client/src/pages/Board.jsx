import HeaderV2 from "../components/header-v2/HeaderV2";
import Container from "../components/notes/Container";

function Board() {
  return (
    <>
    <HeaderV2 />
    <main id="notes-wrapper">
      <Container />
    </main>
    </>
  )
};

export default Board