import HeaderV2 from "../components/header-v2/HeaderV2"
import Container from "../components/notes/Container"

function Board() {
  return (
    <>
    <HeaderV2 />
    <main className="relative flex flex-col mt-[70px]">
      <Container />
    </main>
    </>
  )
};

export default Board